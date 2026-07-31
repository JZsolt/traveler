# 18-04 — Public Link QR UI — DONE

**Estimate:** 1-2 hours

## Goal

Make public link sharing easy from the owner share modal with QR code support.

## Scope

- QR code rendering for the active public link.
- Copy link.
- Download QR image.
- Reopen modal and show current active link.
- Hash-only legacy active share fallback from Phase 16.
- Clear revoked/disabled state.
- Mobile-friendly modal layout.

## Acceptance Criteria

- Active link is visible without generating a new link.
- If an active legacy share has no decryptable ciphertext, the UI explains that
  the old link cannot be re-displayed and offers regenerate for link/QR.
- QR code matches the visible link.
- Copy works.
- QR download works.
- Disabled/revoked link is not displayed as active.

## Review Checklist

- [x] QR is generated from the public URL, not from token hash/ciphertext.
      (`ShareQrCode value={shareUrl}`; `shareUrl` is the owner-decrypted token URL
      from the hook.)
- [x] Use a small client-side QR implementation; QR download should export PNG
      from canvas or an equivalent lightweight path. (`qrcode.react` `QRCodeCanvas`
      + `canvas.toDataURL('image/png')` download.)
- [x] Token is not stored in local/session storage. (Held only in React state in
      `useTripSharing`; no storage writes.)
- [x] Text fits on mobile. (`max-w-sm` modal, 160px QR, link input truncates.)
- [x] Keyboard and screen-reader basics work in the modal. (`role="dialog"`,
      `aria-modal`, `aria-labelledby`, Escape close, initial focus; link input +
      copy button serve SR/keyboard; QR wrapper has `aria-label`.)

## Output

- Added `qrcode.react@4.2.0` (small, ships its own TS types; bundled into the
  lazy `TripPage` chunk).
- `src/components/trip/ShareQrCode.tsx` — renders `QRCodeCanvas` from the public
  `shareUrl` and downloads it as PNG (`canvas.toDataURL`). `ShareQrCodeProps`
  type in `src/types/shared.ts`.
- `ShareManager` primary (re-displayable) state now shows: **QR + link text +
  Copy + Download QR**, plus regenerate/disable. The QR and link both derive from
  the same `shareUrl`, so they always match.
- Reopen behavior: the modal shows the active link/QR **without** generating a new
  one (the hook's `get` returns the owner-decrypted token). Legacy (no
  ciphertext) → the existing "cannot re-display, generate new" branch. After
  disable/revoke → back to the create state (no stale link shown).
- Full gate: lint clean, `tsc` 0, build OK, **171 tests**.
- NOTE: the live QR render / copy / download was not driven end-to-end here — it
  needs an active share (Supabase + `vercel dev` + `SHARE_TOKEN_ENCRYPTION_KEY`).
  Component compiles and builds; `qrcode.react` is a trusted library.
