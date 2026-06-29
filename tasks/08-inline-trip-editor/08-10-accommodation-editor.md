# 08-10 — Accommodation Editor

Read only:

- `src/components/trip/TripHero.jsx`
- `src/hooks/useTripUpdater.js`

Goal: inline edit accommodation fields shown in hero.

Editable fields:

- `accommodation.address`
- `accommodation.mapUrl`
- `accommodation.host`
- `accommodation.gateCode`
- `accommodation.doorCode`
- `accommodation.wifi.name`
- `accommodation.wifi.password`

Requirements:

1. Add separate accommodation edit block.
2. Initialize missing `accommodation`.
3. Initialize `wifi` only if user fills WiFi fields.
4. Preserve unknown accommodation fields, including videos.
5. Save updates only `accommodation`.
6. No AI.

Manual test flow to report:

- Edit address/map link.
- Add WiFi values.
- Confirm existing videos still render if present.
- Build passes.

Run `pnpm run build`.
