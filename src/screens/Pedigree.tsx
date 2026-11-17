import { useEffect, useMemo, useState } from 'react'
import { Screen, Sheet } from '../components/ui'
import { formatDate } from '../lib/dates'
import {
  bestResults,
  generations,
  niceName,
  PEDIGREE_PATH,
  repeats,
  type PedHorse,
  type PedigreeData,
  type ShowResult,
} from '../lib/pedigree'
import { mediaUrl } from '../lib/store'
import { supabase } from '../lib/supabase'

/** Private storage in the real app; a git-ignored local copy while previewing without the database. */
async function pedUrl(path: string) {
  if (supabase) return mediaUrl(path)
  return import.meta.env.BASE_URL + 'pedigree-dev/' + path.replace(/^pedigree\//, '')
}

function usePedUrl(path?: string) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    let alive = true
    if (path) void pedUrl(path).then((u) => alive && setUrl(u))
    return () => {
      alive = false
    }
  }, [path])
  return url
}

function PedImg({ path, className, onClick, alt = '' }: { path?: string; className?: string; onClick?: () => void; alt?: string }) {
  const url = usePedUrl(path)
  if (!path) return null
  if (!url) return <div className={'img-placeholder ' + (className ?? '')} />
  return <img src={url} alt={alt} className={className} onClick={onClick} loading="lazy" />
}

function usePedigree() {
  const [data, setData] = useState<PedigreeData | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    void (async () => {
      try {
        const url = await pedUrl(PEDIGREE_PATH)
        if (!url) throw new Error('missing')
        const r = await fetch(url)
        if (!r.ok) throw new Error(String(r.status))
        setData(await r.json())
      } catch {
        setErr('Couldn’t load the family tree. Check your connection and try again.')
      }
    })()
  }, [])
  return { data, err }
}

const year = (d?: string) => d?.slice(0, 4) ?? ''
const sexIcon = (h: PedHorse) => (/mare/i.test(h.gender ?? '') ? '♀' : '♂')

/** Horse → Pedigree: EJ's family tree from the AHA DataSource, with details for every horse. */
export function Pedigree() {
  const { data, err } = usePedigree()
  const [rootStack, setRootStack] = useState<string[]>([])
  const [depth, setDepth] = useState(4)
  const [open, setOpen] = useState<string | null>(null)

  if (err) return <Screen title="Pedigree"><p className="empty">{err}</p></Screen>
  if (!data) return <Screen title="Pedigree"><p className="empty">Loading EJ’s family tree…</p></Screen>

  const rootId = rootStack.at(-1) ?? data.rootId
  const root = data.horses[rootId]
  const ej = data.horses[data.rootId]
  const showRoot = (id: string) => {
    setOpen(null)
    setRootStack((s) => (id === data.rootId ? [] : [...s, id]))
    window.scrollTo({ top: 0 })
  }

  return (
    <Screen title="Pedigree">
      {rootId === data.rootId ? (
        <div className="card ped-hero">
          <img src={`${import.meta.env.BASE_URL}ej-face.jpg`} alt="EJ" className="ped-hero-img" />
          <div>
            <strong className="ped-hero-name">{niceName(ej.name)}</strong>
            <div className="muted small">{ej.reg}</div>
            <div className="small">
              Born {formatDate(ej.foaled!)} · {niceName(ej.color ?? '')} {ej.gender?.toLowerCase()}
            </div>
            <div className="small muted">
              by {niceName(ej.sire ?? '')} · out of {niceName(ej.dam ?? '')}
            </div>
          </div>
        </div>
      ) : (
        <div className="card soft row-between">
          <span>
            🌳 Tree of <strong>{niceName(root.name)}</strong>
          </span>
          <button className="link small" onClick={() => setRootStack((s) => s.slice(0, -1))}>
            ← Back
          </button>
        </div>
      )}

      <div className="row-between ped-controls">
        <span className="muted small">Tap any horse for details · 📷 has photos</span>
        <div className="segmented mini">
          {[3, 4, 5].map((n) => (
            <button key={n} className={depth === n ? 'on' : ''} onClick={() => setDepth(n)}>
              {n} gen
            </button>
          ))}
        </div>
      </div>

      <Tree data={data} rootId={rootId} depth={depth} onOpen={setOpen} />

      {rootId === data.rootId && (
        <>
          <LineBreeding data={data} onOpen={setOpen} />
          <Siblings data={data} onOpen={setOpen} />
          <People data={data} />
          <p className="hint">Saved from the AHA DataSource on {formatDate(data.savedOn)}. {Object.keys(data.horses).length} horses, 6 generations back.</p>
        </>
      )}

      {open && data.horses[open] && (
        <HorseSheet data={data} horse={data.horses[open]} onOpen={setOpen} onTree={showRoot} onClose={() => setOpen(null)} />
      )}
    </Screen>
  )
}

