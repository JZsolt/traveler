export function extractLocationName(url: string | undefined | null): string | null {
  if (!url) return null
  try {
    const qMatch = url.match(/[?&]q=([^&]+)/)
    if (qMatch) return decodeURIComponent(qMatch[1]).replace(/\+/g, ' ')
    const dirMatch = url.match(/\/dir\/[^/]+\/([^/?]+)/)
    if (dirMatch) return decodeURIComponent(dirMatch[1]).replace(/\+/g, ' ')
  } catch { /* ignore */ }
  return null
}
