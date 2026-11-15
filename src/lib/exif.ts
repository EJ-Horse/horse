/**
 * Finds when a photo was taken, so photos picked from the library keep their real date.
 * Reads EXIF DateTimeOriginal (or DateTime) from a JPEG; returns 'YYYY-MM-DD' or undefined.
 */
export function exifDate(buf: ArrayBuffer): string | undefined {
  const v = new DataView(buf)
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return undefined // not a JPEG
  let off = 2
  while (off + 4 <= v.byteLength) {
    const marker = v.getUint16(off)
    const size = v.getUint16(off + 2)
    if (marker === 0xffe1 && off + 10 <= v.byteLength && v.getUint32(off + 4) === 0x45786966) {
      return fromTiff(v, off + 10) // after "Exif\0\0"
    }
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break // start of image data
    off += 2 + size
  }
  return undefined
}

function fromTiff(v: DataView, tiff: number): string | undefined {
  if (tiff + 8 > v.byteLength) return undefined
  const little = v.getUint16(tiff) === 0x4949
  const u16 = (o: number) => v.getUint16(o, little)
  const u32 = (o: number) => v.getUint32(o, little)
  const readIfd = (ifd: number) => {
    const tags = new Map<number, { type: number; count: number; valueOff: number }>()
    if (ifd + 2 > v.byteLength) return tags
    const n = u16(ifd)
    for (let i = 0; i < n; i++) {
      const e = ifd + 2 + i * 12
      if (e + 12 > v.byteLength) break
      tags.set(u16(e), { type: u16(e + 2), count: u32(e + 4), valueOff: e + 8 })
    }
    return tags
  }
  const ascii = (t: { type: number; count: number; valueOff: number } | undefined) => {
    if (!t || t.type !== 2) return undefined
    const start = t.count > 4 ? tiff + u32(t.valueOff) : t.valueOff
    let s = ''
    for (let i = 0; i < t.count - 1 && start + i < v.byteLength; i++) s += String.fromCharCode(v.getUint8(start + i))
    return s
  }
  const ifd0 = readIfd(tiff + u32(tiff + 4))
  const exifPtr = ifd0.get(0x8769)
  const exif = exifPtr ? readIfd(tiff + u32(exifPtr.valueOff)) : undefined
  const raw = ascii(exif?.get(0x9003)) ?? ascii(exif?.get(0x9004)) ?? ascii(ifd0.get(0x0132))
  const m = raw?.match(/^(\d{4}):(\d{2}):(\d{2})/)
  if (!m || m[1] === '0000') return undefined
  return `${m[1]}-${m[2]}-${m[3]}`
}

/** Date the photo was taken: EXIF first, then the file's own date if it isn't just "now". */
export async function photoTakenOn(file: File): Promise<string | undefined> {
  try {
    const d = exifDate(await file.slice(0, 256 * 1024).arrayBuffer())
    if (d) return d
  } catch {
    /* unreadable: fall through */
  }
  if (file.lastModified && Date.now() - file.lastModified > 5 * 60 * 1000) {
    const t = new Date(file.lastModified)
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  }
  return undefined
}
