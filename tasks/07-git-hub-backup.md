# 07 — GitHub Backup

This phase adds automated cloud backups of the entire Traveler database.

Important:

- This is a global backup for ALL trips.
- Never expose GitHub credentials to the frontend.
- Never expose Supabase service keys.
- Keep the feature Vercel-compatible.
- Implement one task at a time.
- Run `npm run build` after every task.
- Stop after each task and summarize changed files.

---

## TASK 1 — Create backup export endpoint

Read only:

- api/
- src/lib
- package.json

Goal:

Create a server-side endpoint that exports every trip from Supabase into a single backup JSON.

Requirements:

1. Create `/api/backup-trips.js`.
2. Read:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Fetch every row from the `trips` table.
4. Build this JSON:

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

5. Return the JSON response.
6. Do NOT integrate GitHub yet.
7. Do NOT modify the frontend.
8. Handle all errors cleanly.

Stop after this task.
Run `npm run build`.

---

## TASK 2 — Commit backup to GitHub

Read only:

- api/backup-trips.js

Goal:

Save the generated backup into the GitHub repository.

Requirements:

1. Read:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `GITHUB_BACKUP_BRANCH`
2. Commit the JSON to:

```
backups/trips-backup.json
```

3. Overwrite the previous backup.
4. Use the GitHub REST API.
5. Return commit SHA and success status.
6. Never expose GitHub credentials.
7. Keep the endpoint server-side only.

Stop after this task.
Run `npm run build`.

---

## TASK 3 — Add Backup UI

Read only:

- src/pages
- src/components

Goal:

Allow users to trigger a full cloud backup.

Requirements:

1. Add a "Create Backup" button under Settings/Data Management.
2. Call `/api/backup-trips`.
3. Show:
   - loading
   - success
   - failure
4. Display:
   - export time
   - trip count
   - Git commit SHA (if available)
5. Do not redesign unrelated UI.

Stop after this task.
Run `npm run build`.
