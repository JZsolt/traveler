import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import type { ShareTokenEncryptionResult } from '../src/types/shareServer'

// Authenticated encryption (AES-256-GCM) a nyers megosztasi tokenre, hogy az
// owner ujra meg tudja jeleniteni az aktiv linket. A ciphertext formatuma
// "ivB64.tagB64.dataB64" — onmagaban parse-olhato (IV + auth tag benne). A kulcs
// KIZAROLAG szerver-env-bol jon, sosem kerul kliensre. Nyers tokent nem logolunk.

const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const KEY_BYTES = 32

export const CURRENT_SHARE_KEY_VERSION = 1

// Kulcs-verzio -> env valtozo nev. Jovobeli rotaciohoz ide kerul a v2, v3, ...
const KEY_ENV_BY_VERSION: Record<number, string> = {
  1: 'SHARE_TOKEN_ENCRYPTION_KEY',
}

function loadKey(version: number): Buffer {
  const envName = KEY_ENV_BY_VERSION[version]
  const raw = envName ? process.env[envName] : undefined
  if (!raw) {
    throw new Error(`Hianyzo vagy ismeretlen share titkositasi kulcs (v${version}).`)
  }
  const key = Buffer.from(raw, 'base64')
  if (key.length !== KEY_BYTES) {
    throw new Error('A share titkositasi kulcs nem 32 bajt (base64-kodolt).')
  }
  return key
}

export function encryptShareToken(rawToken: string): ShareTokenEncryptionResult {
  const key = loadKey(CURRENT_SHARE_KEY_VERSION)
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(rawToken, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const ciphertext = `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`
  return { ciphertext, keyVersion: CURRENT_SHARE_KEY_VERSION }
}

export function decryptShareToken(ciphertext: string, keyVersion: number): string {
  const key = loadKey(keyVersion)
  const parts = ciphertext.split('.')
  if (parts.length !== 3) {
    throw new Error('Ervenytelen share ciphertext formatum.')
  }
  const [ivB64, tagB64, dataB64] = parts
  const iv = Buffer.from(ivB64, 'base64')
  const tag = Buffer.from(tagB64, 'base64')
  const data = Buffer.from(dataB64, 'base64')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  // A GCM auth tag ellenorzes a final()-nel bukik, ha a kulcs rossz vagy a
  // ciphertext modositva lett.
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}
