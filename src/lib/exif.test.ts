import { describe, expect, it } from 'vitest'
import { exifDate } from './exif'

/** Builds a minimal JPEG with an EXIF block holding the given dates. */
function jpegWithExif(opts: { original?: string; dateTime?: string; little?: boolean }): ArrayBuffer {
  const little = opts.little ?? false
  const bytes: number[] = []
  const tiff: number[] = []
  const w16 = (a: number[], n: number) => (little ? a.push(n & 0xff, n >> 8) : a.push(n >> 8, n & 0xff))
  const w32 = (a: number[], n: number) =>
    little ? a.push(n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, n >>> 24) : a.push(n >>> 24, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff)
  const str = (s: string) => [...s].map((c) => c.charCodeAt(0)).concat(0)

  // TIFF header
  tiff.push(...(little ? [0x49, 0x49] : [0x4d, 0x4d]))
  w16(tiff, 42)
  w32(tiff, 8)
  // IFD0 at 8: up to two entries (DateTime, ExifIFD pointer)
  const ifd0Entries = (opts.dateTime ? 1 : 0) + 1
  const ifd0Size = 2 + ifd0Entries * 12 + 4
  const exifIfdOff = 8 + ifd0Size
  const exifIfdSize = 2 + 12 + 4
  let dataOff = exifIfdOff + exifIfdSize
  const data: number[] = []
  w16(tiff, ifd0Entries)
  if (opts.dateTime) {
    w16(tiff, 0x0132); w16(tiff, 2); w32(tiff, 20); w32(tiff, dataOff + data.length)
    data.push(...str(opts.dateTime))
  }
  w16(tiff, 0x8769); w16(tiff, 4); w32(tiff, 1); w32(tiff, exifIfdOff)
  w32(tiff, 0)
  // Exif IFD
  w16(tiff, opts.original ? 1 : 0)
  if (opts.original) {
    w16(tiff, 0x9003); w16(tiff, 2); w32(tiff, 20); w32(tiff, dataOff + data.length)
    data.push(...str(opts.original))
  } else {
    tiff.push(...new Array(12).fill(0))
  }
  w32(tiff, 0)
  dataOff = tiff.length
  tiff.push(...data)

  const app1 = [0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff]
  bytes.push(0xff, 0xd8, 0xff, 0xe1, ((app1.length + 2) >> 8) & 0xff, (app1.length + 2) & 0xff, ...app1, 0xff, 0xda, 0, 2)
  return new Uint8Array(bytes).buffer
}

describe('photo date from EXIF', () => {
  it('reads DateTimeOriginal (big-endian, like most cameras)', () => {
    expect(exifDate(jpegWithExif({ original: '2026:10:03 14:22:01' }))).toBe('2026-10-03')
  })
  it('reads little-endian files (many phones)', () => {
    expect(exifDate(jpegWithExif({ original: '2025:06:30 08:00:00', little: true }))).toBe('2025-06-30')
  })
  it('falls back to DateTime', () => {
    expect(exifDate(jpegWithExif({ dateTime: '2024:01:15 09:00:00' }))).toBe('2024-01-15')
  })
  it('returns nothing for non-JPEG data', () => {
    expect(exifDate(new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer)).toBeUndefined()
  })
})
