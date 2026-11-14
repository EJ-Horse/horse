/** Amazon puts the product title in the link, e.g. amazon.com/Horse-Brush-Set/dp/B0..; show that as the name. */
export function nameFromUrl(url: string): string {
  try {
    const u = new URL(url)
    const seg = u.pathname.split('/').find((p) => p && p !== 'dp' && p !== 'gp' && !/^[A-Z0-9]{10}$/.test(p) && p.includes('-'))
    return seg ? decodeURIComponent(seg).replace(/-/g, ' ') : ''
  } catch {
    return ''
  }
}

export function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}
