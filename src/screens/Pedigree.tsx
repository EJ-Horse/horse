import { useEffect, useMemo, useState } from 'react'
import { Screen, Sheet } from '../components/ui'
import { formatDate } from '../lib/dates'
import {
  ancestorsByGeneration,
  bestResults,
  GEN_NAMES,
  generations,
  niceName,
  PEDIGREE_PATH,
  relation,
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
  const [view, setView] = useState<'tree' | 'detail'>('tree')
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

      <div className="segmented ped-view">
        <button className={view === 'tree' ? 'on' : ''} onClick={() => setView('tree')}>
          🌳 Tree
        </button>
        <button className={view === 'detail' ? 'on' : ''} onClick={() => setView('detail')}>
          📋 Detailed
        </button>
      </div>

      {view === 'tree' ? (
        <>
          <div className="ped-controls">
            <div className="segmented mini">
              {[3, 4, 5, 6, 7].map((n) => (
                <button key={n} className={depth === n ? 'on' : ''} onClick={() => setDepth(n)}>
                  {n - 1} back
                </button>
              ))}
            </div>
            <span className="muted small">Tap any horse for details · 📷 photos · 🏆 show wins · blue = sire, pink = dam</span>
          </div>
          <Tree data={data} rootId={rootId} depth={depth} onOpen={setOpen} />
        </>
      ) : (
        <Detailed data={data} rootId={rootId} onOpen={setOpen} />
      )}

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
      <div className={'ped-grid' + (depth === 3 ? ' fit' : '')} style={{ gridTemplateColumns: depth === 3 ? 'repeat(3, minmax(0, 1fr))' : `repeat(${depth}, ${depth > 5 ? 112 : 132}px)`, gridTemplateRows: `repeat(${rows}, minmax(${depth > 4 ? 36 : depth > 3 ? 48 : 64}px, auto))` }}>
        {gens.map((g, gi) =>
          g.map((h, i) => {
            const span = rows / g.length
            return (
              <div key={`${gi}-${i}`} className="ped-slot" style={{ gridColumn: gi + 1, gridRow: `${i * span + 1} / span ${span}` }}>
                {h ? (
                  <button className={'ped-box' + (i % 2 ? ' dam' : ' sire') + (gi === 0 ? ' root' : '') + (depth <= 4 && h.photos?.length ? ' with-thumb' : '')} onClick={() => onOpen(h.id)}>
                    {depth <= 4 && h.photos?.length ? <PedImg path={h.photos[0]} className="ped-thumb" /> : null}
                    <span className="ped-name">
                      {niceName(h.name)}
                      {h.titles && <span className="ped-titles"> {h.titles}</span>}
                    </span>
                    <span className="ped-meta">
                      {sexIcon(h)} {year(h.foaled)} · {niceName(h.color ?? '')}
                      {h.photos?.length ? ' · 📷' : ''}
                      {h.videos?.length ? ' · ▶︎' : ''}
                      {depth > 4 && bestResults(h).length ? ' · 🏆' : ''}
                    </span>
                    {depth <= 4 && bestResults(h)[0] && <span className="ped-win">🏆 {shortWin(bestResults(h)[0])}</span>}
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

function shortWin(r: ShowResult) {
  return `${niceName(r.place)}, ${niceName(r.show).replace(/\s*\(.*$/, '')}${r.date ? ' ' + year(r.date) : ''}`
}

/** Every ancestor as a card, generation by generation, with photo, relationship and highlights. */
function Detailed({ data, rootId, onOpen }: { data: PedigreeData; rootId: string; onOpen: (id: string) => void }) {
  const gens = useMemo(() => ancestorsByGeneration(data, rootId, 6), [data, rootId])
  const counts = useMemo(() => repeats(data, rootId, 7), [data, rootId])
  const rootName = niceName(data.horses[rootId].name)
  return (
    <div>
      {gens.map((g, gi) => {
        const known = g.filter((s) => s.horse)
        if (!known.length) return null
        return (
          <details key={gi} className="ped-gen" open={gi < 2}>
            <summary>
              <strong>{GEN_NAMES[gi + 1]}</strong>{' '}
              <span className="muted small">
                · {known.length} horses{gi === 0 ? ` of ${rootName}` : ''}
              </span>
            </summary>
            <ul className="ped-cards">
              {g.map((s, i) => {
                const h = s.horse
                if (!h) return null
                const win = bestResults(h)[0]
                const n = counts.get(h.id) ?? 1
                return (
                  <li key={i}>
                    <button className={'ped-card ' + s.path.at(-1)} onClick={() => onOpen(h.id)}>
                      {h.photos?.length ? <PedImg path={h.photos[0]} className="ped-card-img" /> : <span className="ped-card-img none">{sexIcon(h)}</span>}
                      <span className="ped-card-body">
                        <span className="ped-card-rel">
                          {gi < 3 ? relation(s.path) + ' · ' : ''}
                          {s.path.at(-1) === 'sire' ? 'sire' : 'dam'} of {niceName(s.child?.name ?? '')}
                          {n > 1 ? <span className="ped-x"> ×{n} in tree</span> : null}
                        </span>
                        <strong className="ped-card-name">
                          {niceName(h.name)}
                          {h.titles && <span className="ped-titles"> {h.titles}</span>}
                        </strong>
                        <span className="small muted">
                          {[h.foaled && `born ${year(h.foaled)}`, h.died && `died ${year(h.died)}`, `${niceName(h.color ?? '')} ${h.gender?.toLowerCase() ?? ''}`.trim(), h.reg].filter(Boolean).join(' · ')}
                        </span>
                        {h.breeder && <span className="small muted">Bred by {niceName(h.breeder)}</span>}
                        {win && (
                          <span className="ped-win">
                            🏆 {shortWin(win)}
                            {bestResults(h).length > 1 ? ` +${bestResults(h).length - 1} more` : ''}
                          </span>
                        )}
                        {h.markings && <span className="small muted ped-card-marks">✦ {h.markings.toLowerCase()}</span>}
                        <span className="ped-card-icons small">
                          {[
                            h.photos?.length && `📷 ${h.photos.length} photos`,
                            (h.shows?.length || h.openComps?.length) && `${(h.shows?.length ?? 0) + (h.openComps?.length ?? 0)} show results`,
                            h.rides?.length && `🏇 ${h.rides.length} rides`,
                            h.videos?.length && `▶︎ video`,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </details>
        )
      })}
    </div>
  )
}

function LineBreeding({ data, onOpen }: { data: PedigreeData; onOpen: (id: string) => void }) {
  const rep = [...repeats(data, data.rootId, 7).entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1])
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
        <p className="muted small">No photos found for this horse.</p>
      )}
      {h.videos?.length ? (
        <div className="quick-row">
          {h.videos.map((v) => (
            <a key={v.url} className="btn ghost small" href={v.url} target="_blank" rel="noreferrer">
              ▶︎ {v.title}
            </a>
          ))}
        </div>
      ) : null}
      {h.photoCredits && Object.keys(h.photoCredits).length > 0 && <p className="hint">Some photos were found on the web; tap one to see where it came from.</p>}

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
          {h.photoCredits?.[big] && (
            <a className="ped-credit" href={h.photoCredits[big]} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
              Photo from {new URL(h.photoCredits[big]).hostname.replace(/^www\./, '')} ↗
            </a>
          )}
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
