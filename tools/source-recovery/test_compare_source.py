"""Safety/behavior tests; all inputs are generated in temporary directories."""
import json
from pathlib import Path
import stat
import tempfile
import unittest
from unittest.mock import patch
import zipfile

import compare_source as tool


def project(root: Path, full=True):
    files = {"package.json": json.dumps({"dependencies": {"next": "16.3.2", "sanity": "4"}}),
             "tsconfig.json": "{}", "app/layout.tsx": "export default function Layout() {}",
             "app/page.tsx": "export default function Page() {}", "sanity.config.ts": "import {defineConfig} from 'sanity';"}
    if full:
        for route in tool.DEFAULT_ROUTES:
            files[f"app{route}/page.tsx"] = "export default function Page() {}"
    for name, content in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    return root


class ComparisonTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.reference = project(self.root / "reference")

    def tearDown(self):
        self.tmp.cleanup()

    def zip(self, entries):
        path = self.root / "candidate.zip"
        with zipfile.ZipFile(path, "w") as archive:
            for name, content in entries.items():
                archive.writestr(name, content)
        return path

    def test_directory_changes_and_missing_files(self):
        candidate = project(self.root / "candidate")
        (candidate / "app/page.tsx").write_text("changed")
        (candidate / "extra.md").write_text("new")
        (candidate / "sanity.config.ts").unlink()
        result = tool.compare(self.reference, candidate)
        self.assertEqual(result["comparison"]["changed"], ["app/page.tsx"])
        self.assertEqual(result["comparison"]["added"], ["extra.md"])
        self.assertEqual(result["comparison"]["missing_from_candidate"], ["sanity.config.ts"])
        self.assertEqual(result["status"], "source_evidence_present")

    def test_zip_wrapper_root_is_discovered_without_extraction(self):
        entries = {"backup/site/" + p.relative_to(self.reference).as_posix(): p.read_bytes()
                   for p in self.reference.rglob("*") if p.is_file()}
        archive = self.zip(entries)
        result = tool.compare(self.reference, archive)
        self.assertEqual(result["candidate"]["selected_root"], "backup/site")
        self.assertEqual(result["comparison"]["changed"], [])
        self.assertFalse((self.root / "backup").exists())

    def test_archive_traversal_rejected_even_under_ignored_folder(self):
        for name in ["../escape.ts", "/tmp/escape.ts", "node_modules/../../escape.ts", "x/./page.ts", "x//page.ts", "C:/escape.ts", "x\\escape.ts"]:
            with self.subTest(name=name):
                archive = self.zip({name: "evil"})
                with self.assertRaises(tool.UnsafeInput):
                    tool.compare(self.reference, archive)

    def test_archive_duplicate_paths_rejected(self):
        path = self.root / "duplicate.zip"
        with zipfile.ZipFile(path, "w") as archive:
            archive.writestr("folder/", "")
            archive.writestr("folder", "ambiguous")
        with self.assertRaises(tool.UnsafeInput):
            tool.compare(self.reference, path)

    def test_archive_symlinks_rejected(self):
        info = zipfile.ZipInfo("app/page.tsx")
        info.create_system = 3
        info.external_attr = (stat.S_IFLNK | 0o777) << 16
        path = self.root / "symlink.zip"
        with zipfile.ZipFile(path, "w") as archive:
            archive.writestr(info, "/etc/passwd")
        with self.assertRaises(tool.UnsafeInput):
            tool.compare(self.reference, path)

    def test_directory_source_symlink_rejected(self):
        candidate = project(self.root / "candidate")
        (candidate / "outside.ts").symlink_to(self.reference / "app/page.tsx")
        with self.assertRaises(tool.UnsafeInput):
            tool.compare(self.reference, candidate)

    def test_credentials_are_excluded_before_opening_zip_members(self):
        entries = {p.relative_to(self.reference).as_posix(): p.read_bytes()
                   for p in self.reference.rglob("*") if p.is_file()}
        secret_names = [".env", ".env.production", "service-account.json", ".npmrc", "secrets/token.txt", "private.key"]
        entries.update({name: "DO-NOT-READ-SECRET-FIXTURE" for name in secret_names})
        archive = self.zip(entries)
        original = zipfile.ZipFile.open
        def guarded_open(instance, member, *args, **kwargs):
            name = member.filename if isinstance(member, zipfile.ZipInfo) else member
            self.assertNotIn(name, secret_names)
            return original(instance, member, *args, **kwargs)
        with patch.object(zipfile.ZipFile, "open", guarded_open):
            result = tool.compare(self.reference, archive)
        self.assertEqual(result["candidate"]["ignored_credential_entries"], 6)
        self.assertNotIn("DO-NOT-READ", json.dumps(result))
        self.assertFalse(set(secret_names) & result["candidate"]["sha256"].keys())

    def test_directory_credentials_and_dependencies_never_opened(self):
        candidate = project(self.root / "candidate")
        (candidate / ".env.production").write_text("DO-NOT-READ")
        (candidate / "node_modules/pkg").mkdir(parents=True)
        (candidate / "node_modules/pkg/package.json").write_text("NOT VALID")
        original = tool.os.open
        def guarded_open(path, *args, **kwargs):
            self.assertNotIn(".env.production", str(path))
            self.assertNotIn("node_modules", str(path))
            return original(path, *args, **kwargs)
        with patch.object(tool.os, "open", guarded_open):
            result = tool.compare(self.reference, candidate)
        self.assertEqual(result["candidate"]["ignored_credential_entries"], 1)

    def test_compiled_only_is_blocked(self):
        archive = self.zip({".next/server/app/page.js": "compiled", ".next/package.json": "{}", ".next/types/app/page.ts": "generated types"})
        result = tool.compare(self.reference, archive)
        self.assertEqual(result["status"], "blocked")
        self.assertEqual(result["candidate"]["typescript_source_count"], 0)
        self.assertEqual(result["candidate"]["source_file_count"], 0)
        self.assertIn(".next", result["candidate"]["compiled_artifact_locations"])

    def test_missing_manifest_and_layout_are_blocked(self):
        candidate = self.root / "incomplete"
        (candidate / "app").mkdir(parents=True)
        (candidate / "app/page.tsx").write_text("export default function Page() {}")
        result = tool.compare(self.reference, candidate)
        self.assertEqual(result["status"], "blocked")
        self.assertGreaterEqual(len(result["candidate"]["blockers"]), 3)

    def test_missing_expected_routes_only_requests_review(self):
        candidate = project(self.root / "candidate", full=False)
        (candidate / "app/campaigns").mkdir()
        (candidate / "app/campaigns/page.tsx").write_text("export default function Page() {}")
        result = tool.compare(self.reference, candidate)
        self.assertEqual(result["status"], "needs_review")
        self.assertFalse(result["candidate"]["expected_routes"]["/admin/campaigns"]["found"])

    def test_src_app_route_evidence(self):
        candidate = project(self.root / "candidate")
        (candidate / "src").mkdir()
        (candidate / "app").rename(candidate / "src/app")
        result = tool.compare(self.reference, candidate)
        self.assertEqual(result["status"], "source_evidence_present")
        self.assertTrue(result["candidate"]["expected_routes"]["/products/[category]"]["found"])

    def test_multiple_manifests_require_explicit_root(self):
        candidate = self.root / "candidate"
        project(candidate / "one")
        project(candidate / "two")
        with self.assertRaises(tool.UnsafeInput):
            tool.compare(self.reference, candidate)
        self.assertEqual(tool.compare(self.reference, candidate, "one")["status"], "source_evidence_present")

    def test_size_limit_rejected(self):
        archive = self.zip({"large.ts": "x" * 200})
        with patch.object(tool, "MAX_FILE_BYTES", 100):
            with self.assertRaises(tool.UnsafeInput):
                tool.compare(self.reference, archive)


if __name__ == "__main__":
    unittest.main()
