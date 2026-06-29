# 07 — Export Button + Git Backup ✅ DONE

This phase adds a user-triggered backup flow: the app shows an export button, the server exports all trips from Supabase, then commits the backup JSON into the GitHub repository.

Important:

- This is a global backup for ALL trips.
- The UI must only trigger the backup. GitHub and Supabase service credentials must stay server-side.
- The button label should be Hungarian and clear, for example: `Export mentés Gitre`.
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
- GitHub API failure, auth failure, rate limit, or branch/path issue: show a readable UI error.
- Never rely on console-only errors.
- Never expose token values in the response or UI.

Required environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GITHUB_TOKEN`
- `GITHUB_REPO`
- `GITHUB_BACKUP_BRANCH`

Suggested GitHub settings:

- `GITHUB_REPO`: `owner/repo`
- `GITHUB_BACKUP_BRANCH`: usually `main`
- Backup path: `backups/trips-backup.json`

---

## TASK 1 — Create server backup builder

Read only:

- `api/`
- `src/lib/`
- `package.json`

Goal:

Create the server-side backup logic that exports every trip from Supabase into one JSON object. Do not integrate GitHub or frontend yet.

Requirements:

1. Create `/api/backup-trips.js`.
2. Only allow `POST`.
3. Read:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Fetch every row from the `trips` table.
5. Build this JSON:

```json
{
  "version": 1,
  "application": "Traveler",
  "schema": 1,
  "exportedAt": "ISO_DATE",
  "tripCount": 0,
  "trips": []
}
```

6. Return JSON with:
   - `ok`
   - `backup`
7. Handle errors with stable response shape:

```json
{
  "ok": false,
  "error": {
    "code": "SUPABASE_FETCH_FAILED",
    "message": "Nem sikerült exportálni az utazásokat."
  }
}
```

8. Do not include secrets or raw provider error objects in the response.

Manual test flow to document:

- Trigger the endpoint with valid env vars.
- Confirm `ok: true`, `tripCount`, `exportedAt`, and `trips`.
- Temporarily remove one env var and confirm the endpoint returns a readable error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 2 — Push exported backup to GitHub

Read only:

- `api/backup-trips.js`
- GitHub REST API docs if needed

Goal:

Extend `/api/backup-trips.js` so the same request exports all trips and commits the backup JSON into the GitHub repository.

Requirements:

1. Read:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `GITHUB_BACKUP_BRANCH`
2. Write the backup JSON to:

```txt
backups/trips-backup.json
```

3. Use the GitHub REST API from the server endpoint.
4. If the file already exists, update it using the current file SHA.
5. If the file does not exist, create it.
6. Commit message format:

```txt
backup: export trips YYYY-MM-DD HH:mm
```

7. Return JSON with:
   - `ok`
   - `exportedAt`
   - `tripCount`
   - `path`
   - `commitSha`
   - `commitUrl`
8. Keep the endpoint server-side only.
9. Never expose GitHub credentials.
10. Map GitHub errors to readable UI-safe messages:
   - auth/permission
   - rate limit
   - branch missing
   - repo/path invalid
   - unknown GitHub failure

Manual test flow to document:

- Trigger the endpoint.
- Confirm the response includes `commitSha`.
- Confirm `backups/trips-backup.json` changed in GitHub.
- Trigger it a second time and confirm it updates the same file.
- Temporarily use a bad branch name and confirm a readable error.

Stop after this task.
Run `pnpm run build`.

---

## TASK 3 — Add Export Backup button

Read only:

- `src/pages/`
- `src/components/`
- `src/context/`
- `api/backup-trips.js`

Goal:

Add a visible export button in the app that triggers the full Supabase-to-GitHub backup.

Requirements:

1. Add an `Export mentés Gitre` button under the existing Settings/Data Management area.
2. If there is no clear Settings/Data Management area, place it in the smallest existing management/admin section without redesigning unrelated UI.
3. On click, call `POST /api/backup-trips`.
4. Show states in the UI:
   - idle
   - loading
   - success
   - failure
5. Disable the button while the backup is running.
6. On success, display:
   - export time
   - trip count
   - backup path
   - Git commit SHA
   - commit link if available
7. On failure, display the endpoint `error.message`.
8. Do not require the user to open the console to understand what failed.
9. Do not redesign unrelated UI.

Manual test flow to document:

- Open the page where the button was added.
- Click `Export mentés Gitre`.
- Confirm loading state appears.
- Confirm success state shows exported time, trip count, path, and commit SHA.
- Confirm the commit exists on GitHub.
- Force an env/config error and confirm the UI shows a readable failure.

Stop after this task.
Run `pnpm run build`.

---

## TASK 4 — Add lightweight backup docs

Read only:

- `README.md`
- `tasks/07-git-hub-backup.md`
- any existing docs folder

Goal:

Document how to configure and use the export backup button without adding long docs.

Requirements:

1. Add a short setup section to the most appropriate existing docs file.
2. Document required env vars:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `GITHUB_BACKUP_BRANCH`
3. Document where the backup file is written:

```txt
backups/trips-backup.json
```

4. Document the manual restore expectation:
   - the backup JSON is meant for recovery/debugging first
   - restore automation is out of scope for this phase
5. Keep docs concise.

Manual test flow to document:

- Read the docs as a fresh setup checklist.
- Confirm every env var used by the endpoint is listed.
- Confirm the button flow is described.

Stop after this task.
Run `pnpm run build`.
