# 08-10 — Accommodation Editor ✅ DONE

Read only:

- `src/components/trip/TripHero.jsx`
- `src/hooks/useTripUpdater.js`

Goal: inline edit accommodation fields shown in hero.

Implementation note:

- The accommodation fields live inside the main `TripHero` unified editor as a "Szállás" section.
- A separate Save action is NOT required — the unified hero Save writes hero + accommodation + flight together.
- The important data rule is that unknown `accommodation` subfields (e.g. videos) are preserved via spread.
- The accommodation card renders when ANY field exists (host, address, gateCode, doorCode, wifi, videos), not just `host`.

Editable fields:

- `accommodation.address`
- `accommodation.mapUrl`
- `accommodation.host`
- `accommodation.gateCode`
- `accommodation.doorCode`
- `accommodation.wifi.name`
- `accommodation.wifi.password`

Requirements:

1. Accommodation fields are part of the unified `TripHero` editor.
2. Initialize missing `accommodation`.
3. Initialize `wifi` only if user fills WiFi fields.
4. Preserve unknown accommodation fields, including videos.
5. Preserve unknown trip fields via spread.
6. No AI.

Manual test flow to report:

- Edit address/map link.
- Add WiFi values.
- Confirm existing videos still render if present.
- Build passes.

Run `pnpm run build`.
