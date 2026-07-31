export interface ShareTokenEncryptionResult {
  ciphertext: string
  keyVersion: number
}

// Elokeszitett (generalt + titkositott) token anyag, mielott DB-be irnank.
export interface PreparedShareToken {
  rawToken: string
  tokenHash: string
  ciphertext: string
  keyVersion: number
}

// A buildShareToken (titkositasi preflight) diszkriminalt eredmenye. A regenerate
// EZT hivja meg a regi link visszavonasa ELOTT, hogy titkositasi hibanal ne
// vesszen el a mukodo regi link.
export type BuildShareTokenOutcome =
  | { ok: true; prepared: PreparedShareToken }
  | { ok: false; status: number; code: string; message: string }

// Az insertShareRow diszkriminalt eredmenye; a handler ez alapjan valaszt
// HTTP statust/kodot.
export type CreateShareOutcome =
  | { ok: true; id: string; createdAt: string; expiresAt: string | null; token: string }
  | { ok: false; status: number; code: string; message: string }

// A trip_shares aktiv (nem visszavont) soranak owner-oldali kepe (ciphertexttel).
export interface ActiveShareRow {
  id: string
  created_at: string
  expires_at: string | null
  token_ciphertext: string | null
  token_key_version: number
}
