# Business Desk recovery

Implemented 1 November 2026. Owner route: `/admin/business`.

## Enquiries

- Active real entries alone contribute to enquiry counts, confirmed sales, revenue and conversion. Existing entries without new flags retain their previous real-entry behavior.
- Archive is a reversible operation: the record, amount, stage, ID and creation date remain in the same private ledger. Archived real entries disappear from active totals and appear under **Archived entries**. Restore returns them to active totals with their previous stage.
- Every save/archive/restore checks the stored revision. An older tab cannot overwrite a newer edit or resurrect an archived entry. Restore is required before editing an archived record.
- The **Test entry** checkbox applies only when creating a record. That designation cannot later be changed. Test entries remain in their own list and never contribute to real-business totals, even with Sold status or an amount.
- CSV export follows the selected list and date range. It includes explicit Test entry and Archived columns. The ordinary Active export excludes tests and archived entries.
- No permanent-delete control is introduced. Test cleanup uses Archive; no customer records or rewards should be created to simulate activity.

## Daily aggregate backup

Under **Daily archive**, select the required dates and use **JSON backup download**. This is an owner-triggered download of closed-day aggregates, not a new automatic backup service. Keep the original JSON file securely. Existing CSV export is for analysis and cannot be restored.

The JSON format is versioned and bound to `www.mobileworldfaridabad.com`. It contains only the daily summary fields already used by the archive: day, timestamp, views, sessions, daily browser count, active time, engaged sessions, action totals and aggregate page rows. It does not back up enquiries, Google credentials, CMS data, reward ledgers or individual journeys.

To recover, choose that JSON under **Saved backup से missing days लौटाइए**. The server validates the entire file before writing anything, then displays date range, missing days and existing days. The explicit Restore button saves only missing days. Existing days always remain unchanged, even when another restore or the scheduled job runs concurrently. Imported summaries are finalized to prevent a later empty raw-data pass from replacing recovered totals.

Validation rejects incorrect sites/version, duplicate days, current/future days, unexpected fields, private routes, malformed counts and files over 900 KB. Up to 366 days can be restored per file. A failed storage write is counted; selecting the same original file again safely retries missing days without duplicates.

This does not reconstruct individual visits after the normal raw-data retention window. It is not a complete website/database backup. Losing both the durable archive and every downloaded JSON copy leaves those aggregates unrecoverable through this feature.

## Verification and release boundaries

Isolated tests cover owner authorization, stale/concurrent enquiry changes, test exclusion, archive/restore preservation, full-file validation, concurrent missing-only imports, failure/retry, finalized-summary preservation and production-safe validation messages. Existing catalogue, analytics and reward regressions remain in the same test run.

The next live owner check must create only a clearly marked Test entry, move it through Enquiry/Quoted/Visited/Sold, reload, archive, restore and archive it again. Confirm that real totals never change. Download an existing real aggregate backup, preview it, and verify that restoring it skips every existing day without writing or deleting production data. Never delete a live archive merely to demonstrate recovery. Missing-day recovery is exercised with isolated fixtures.

Owner sign-in was not re-established during the latest continuation: the secure sign-in request timed out and a fresh business-page check still showed the login boundary. The live mutation/import acceptance check therefore remains pending; isolated tests are not represented as that check.