function Tree({ data, rootId, depth, onOpen }: { data: PedigreeData; rootId: string; depth: number; onOpen: (id: string) => void }) {
  const gens = useMemo(() => generations(data, rootId, depth), [data, rootId, depth])
  const rows = 2 ** (depth - 1)
  return (
    <div className="ped-scroll">
      <div className={'ped-grid' + (depth === 3 ? ' fit' : '')} style={{ gridTemplateColumns: depth === 3 ? 'repeat(3, minmax(0, 1fr))' : `repeat(${depth}, 104px)`, gridTemplateRows: `repeat(${rows}, minmax(${depth > 4 ? 36 : depth > 3 ? 40 : 52}px, auto))` }}>
        {gens.map((g, gi) =>
          g.map((h, i) => {
            const span = rows / g.length
            return (
              <div key={`${gi}-${i}`} className="ped-slot" style={{ gridColumn: gi + 1, gridRow: `${i * span + 1} / span ${span}` }}>
                {h ? (
                  <button className={'ped-box' + (i % 2 ? ' dam' : ' sire') + (gi === 0 ? ' root' : '')} onClick={() => onOpen(h.id)}>
                    <span className="ped-name">
                      {niceName(h.name)}
                      {h.titles && <span className="ped-titles"> {h.titles}</span>}
                    </span>
                    <span className="ped-meta">
                      {year(h.foaled)} · {niceName(h.color ?? '')}
                      {h.photos?.length ? ' · 📷' : ''}
                      {bestResults(h).length ? ' · 🏆' : ''}
                    </span>
                  </button>
                ) : (
                  <span className="ped-box empty">Unknown</span>
                )}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

function LineBreeding({ data, onOpen }: { data: PedigreeData; onOpen: (id: string) => void }) {
  const rep = [...repeats(data, data.rootId, 6).entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1])
  if (!rep.length) return null
  return (
    <section>
      <h3 className="section-title">🔁 Appear more than once</h3>
      <p className="hint">These horses show up in several places in EJ’s tree (6 generations), so their traits are stronger in him.</p>
      <div className="chips">
        {rep.map(([id, n]) => (
          <button key={id} className="chip" onClick={() => onOpen(id)}>
            {niceName(data.horses[id].name)} ×{n}
          </button>
        ))}
      </div>
    </section>
  )
}

function Siblings({ data, onOpen }: { data: PedigreeData; onOpen: (id: string) => void }) {
  if (!data.siblings.length) return null
  const groups: [string, string][] = [
    ['full', 'Full brothers & sisters (same mom and dad)'],
    ['dam', 'Half-siblings through his mom'],
    ['sire', 'Half-siblings through his dad'],
  ]
  return (
    <section>
      <h3 className="section-title">👪 Brothers & sisters</h3>
      {groups.map(([k, label]) => {
        const list = data.siblings.filter((s) => s.parent === k)
        if (!list.length) return null
        return (
          <details key={k} className="card ped-details" open={k === 'full'}>
            <summary>
              {label} <span className="muted">· {list.length}</span>
            </summary>
            <ul className="ped-sibs">
              {list.map((s) => {
                const h = data.horses[s.id]
                return (
                  <li key={s.reg}>
                    <button className="ped-sib" onClick={() => h && onOpen(s.id)} disabled={!h}>
                      <strong>
                        {niceName(s.name)}
                        {h?.titles && <span className="ped-titles"> {h.titles}</span>}
                      </strong>
                      <span className="muted small">
                        {' '}
                        {year(s.foaled)} · {niceName(s.color)} {s.gender.toLowerCase()}
                        {s.otherParent ? (k === 'sire' ? ` · out of ${niceName(s.otherParent)}` : ` · by ${niceName(s.otherParent)}`) : ''}
                        {h?.photos?.length ? ' · 📷' : ''}
                        {h && bestResults(h).length ? ' · 🏆' : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </details>
        )
      })}
    </section>
  )
}

function People({ data }: { data: PedigreeData }) {
  if (!data.people.length) return null
  return (
    <section>
      <h3 className="section-title">🏠 Breeder & past owners</h3>
      <ul className="list">
        {data.people.map((p) => (
          <li key={p.name + p.role} className="card">
            <strong>{niceName(p.name)}</strong>
            <div className="muted small">{p.role}</div>
            {p.address && <div className="small">{p.address}</div>}
            <div className="small muted">
              {[p.currentlyOwn != null && `owns ${p.currentlyOwn}`, p.onceOwned != null && `once owned ${p.onceOwned}`, p.bred != null && `bred ${p.bred}`].filter(Boolean).join(' · ')} horses
            </div>
            {p.horses?.length ? (
              <details className="ped-details">
                <summary className="small">Their horses ({p.horses.length})</summary>
                <ul className="ped-sibs small">
                  {p.horses.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </details>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function HorseSheet({
  data,
  horse: h,
  onOpen,
  onTree,
  onClose,
}: {
  data: PedigreeData
  horse: PedHorse
  onOpen: (id: string) => void
  onTree: (id: string) => void
  onClose: () => void
}) {
  const [big, setBig] = useState<string | null>(null)
  const [allShows, setAllShows] = useState(false)
  const shows = [...(h.shows ?? []), ...(h.openComps ?? [])]
  const best = bestResults(h)
  const sire = h.sireId ? data.horses[h.sireId] : undefined
  const dam = h.damId ? data.horses[h.damId] : undefined
  const bigUrl = usePedUrl(big ?? undefined)

  return (
    <Sheet open title={`${sexIcon(h)} ${niceName(h.name)}${h.titles ? ' ' + h.titles : ''}`} onClose={onClose}>
      {h.photos?.length ? (
        <div className="ped-photos">
          {h.photos.map((p) => (
            <PedImg key={p} path={p} className="ped-photo" onClick={() => setBig(p)} alt={h.name} />
          ))}
        </div>
      ) : (
        <p className="muted small">No photos in DataSource for this horse.</p>
      )}

      <dl className="ped-facts">
        <dt>Registration</dt>
        <dd>{h.reg}</dd>
        {h.foaled && (
          <>
            <dt>Born</dt>
            <dd>{formatDate(h.foaled)}</dd>
          </>
        )}
        <dt>Sex & colour</dt>
        <dd>
          {niceName(h.color ?? '')} {h.gender?.toLowerCase()}
          {h.gelded ? ` (gelded ${formatDate(h.gelded)})` : ''}
        </dd>
        {h.died && (
          <>
            <dt>Died</dt>
            <dd>{formatDate(h.died)}</dd>
          </>
        )}
        {h.breeder && (
          <>
            <dt>Breeder</dt>
            <dd>{niceName(h.breeder)}</dd>
          </>
        )}
        {h.parentage && (
          <>
            <dt>Parentage</dt>
            <dd>{h.parentage}</dd>
          </>
        )}
        {h.titles && (
          <>
            <dt>AHA titles</dt>
            <dd>{h.titles} (the + and / marks are achievement awards earned from show points)</dd>
          </>
        )}
      </dl>

      <div className="quick-row">
        {sire ? (
          <button className="btn ghost small" onClick={() => onOpen(sire.id)}>
            Sire: {niceName(sire.name)}
          </button>
        ) : (
          h.sire && <span className="small muted">Sire: {niceName(h.sire)}</span>
        )}
        {dam ? (
          <button className="btn ghost small" onClick={() => onOpen(dam.id)}>
            Dam: {niceName(dam.name)}
          </button>
        ) : (
          h.dam && <span className="small muted">Dam: {niceName(h.dam)}</span>
        )}
      </div>
      {(sire || dam) && h.id !== data.rootId && (
        <div className="quick-row">
          <button className="btn small" onClick={() => onTree(h.id)}>
            🌳 Show {niceName(h.name)}’s family tree
          </button>
        </div>
      )}

      <span className="field-label">Markings</span>
      {h.markingImg && <PedImg path={h.markingImg} className="ped-marking" alt="Markings diagram" />}
      <p className="small">{h.markings ? h.markings.toLowerCase().replace(/(^|\.\s*)([a-z])/g, (m) => m.toUpperCase()) : 'No markings recorded.'}</p>

      <span className="field-label">Accomplishments</span>
      {shows.length === 0 && !h.rides?.length && <p className="small muted">No show or ride records in DataSource.</p>}
      {best.length > 0 && (
        <ul className="ped-results">
          {best.slice(0, 8).map((r, i) => (
            <Result key={i} r={r} highlight />
          ))}
        </ul>
      )}
      {shows.length > 0 && (
        <>
          <button className="link small" onClick={() => setAllShows(!allShows)}>
            {allShows ? 'Hide' : 'Show'} all {shows.length} show results
          </button>
          {allShows && (
            <ul className="ped-results">
              {shows.map((r, i) => (
                <Result key={i} r={r} />
              ))}
            </ul>
          )}
        </>
      )}
      {h.rides?.length ? (
        <p className="small">🏇 {h.rides.length} endurance ride records (AERC).</p>
      ) : null}

      {h.owners?.length ? (
        <>
          <span className="field-label">Owners</span>
          <ul className="ped-sibs small">
            {h.owners.map((o, i) => (
              <li key={i}>
                {niceName(o.name)}
                {o.date && <span className="muted"> · from {formatDate(o.date)}</span>}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {big && (
        <div className="lightbox" onClick={() => setBig(null)}>
          {bigUrl && <img src={bigUrl} alt={h.name} className="lightbox-img" />}
        </div>
      )}
    </Sheet>
  )
}

function Result({ r, highlight }: { r: ShowResult; highlight?: boolean }) {
  return (
    <li className={highlight ? 'hi' : ''}>
      <strong>{r.place || '—'}</strong> {r.cls}
      <div className="muted small">
        {niceName(r.show)} · {r.date ? formatDate(r.date) : ''}
        {r.inClass ? ` · ${r.inClass} in class` : ''}
        {r.rider ? ` · shown by ${niceName(r.rider.replace(/^\d+-/, ''))}` : ''}
      </div>
    </li>
  )
}
