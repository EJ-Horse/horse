/**
 * EJ's family tree, saved from the AHA DataSource (Nov 2026).
 * The data file and photos live in private storage (media/pedigree/…), never in this public repo.
 */
export type ShowResult = { show: string; date: string; cls: string; place: string; inClass?: string; points?: string; score?: string; rider?: string }
export type Owner = { name: string; date?: string }

export type PedHorse = {
  id: string
  name: string
  reg: string
  titles?: string
  foaled?: string
  gender?: string
  gelded?: string
  color?: string
  died?: string
  parentage?: string
  sireId?: string
  damId?: string
  sire?: string
  dam?: string
  breeder?: string
  owners?: Owner[]
  markings?: string
  markingImg?: string
  photos?: string[]
  shows?: ShowResult[]
  openComps?: ShowResult[]
  rides?: Record<string, string>[]
  sibling?: boolean
}

export type PedPerson = { name: string; address?: string; currentlyOwn?: number; onceOwned?: number; bred?: number; role: string; horses?: string[] }
export type Sibling = { id: string; name: string; reg: string; foaled: string; color: string; gender: string; parent: 'full' | 'dam' | 'sire'; otherParent?: string }

export type PedigreeData = {
  savedOn: string
  rootId: string
  horses: Record<string, PedHorse>
  siblings: Sibling[]
  people: PedPerson[]
}

export const PEDIGREE_PATH = 'pedigree/data.json'

/** "GALLANT FASHION ++" → { name: "GALLANT FASHION", titles: "++" } */
export function splitTitles(full: string) {
  const m = full.trim().match(/^(.*?)\s+([+/]+)$/)
  return m ? { name: m[1], titles: m[2] } : { name: full.trim(), titles: '' }
}

/** Title-case a DataSource name, keeping the leading * that marks an imported horse. */
export function niceName(s: string) {
  return s
    .toLowerCase()
    .replace(/(^|[\s\-*'(])([a-z])/g, (_, p, c) => p + c.toUpperCase())
    .replace(/\b(Lc|Wc|Ev|Sm|Ejm|Nw|Hd|Ff|Mhr|Hp)\b/g, (x) => x.toUpperCase())
}

/** The four positions of one generation further back. */
export function parentsOf(data: PedigreeData, id: string | undefined): [PedHorse | undefined, PedHorse | undefined] {
  const h = id ? data.horses[id] : undefined
  return [h?.sireId ? data.horses[h.sireId] : undefined, h?.damId ? data.horses[h.damId] : undefined]
}

/** Rows of the bracket: generation g has 2^g slots (undefined when unknown). */
export function generations(data: PedigreeData, rootId: string, depth: number): (PedHorse | undefined)[][] {
  const out: (PedHorse | undefined)[][] = [[data.horses[rootId]]]
  for (let g = 1; g < depth; g++) {
    out.push(out[g - 1].flatMap((h) => parentsOf(data, h?.id)))
  }
  return out
}

/** Horses that appear more than once in the tree (line-breeding), with how often. */
export function repeats(data: PedigreeData, rootId: string, depth: number) {
  const counts = new Map<string, number>()
  generations(data, rootId, depth)
    .slice(1)
    .flat()
    .forEach((h) => h && counts.set(h.id, (counts.get(h.id) ?? 0) + 1))
  return counts
}

export function bestResults(h: PedHorse) {
  const all = [...(h.shows ?? []), ...(h.openComps ?? [])]
  const rank = (p: string) => (/^champ/i.test(p) ? 0 : /res/i.test(p) ? 1 : /top/i.test(p) ? 2 : /^1/.test(p) ? 3 : 4)
  return all.filter((r) => /nation|champ|top ten|top five|reserve/i.test(r.show + ' ' + r.place)).sort((a, b) => rank(a.place) - rank(b.place))
}
