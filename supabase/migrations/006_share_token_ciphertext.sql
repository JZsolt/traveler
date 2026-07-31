-- Sharing V2: store the AES-GCM encrypted raw share token so owners can
-- re-display the active public link and QR. The public anonymous lookup STILL
-- uses token_hash only; ciphertext is decrypted exclusively by owner-authenticated
-- server code. The raw plaintext token is NEVER stored.

alter table public.trip_shares
  add column if not exists token_ciphertext text,
  add column if not exists token_key_version int not null default 1;

-- Legacy Phase-16 shares have token_hash but token_ciphertext IS NULL. They are
-- deliberately NOT re-displayable; the owner management UI offers "regenerate"
-- to produce a new, re-displayable link. A share is re-displayable iff
-- token_ciphertext is not null.
comment on column public.trip_shares.token_ciphertext is
  'AES-256-GCM encrypted raw share token, format "ivB64.tagB64.dataB64". NULL for legacy Phase-16 shares (not re-displayable). Never plaintext.';
comment on column public.trip_shares.token_key_version is
  'Encryption key version used for token_ciphertext (future key rotation).';
