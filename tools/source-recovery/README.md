# Source recovery tools

These Python 3 standard-library tools support the existing Mobile World source-reconciliation task. They never deploy, change application source, read customer records or modify cloud configuration. They are not substitutes for the missing original production source.

## Compare an editable recovery candidate

From the repository root:

```sh
python tools/source-recovery/compare_source.py /workspace/mobile-world-website /workspace/recovered-source.zip --output /workspace/recovery/candidate-comparison.json
```

Inputs may be directories or ZIP archives. ZIP members are inspected without extraction/execution. Credential-like paths, dependency/build caches and media binaries are excluded; source/config/text content is hashed without emitting its contents. Use `--candidate-root` when a ZIP contains multiple projects. Default expected routes are `/admin/analytics`, `/admin/business`, `/admin/campaigns`, `/products/[category]`; repeat `--require-route` to change that review list explicitly.

Exit 0 means static source evidence is present, **not that production provenance/completeness or deployment approval is established**. Exit 2 means blocked or needs review; inspect the JSON. Exit 3 means unsafe/unreadable input. Reports must be outside input trees and must not already exist. Refactors/alternate routing can require manual reconciliation. Separately inspect assets, data, secrets bindings, dependencies, Git history and deployed behavior.

## Read Vercel deployment provenance

```sh
python tools/source-recovery/inspect_vercel.py --out /workspace/recovery/vercel-provenance.json
```

Uses the securely injected `VERCEL_TOKEN` binding and inherited HTTP proxy/TLS trust. The configured token must authorize the existing Vercel project. Default project/team/historical deployment identifiers come from the owner handover; current API evidence determines whether they remain valid. Requests are GET-only and use an explicit output allowlist; no environment-variable values or arbitrary deployment metadata are saved. It inspects project, domains, recent deployments and the historical deployment; **it does not retrieve original source files**. The current production target is distinguished from the historical checkpoint.

Live API execution remains blocked by environment network policy and missing Vercel binding as of the handover checkpoint. Unit tests use fixtures; they are not live Vercel validation.

## Verification

```sh
python -m unittest discover -s tools/source-recovery -p 'test_*.py' -v
```

Tests cover archive traversal/symlinks/duplicate paths/size limits, skipped credentials, compiled-only candidates, missing source, route evidence, changes/missing files, explicit roots and metadata redaction/read-only access behavior. No external account or production data is needed.
