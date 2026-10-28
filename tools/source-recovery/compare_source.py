#!/usr/bin/env python3
"""Read-only editable-source inventory/comparison; never extracts or executes a ZIP."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys
import zipfile

IGNORED_DIRS = {"node_modules", ".git", ".next", "dist", "build", "out", "coverage",
                ".vercel", ".cache", ".turbo", ".idea", "__pycache__"}
SECRET_DIRS = {".aws", ".azure", ".ssh", ".gnupg", ".secrets", "secrets", "credentials"}
SECRET_NAMES = {".npmrc", ".yarnrc", ".yarnrc.yml", ".netrc", ".pypirc", "id_rsa",
                "id_ed25519", "credentials", "credentials.json", "secrets.json",
                "service-account.json", "serviceaccount.json", "firebase-adminsdk.json"}
SOURCE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts",
               ".json", ".css", ".scss", ".sass", ".less", ".md", ".mdx", ".html",
               ".yaml", ".yml", ".toml", ".txt", ".graphql", ".gql"}
CODE_EXTS = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts"}
DEFAULT_ROUTES = ["/admin/analytics", "/admin/business", "/admin/campaigns", "/products/[category]"]
MAX_ENTRIES = 100_000
MAX_FILE_BYTES = 5 * 1024 * 1024
MAX_TOTAL_BYTES = 128 * 1024 * 1024


class UnsafeInput(Exception):
    pass


def safe_name(name: str) -> str:
    # ZIP is POSIX, but reject Windows separators/drives too. Reject aliases before normalization.
    if not name or "\\" in name or name.startswith("/") or re.match(r"^[A-Za-z]:", name):
        raise UnsafeInput("Archive/root contains an absolute, drive, or backslash path")
    raw = name.rstrip("/")
    parts = raw.split("/")
    if any(p in {"", ".", ".."} for p in parts) or any(ord(c) < 32 or ord(c) == 127 for c in raw):
        raise UnsafeInput("Archive/root contains traversal, ambiguous, or control-character paths")
    return raw


def is_secret(name: str) -> bool:
    parts = PurePosixPath(name).parts
    low = [p.lower() for p in parts]
    base = low[-1]
    return (any(p in SECRET_DIRS for p in low) or base in SECRET_NAMES or base.startswith(".env")
            or any(t in base for t in ("credential", "secret", "service-account", "service_account", "serviceaccount", "firebase-adminsdk"))
            or base.endswith((".pem", ".key", ".p12", ".pfx", ".keystore", ".jks")))


def ignored(name: str) -> bool:
    return any(p in IGNORED_DIRS for p in PurePosixPath(name).parts)


def compiled(name: str) -> bool:
    parts = PurePosixPath(name).parts
    return ".next" in parts or ".vercel" in parts or "_next" in parts


def selected(name: str) -> bool:
    return not is_secret(name) and not ignored(name) and PurePosixPath(name).suffix.lower() in SOURCE_EXTS


class Inventory:
    def __init__(self, path: Path):
        self.path = path
        self.entries: dict[str, object] = {}
        self.compiled_locations: set[str] = set()
        self.ignored_secret_entries = 0
        self.zip = None
        self.bytes_read = 0
        self.cache: dict[str, bytes] = {}
        if path.is_symlink():
            raise UnsafeInput("Input root must not be a symbolic link")
        if path.is_dir():
            self.kind = "directory"
            self._directory()
        elif path.is_file() and zipfile.is_zipfile(path):
            self.kind = "zip"
            self._archive()
        else:
            raise UnsafeInput("Input must be an accessible directory or ZIP")

    def _directory(self):
        count = 0
        def fail(_error):
            raise UnsafeInput("Directory traversal failed; inventory is incomplete")
        for root, dirs, files in os.walk(self.path, followlinks=False, onerror=fail):
            retained = []
            for d in dirs:
                p = Path(root) / d
                rel = p.relative_to(self.path).as_posix()
                if is_secret(rel):
                    self.ignored_secret_entries += 1
                elif ignored(rel):
                    if compiled(rel):
                        self.compiled_locations.add(rel)
                elif p.is_symlink():
                    raise UnsafeInput("Source directory contains a symlink; refusing external traversal")
                else:
                    retained.append(d)
            dirs[:] = retained
            for f in files:
                count += 1
                if count > MAX_ENTRIES:
                    raise UnsafeInput("Directory exceeds inventory entry limit")
                p = Path(root) / f
                rel = p.relative_to(self.path).as_posix()
                safe_name(rel)
                if is_secret(rel):
                    self.ignored_secret_entries += 1
                    continue
                if not selected(rel):
                    continue
                mode = p.lstat().st_mode
                if not stat.S_ISREG(mode):
                    raise UnsafeInput("Selected source is a symlink or non-regular file")
                self.entries[rel] = p

    def _archive(self):
        self.zip = zipfile.ZipFile(self.path)
        infos = self.zip.infolist()
        if len(infos) > MAX_ENTRIES:
            raise UnsafeInput("Archive exceeds entry limit")
        seen = set()
        for info in infos:
            rel = safe_name(info.filename)
            if rel in seen:
                raise UnsafeInput("Archive has duplicate normalized entries")
            seen.add(rel)
            mode = info.external_attr >> 16
            if stat.S_ISLNK(mode) or (stat.S_IFMT(mode) and not (stat.S_ISREG(mode) or stat.S_ISDIR(mode))):
                raise UnsafeInput("Archive contains a symlink or special file")
            if is_secret(rel):
                self.ignored_secret_entries += 1
                continue
            if compiled(rel):
                parts = PurePosixPath(rel).parts
                i = next(i for i, part in enumerate(parts) if part in {".next", ".vercel", "_next"})
                self.compiled_locations.add("/".join(parts[:i + 1]))
            if info.is_dir() or not selected(rel):
                continue
            if info.flag_bits & 1:
                raise UnsafeInput("Selected source is encrypted; cannot validate")
            if info.file_size > MAX_FILE_BYTES:
                raise UnsafeInput("Selected source exceeds per-file size limit")
            if info.file_size > 1024 * 1024 and info.file_size / max(info.compress_size, 1) > 250:
                raise UnsafeInput("Selected source has excessive compression ratio")
            self.entries[rel] = info

    def read(self, name: str) -> bytes:
        # No caller can read a path excluded from the inventory, including credentials.
        if name not in self.entries:
            raise UnsafeInput("Attempted to read a file outside the source inventory")
        if name in self.cache:
            return self.cache[name]
        entry = self.entries[name]
        if self.zip:
            size = entry.file_size
            handle = self.zip.open(entry)
        else:
            fd = os.open(entry, os.O_RDONLY | os.O_NOFOLLOW)
            meta = os.fstat(fd)
            if not stat.S_ISREG(meta.st_mode):
                os.close(fd)
                raise UnsafeInput("Source changed to a non-regular file during inventory")
            size = meta.st_size
            handle = os.fdopen(fd, "rb")
        with handle:
            if size > MAX_FILE_BYTES or self.bytes_read + size > MAX_TOTAL_BYTES:
                raise UnsafeInput("Source exceeds read limits")
            data = handle.read(MAX_FILE_BYTES + 1)
        if len(data) != size or len(data) > MAX_FILE_BYTES:
            raise UnsafeInput("Source changed during read or exceeded limits")
        self.bytes_read += len(data)
        self.cache[name] = data
        return data

    def close(self):
        if self.zip:
            self.zip.close()


def root_candidates(inv: Inventory) -> list[str]:
    # Name-only discovery, before opening any manifest. Explicit selection handles monorepos.
    return sorted(str(PurePosixPath(n).parent) for n in inv.entries if PurePosixPath(n).name == "package.json")


def under_root(inv: Inventory, root: str) -> dict[str, str]:
    prefix = "" if root == "." else root + "/"
    return {name[len(prefix):]: name for name in inv.entries if name.startswith(prefix)}


def analyze(inv: Inventory, root: str, expected: list[str]) -> dict:
    names = under_root(inv, root)
    hashes = {rel: hashlib.sha256(inv.read(actual)).hexdigest() for rel, actual in sorted(names.items())}
    blockers = []
    manifest = {}
    if "package.json" not in names:
        blockers.append("No editable project package.json at selected root")
    else:
        try:
            manifest = json.loads(inv.read(names["package.json"]))
            if not isinstance(manifest, dict):
                raise ValueError()
        except (ValueError, UnicodeError):
            blockers.append("package.json is not a valid JSON object")
            manifest = {}
    deps = {}
    for section in ("dependencies", "devDependencies"):
        if isinstance(manifest.get(section), dict):
            deps.update(manifest[section])
    if "next" not in deps:
        blockers.append("Manifest does not declare next")
    route_sources = {}
    for rel in names:
        match = re.fullmatch(r"(?:src/)?app/(.*?)(?:/)?page\.(?:tsx|ts|jsx|js|mdx)", rel)
        if match:
            segments = [p for p in match[1].split("/") if p and not p.startswith(("(", "@"))]
            route_sources.setdefault("/" + "/".join(segments), []).append(rel)
        match = re.fullmatch(r"(?:src/)?pages/(.*)\.(?:tsx|ts|jsx|js|mdx)", rel)
        if match and not match[1].startswith(("api/", "_")):
            route = match[1].removesuffix("/index")
            route = "" if route == "index" else route
            route_sources.setdefault("/" + route, []).append(rel)
    app_sources = [p for p in names if re.match(r"(?:src/)?app/", p) and PurePosixPath(p).suffix in CODE_EXTS]
    if not route_sources:
        blockers.append("No editable Next.js page source found; compiled output cannot substitute for source")
    if app_sources and not any(re.fullmatch(r"(?:src/)?app/layout\.(?:tsx|ts|jsx|js)", n) for n in names):
        blockers.append("App Router sources found without a root layout; route-group root layouts need manual review")
    ts_files = [n for n in names if PurePosixPath(n).suffix in {".ts", ".tsx", ".mts", ".cts"} and not n.endswith(".d.ts")]
    if ts_files and "tsconfig.json" not in names:
        blockers.append("TypeScript source found without tsconfig.json at selected root")
    cms_files = []
    for rel, actual in names.items():
        if PurePosixPath(rel).suffix not in CODE_EXTS:
            continue
        text = inv.read(actual).decode("utf-8", errors="replace")
        # Report filenames, never source strings, connection IDs or configuration values.
        if (re.search(r"(?:from\s*|import\s*\(|require\s*\()\s*['\"](?:sanity|next-sanity|@sanity/)", text)
                or re.search(r"(?:^|/)(?:sanity\.(?:config|cli)|schemaTypes|schema-types)(?:[./]|$)", rel)):
            cms_files.append(rel)
    cms_deps = sorted(k for k in deps if k in {"sanity", "next-sanity"} or k.startswith("@sanity/"))
    editor_routes = {r: files for r, files in route_sources.items() if any(p in {"studio", "editor", "sanity"} for p in r.split("/"))}
    review = []
    missing = [r for r in expected if r not in route_sources]
    if missing:
        review.append("Known expected routes are absent from static file-route evidence; alternate routing/architecture needs review")
    if not cms_files and not cms_deps and not editor_routes:
        review.append("No Sanity import/config/dependency or editor/studio page evidence found")
    return {"kind": inv.kind, "selected_root": root, "source_file_count": len(hashes),
            "typescript_source_count": len(ts_files), "compiled_artifact_locations": sorted(inv.compiled_locations),
            "ignored_credential_entries": inv.ignored_secret_entries, "blockers": blockers,
            "review_flags": review, "routes": route_sources,
            "expected_routes": {r: {"found": r in route_sources, "files": route_sources.get(r, [])} for r in expected},
            "cms_editor_evidence": {"dependency_names": cms_deps, "source_files": sorted(cms_files), "editor_routes": editor_routes},
            "sha256": hashes}


def compare(reference: Path, candidate: Path, candidate_root: str | None = None, expected: list[str] | None = None) -> dict:
    required = DEFAULT_ROUTES if expected is None else expected
    ref = cand = None
    try:
        ref, cand = Inventory(reference), Inventory(candidate)
        roots = root_candidates(cand)
        if candidate_root is not None:
            root = "." if candidate_root == "." else safe_name(candidate_root)
        elif len(roots) == 1:
            root = roots[0]
        elif not roots:
            root = "."
        else:
            raise UnsafeInput("Multiple project manifests; use --candidate-root to select one explicitly")
        a, b = analyze(ref, ".", required), analyze(cand, root, required)
        ah, bh = a["sha256"], b["sha256"]
        changed = sorted(p for p in ah.keys() & bh.keys() if ah[p] != bh[p])
        added = sorted(bh.keys() - ah.keys())
        missing = sorted(ah.keys() - bh.keys())
        status = "blocked" if b["blockers"] or a["blockers"] else "needs_review" if b["review_flags"] else "source_evidence_present"
        return {"status": status, "meaning": "Static source evidence only; not production provenance, completeness, build success, or deployment approval",
                "reference": a, "candidate": b,
                "comparison": {"changed": changed, "added": added, "missing_from_candidate": missing,
                               "unchanged_count": len(ah.keys() & bh.keys()) - len(changed)},
                "limits": ["No extraction, execution, copying, network access, source edits or deployments",
                           "Known credential filenames/directories excluded before reads; no content or secret values printed",
                           "Credentials embedded in otherwise ordinary source cannot be identified without reading source; source text is never emitted",
                           "Dependencies, build output, media binaries and ignored cache directories are not hashed",
                           "Static routing detection does not resolve rewrites, generated routes, imports or dependency completeness",
                           "Missing old files may represent intentional refactors; missing expected routes require human review"]}
    finally:
        if ref:
            ref.close()
        if cand:
            cand.close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("reference", type=Path, help="Existing editable checkout root")
    parser.add_argument("candidate", type=Path, help="Recovered editable directory or ZIP")
    parser.add_argument("--candidate-root", help="Project root within candidate, e.g. recovered/site; use . for root")
    parser.add_argument("--require-route", action="append", help="Repeat to replace the default expected routes")
    parser.add_argument("--output", type=Path, help="Write JSON outside both inputs; file must not already exist")
    args = parser.parse_args()
    try:
        if args.output:
            output = args.output.resolve()
            for source in (args.reference, args.candidate):
                resolved = source.resolve()
                if output == resolved or (source.is_dir() and output.is_relative_to(resolved)):
                    raise UnsafeInput("Report must be outside input trees")
        report = compare(args.reference, args.candidate, args.candidate_root, args.require_route)
        payload = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
        if args.output:
            with args.output.open("x", encoding="utf-8") as handle:
                handle.write(payload)
        else:
            print(payload, end="")
        return 0 if report["status"] == "source_evidence_present" else 2
    except (UnsafeInput, OSError, zipfile.BadZipFile, RuntimeError) as exc:
        # OS exceptions may embed filenames; do not print arbitrary paths/content.
        message = str(exc) if isinstance(exc, UnsafeInput) else type(exc).__name__ + ": input could not be safely inspected"
        print(json.dumps({"status": "unsafe_or_unreadable", "error": message}), file=sys.stderr)
        return 3


if __name__ == "__main__":
    sys.exit(main())
