# 10-02 — Large File Audit

Read only:

- `src/`
- `docs/architecture/ARCHITECTURE.md`

Goal: identify large files and prioritize safe extraction work.

Requirements:

1. Count lines in key `src/` files.
2. Create or update a short audit section in `docs/architecture/ARCHITECTURE.md`.
3. List files over 200 lines.
4. Mark files over 250 lines as priority.
5. For each priority file, suggest extraction direction:
   - hook
   - child component
   - constants/helper
6. Do not refactor code in this task.

Suggested command:

```bash
rg --files src | xargs wc -l | sort -nr | head -40
```

Manual test flow to report:

- Report top large files.
- Confirm no application code changed.
- Run `pnpm run build`.

Do not write automated tests.
