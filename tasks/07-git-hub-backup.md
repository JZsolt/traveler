# 07 — Per-Trip Git Backup + Import

This phase adds a user-triggered backup flow: the app shows an export button, the server exports trips from Supabase, and each trip is written to GitHub as its own JSON file. The same backup format must support single-trip import and bulk import later.

Important:

- Do not create one huge backup JSON for all trips.
- Store each trip as a separate JSON file.
- Also store a small manifest file that lists every backed-up trip.
- The UI must only trigger backup/import. GitHub and Supabase service credentials must stay server-side.
- Admin protection belongs to phase 09; if phase 09 is already implemented, reuse its admin gate.
- Keep the feature Vercel-compatible.
- Implement one task at a time.
- Run `pnpm run build` after every task.
- Do not write automated tests for this phase.
- After every task, add a short manual test flow summary.
- Stop after each task and summarize changed files.

Required error handling:

- Missing Supabase env vars: show a readable UI error.
- Missing GitHub env vars: show a readable UI error.
- Supabase fetch failure: show a readable UI error.
- GitHub API failure, auth failure, rate limit, branch/path issue, or file conflict: show a readable UI error.
- Import validation failure: show which file/trip failed and why.
- Never rely on console-only errors.
- Never expose token values in the response or UI.

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_TOKEN`
- `GITHUB_REPO`
- `GITHUB_BACKUP_BRANCH`

Backup file layout:

```txt
backups/trips/manifest.json
backups/trips/by-slug/<slug>.json
```

Single trip backup file shape:

```json
{
  "version": 1,
  "application": "Traveler",
  "schema": 1,
  "exportedAt": "ISO_DATE",
  "trip": {
    "id": "uuid",
    "slug": "trip-slug",
    "trip_data": {},
    "owner": null,
    "created_at": "ISO_DATE",
    "updated_at": "ISO_DATE"
  }
}
```

Manifest shape:

```json
{
  "version": 1,
  "application": "Traveler",
  "schema": 1,
  "exportedAt": "ISO_DATE",
  "tripCount": 0,
  "trips": [
    {
      "slug": "trip-slug",
      "title": "Trip title",
      "path": "backups/trips/by-slug/trip-slug.json",
      "updated_at": "ISO_DATE"
    }
  ]
}
```

---

## TASK 1 — Create backup helpers

Read only:

- `api/`
- `src/lib/`
- `package.json`

Goal:

Create small server-side helpers for building per-trip backup files and the manifest. Do not integrate GitHub or frontend yet.

Requirements:

1. Create helper functions inside `/api/backup-trips.js` or `/api/_backup-utils.js`.
2. Build one backup JSON object per trip.
3. Build one manifest JSON object for all trips.
4. Use compact JSON for GitHub writes, not pretty JSON.
5. Sanitize file names from slugs:
   - allow lowercase letters, numbers, and hyphens
   - fallback to trip id if slug is missing
6. Keep the JSON shapes exactly as documented above.
7. Do not include secrets or raw provider error objects in responses.

Manual test flow to document:

- Trigger helper path through a temporary local call or endpoint response.
- Confirm each trip gets its own path.
- Confirm manifest has the same trip count as exported trips.
- Confirm missing slug still produces a safe file path.

Stop after this task.
Run `pnpm run build`.

---

## TASK 2 — Export all trips with pagination

Read only:

- `api/backup-trips.js`
- backup helper file if created

Goal:

Fetch all trips from Supabase safely, without relying on one unbounded `.select('*')`.

Requirements:

1. `/api/backup-trips.js` must only allow `POST`.
2. Read:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Fetch trips in pages with `.range(from, to)`.
4. Use a page size of 500 or 1000.
5. Stop when a page returns fewer rows than the page size.
6. Return a readable Supabase error if any page fails.
7. Return a preview response with:
   - `ok`
   - `exportedAt`
   - `tripCount`
   - `files`
   - `manifest`
8. Do not integrate GitHub yet.

Manual test flow to document:

- Trigger the endpoint with valid env vars.
- Confirm `tripCount` and `files.length` match.
- Confirm it works with zero trips.
- Temporarily remove one Supabase env var and confirm readable error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 3 — Commit per-trip files to GitHub

Read only:

- `api/backup-trips.js`
- backup helper file if created
- GitHub REST API docs if needed

Goal:

Extend `/api/backup-trips.js` so the same request exports all trips and commits each trip JSON plus the manifest to GitHub.

Requirements:

1. Read:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `GITHUB_BACKUP_BRANCH`
2. Write or update:

```txt
backups/trips/manifest.json
backups/trips/by-slug/<slug>.json
```

3. Use the GitHub REST API from the server endpoint.
4. If a file already exists, update it using the current file SHA.
5. If a file does not exist, create it.
6. Commit message format for trip files:

```txt
backup: export trip <slug> YYYY-MM-DD HH:mm
```

7. Commit message format for manifest:

```txt
backup: update trips manifest YYYY-MM-DD HH:mm
```

8. Return JSON with:
   - `ok`
   - `exportedAt`
   - `tripCount`
   - `fileCount`
   - `manifestPath`
   - `commits`
   - `failedFiles`
9. If one trip file fails, continue with the remaining files when possible, but return `ok: false` and list failed files.
10. Never expose GitHub credentials.
11. Map GitHub errors to readable UI-safe messages.

Manual test flow to document:

- Trigger the endpoint.
- Confirm `manifest.json` changed in GitHub.
- Confirm one JSON file exists per trip slug.
- Trigger it a second time and confirm files are updated, not duplicated.
- Temporarily use a bad branch name and confirm readable error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 4 — Add Export Backup button UI

Read only:

- `src/pages/`
- `src/components/`
- `src/context/`
- `api/backup-trips.js`

Goal:

Add or update the visible export button that triggers the full per-trip Supabase-to-GitHub backup.

Requirements:

1. Use Hungarian label: `Export mentés Gitre`.
2. If phase 09 Settings exists, render the button only inside unlocked Settings.
3. If phase 09 Settings does not exist yet, place it in the smallest existing management/admin section without redesigning unrelated UI.
4. On click, call `POST /api/backup-trips`.
5. Show states in the UI:
   - idle
   - loading
   - success
   - partial failure
   - failure
6. Disable the button while backup is running.
7. On success, display:
   - export time
   - trip count
   - file count
   - manifest path
   - latest commit SHA/link if available
8. On partial failure, display failed file names and readable reasons.
9. On failure, display the endpoint `error.message`.
10. Do not require the user to open the console to understand what failed.

Manual test flow to document:

- Open the page where the button was added.
- Click `Export mentés Gitre`.
- Confirm loading state appears.
- Confirm success state shows trip count, file count, and manifest path.
- Confirm GitHub contains one file per trip plus manifest.
- Force a GitHub/config error and confirm the UI shows readable failure.

Stop after this task.
Run `pnpm run build`.

---

## TASK 5 — Add single-trip import endpoint

Read only:

- `api/`
- `src/lib/validateTripJson.js`
- `src/lib/normalizeTrip.js`
- `src/lib/ensureUniqueSlug.js`

Goal:

Create a server endpoint that imports one trip backup JSON into Supabase.

Requirements:

1. Create `/api/import-trip-backup.js`.
2. Only allow `POST`.
3. Read:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Accept request body with one backed-up trip JSON.
5. Validate backup shape.
6. Validate `trip.trip_data` with the existing trip validation logic if reusable server-side.
7. Support import modes:
   - `create`
   - `upsert-by-slug`
8. For `create`, generate a unique slug if the slug already exists.
9. For `upsert-by-slug`, update existing row with matching slug or create a new row.
10. Return:
   - `ok`
   - `mode`
   - `slug`
   - `created`
   - `updated`
11. Return readable validation errors.

Manual test flow to document:

- Import one valid trip backup with `create`.
- Import the same backup again with `create` and confirm a unique slug is created.
- Import the same backup with `upsert-by-slug` and confirm the existing row updates.
- Send invalid JSON shape and confirm readable validation error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 6 — Add bulk import endpoint

Read only:

- `api/import-trip-backup.js`
- `api/backup-trips.js`
- backup helper file if created

Goal:

Create a server endpoint that imports multiple trip backup JSON objects in one request.

Requirements:

1. Create `/api/import-trip-backups.js`.
2. Only allow `POST`.
3. Accept request body:

```json
{
  "mode": "create",
  "backups": []
}
```

4. Reuse the single-trip import logic.
5. Process imports sequentially to keep errors clear.
6. Continue after a failed item when possible.
7. Return:
   - `ok`
   - `importedCount`
   - `failedCount`
   - `results`
   - `errors`
8. `ok` should be false if any item fails.
9. Never silently skip failed imports.

Manual test flow to document:

- Import two valid trip backups.
- Import a mixed list with one invalid backup and confirm partial failure is shown.
- Repeat bulk import in `upsert-by-slug` mode and confirm existing rows update.

Stop after this task.
Run `pnpm run build`.

---

## TASK 7 — Add import UI in Settings/Data Management

Read only:

- `src/pages/`
- `src/components/`
- `api/import-trip-backup.js`
- `api/import-trip-backups.js`

Goal:

Allow importing one backed-up trip JSON or multiple backed-up trip JSON files from the UI.

Requirements:

1. If phase 09 Settings exists, render import controls only inside unlocked Settings.
2. Add file input for one or more `.json` files.
3. Add import mode selector:
   - `Újként importálás`
   - `Frissítés slug alapján`
4. If one file is selected, call `/api/import-trip-backup`.
5. If multiple files are selected, call `/api/import-trip-backups`.
6. Show:
   - loading
   - success
   - partial failure
   - failure
7. On success, show imported count and affected slugs.
8. On partial failure, show failed file names and readable reasons.
9. Refresh trip list after successful import.
10. Do not redesign unrelated UI.

Manual test flow to document:

- Import one exported trip file.
- Import multiple exported trip files.
- Try `Újként importálás` twice and confirm unique slugs.
- Try `Frissítés slug alapján` and confirm existing trip updates.
- Import an invalid file and confirm readable failure.

Stop after this task.
Run `pnpm run build`.

---

## TASK 8 — Add lightweight backup/import docs

Read only:

- `README.md`
- `tasks/07-git-hub-backup.md`
- any existing docs folder

Goal:

Document how to configure and use per-trip backup/import without adding long docs.

Requirements:

1. Add a short setup section to the most appropriate existing docs file.
2. Document required env vars:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `GITHUB_BACKUP_BRANCH`
3. Document backup layout:

```txt
backups/trips/manifest.json
backups/trips/by-slug/<slug>.json
```

4. Document the two import modes:
   - create
   - upsert-by-slug
5. Mention that each trip can be restored separately.
6. Keep docs concise.

Manual test flow to document:

- Read the docs as a fresh setup checklist.
- Confirm every env var used by the endpoint is listed.
- Confirm export, single import, and bulk import flows are described.

Stop after this task.
Run `pnpm run build`.
