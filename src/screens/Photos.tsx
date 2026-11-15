import { useState } from 'react'
import { AddButton, AddedBy, ErrorText, Field, Lightbox, MediaImg, SaveBar, Screen, Sheet, UploadButton, useDraft } from '../components/ui'
import { daysBetween, formatDate, today } from '../lib/dates'
import { go } from '../lib/router'
import { addItem, deleteMedia, removeItem, updateItem, useItems, type Item } from '../lib/store'
import { BODY_PARTS, type BodyPart, type HorsePhoto } from '../lib/types'

const PART_ICON: Partial<Record<BodyPart, string>> = { Face: '🐴', Teeth: '🦷' }

function byNewest(a: Item<HorsePhoto>, b: Item<HorsePhoto>) {
  return b.data.date.localeCompare(a.data.date) || b.created_at.localeCompare(a.created_at)
}

export function Photos() {
  const photos = useItems<HorsePhoto>('photo')
  const [adding, setAdding] = useState(false)
  const issues = [...new Set(photos.map((p) => p.data.issue).filter(Boolean))] as string[]
  return (
    <Screen title="Photos" action={<AddButton onClick={() => setAdding(true)} label="Photo" />}>
      <p className="muted small">
        Take photos of each part from the same angle every so often. Open a part to see its history and compare old and new photos side by side.
      </p>
      <div className="part-grid">
        {BODY_PARTS.map((part) => {
          const list = photos.filter((p) => p.data.part === part).sort(byNewest)
          return (
            <button key={part} className="part-card" onClick={() => go('horse/photos/' + encodeURIComponent(part))}>
              {list[0] ? <MediaImg path={list[0].data.path} className="part-img" /> : <span className="part-icon">{PART_ICON[part] ?? '📷'}</span>}
              <span className="part-name">{part}</span>
              <span className="part-sub">{list.length ? `${list.length} · ${formatDate(list[0].data.date)}` : 'No photos'}</span>
            </button>
          )
        })}
      </div>
      {issues.length > 0 && (
        <>
          <h3 className="section-title">Things we’re watching</h3>
          <ul className="list compact">
            {issues.map((i) => {
              const n = photos.filter((p) => p.data.issue === i).length
              return (
                <li key={i} className="tap" onClick={() => go('horse/photos/issue/' + encodeURIComponent(i))}>
                  🔎 {i} <span className="muted">· {n} photos</span>
                </li>
              )
            })}
          </ul>
        </>
      )}
      {adding && <PhotoSheet onClose={() => setAdding(false)} />}
    </Screen>
  )
}

/** Groups photos by the day they were taken, newest day first. */
export function groupByDay<I extends { data: { date: string } }>(items: I[]): [string, I[]][] {
  const map = new Map<string, I[]>()
  for (const it of items) {
    const list = map.get(it.data.date) ?? []
    list.push(it)
    map.set(it.data.date, list)
  }
  return [...map.entries()].sort((x, y) => y[0].localeCompare(x[0]))
}

/** History of one body part (or one tracked issue), grouped by day, with compare. */
export function PhotoTimeline({ part, issue }: { part?: BodyPart; issue?: string }) {
  const all = useItems<HorsePhoto>('photo')
  const list = all.filter((p) => (issue ? p.data.issue === issue : p.data.part === part)).sort(byNewest)
  const days = groupByDay(list)
  const [adding, setAdding] = useState(false)
  const [edit, setEdit] = useState<Item<HorsePhoto> | null>(null)
  const [view, setView] = useState<Item<HorsePhoto> | null>(null)
  const [pick, setPick] = useState<string[]>([]) // up to two ids to compare
  const comparing = pick.length === 2 ? pick.map((id) => list.find((p) => p.id === id)).filter((x): x is Item<HorsePhoto> => !!x) : null
  // Default compare: newest photo vs the newest photo from an earlier day.
  const earlier = days.length >= 2 ? days[1][1][0] : undefined
  const pair = comparing?.length === 2 ? comparing : list[0] && earlier ? [list[0], earlier] : null

  function toggle(id: string) {
    setPick((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-1), id]))
  }

  return (
    <Screen title={issue ? `🔎 ${issue}` : part!} action={<AddButton onClick={() => setAdding(true)} label="Photos" />}>
      {list.length === 0 && <p className="empty">No photos yet. Add the first ones so you have something to compare with later.</p>}
      {pair && (
        <Compare
          older={pair[0].data.date <= pair[1].data.date ? pair[0] : pair[1]}
          newer={pair[0].data.date <= pair[1].data.date ? pair[1] : pair[0]}
        />
      )}
      {list.length >= 2 && (
        <p className="muted small">
          {pick.length === 1 ? 'Now tap another photo and choose ⇄ Compare.' : 'Tap any photo, then ⇄ Compare, to pick which two to compare.'}
        </p>
      )}
      {days.map(([date, photos]) => (
        <section key={date} className="day">
          <h3 className="day-title">
            {formatDate(date)} <span className="muted">· {photos.length === 1 ? '1 photo' : `${photos.length} photos`}</span>
          </h3>
          <div className="day-grid">
            {photos.map((p) => (
              <button key={p.id} className={'day-cell' + (pick.includes(p.id) ? ' picked' : '')} onClick={() => setView(p)} aria-label={`Photo from ${formatDate(date)}`}>
                <MediaImg path={p.data.path} className="day-img" />
                {p.data.issue && !issue && <span className="day-badge">🔎</span>}
                {pick.includes(p.id) && <span className="day-badge pick">⇄</span>}
              </button>
            ))}
          </div>
        </section>
      ))}
      {view && (
        <PhotoView
          item={view}
          showPart={!!issue}
          picked={pick.includes(view.id)}
          canCompare={list.length >= 2}
          onCompare={() => {
            toggle(view.id)
            setView(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onEdit={() => {
            setEdit(view)
            setView(null)
          }}
          onClose={() => setView(null)}
        />
      )}
      {adding && <PhotoSheet part={part ?? list[0]?.data.part} issue={issue} onClose={() => setAdding(false)} />}
      {edit && <PhotoSheet item={edit} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function PhotoView({
  item,
  showPart,
  picked,
  canCompare,
  onCompare,
  onEdit,
  onClose,
}: {
  item: Item<HorsePhoto>
  showPart: boolean
  picked: boolean
  canCompare: boolean
  onCompare: () => void
  onEdit: () => void
  onClose: () => void
}) {
  const [big, setBig] = useState(false)
  const p = item.data
  return (
    <Sheet open title={formatDate(p.date)} onClose={onClose}>
      <MediaImg path={p.path} className="preview-img tap" onClick={() => setBig(true)} />
      {showPart && <p className="muted small">{p.part}</p>}
      {p.issue && <span className="tag">🔎 {p.issue}</span>}
      {p.note && <p className="small" style={{ marginTop: 6 }}>{p.note}</p>}
      <AddedBy item={item} />
      <div className="quick-row" style={{ marginTop: 12 }}>
        {canCompare && (
          <button className={'btn small' + (picked ? '' : ' secondary')} onClick={onCompare}>
            ⇄ {picked ? 'Remove from compare' : 'Compare'}
          </button>
        )}
        <button className="btn ghost small" onClick={onEdit}>
          Edit
        </button>
      </div>
      <Lightbox path={big ? p.path : null} onClose={() => setBig(false)} />
    </Sheet>
  )
}

function Compare({ older, newer }: { older: Item<HorsePhoto>; newer: Item<HorsePhoto> }) {
  const [mode, setMode] = useState<'side' | 'slider'>('side')
  const [pos, setPos] = useState(50)
  const gap = daysBetween(older.data.date, newer.data.date)
  return (
    <div className="card compare">
      <div className="row-between">
        <strong>Compare</strong>
        <div className="segmented mini">
          <button className={mode === 'side' ? 'on' : ''} onClick={() => setMode('side')}>
            Side by side
          </button>
          <button className={mode === 'slider' ? 'on' : ''} onClick={() => setMode('slider')}>
            Slider
          </button>
        </div>
      </div>
      {mode === 'side' ? (
        <div className="compare-side">
          <figure>
            <MediaImg path={older.data.path} className="compare-img" />
            <figcaption>{formatDate(older.data.date)}</figcaption>
          </figure>
          <figure>
            <MediaImg path={newer.data.path} className="compare-img" />
            <figcaption>{formatDate(newer.data.date)}</figcaption>
          </figure>
        </div>
      ) : (
        <>
          <div className="compare-slider">
            <MediaImg path={older.data.path} className="slider-img" />
            <div className="slider-top" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <MediaImg path={newer.data.path} className="slider-img" />
            </div>
            <div className="slider-line" style={{ left: `${pos}%` }} />
          </div>
          <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Slide between old and new photo" />
          <div className="row-between muted small">
            <span>← {formatDate(older.data.date)}</span>
            <span>{formatDate(newer.data.date)} →</span>
          </div>
        </>
      )}
      <p className="muted small">
        {gap} days apart. Look for spots that changed size or colour, swelling, cuts healing, and hoof shape.
      </p>
    </div>
  )
}

function PhotoSheet({ item, part, issue, onClose }: { item?: Item<HorsePhoto>; part?: BodyPart; issue?: string; onClose: () => void }) {
  const photos = useItems<HorsePhoto>('photo')
  const issues = [...new Set(photos.map((p) => p.data.issue).filter(Boolean))] as string[]
  const [d, set] = useDraft<Partial<HorsePhoto>>(item?.data ?? { part: part ?? 'Face', date: today(), issue })
  // New photos: several can be picked at once, each keeping the date it was taken.
  const [picked, setPicked] = useState<{ path: string; date: string }[]>([])
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function save() {
    setErr('')
    if (item) {
      await updateItem(item.id, d)
      onClose()
      return
    }
    if (!picked.length) return setErr('Add at least one photo first.')
    setBusy(true)
    try {
      for (const p of picked) await addItem('photo', { ...(d as HorsePhoto), path: p.path, date: p.date })
    } catch (e) {
      setBusy(false)
      return setErr(e instanceof Error ? e.message : String(e))
    }
    onClose()
    if (d.part && !issue) go('horse/photos/' + encodeURIComponent(d.part))
  }

  return (
    <Sheet open title={item ? 'Edit photo' : picked.length > 1 ? `${picked.length} new photos` : 'New photo'} onClose={onClose}>
      {item ? (
        <MediaImg path={d.path} className="preview-img" />
      ) : (
        <>
          {picked.length > 0 && (
            <ul className="picked">
              {picked.map((p, i) => (
                <li key={p.path}>
                  <MediaImg path={p.path} className="thumb" />
                  <label className="field-label">
                    Taken
                    <input
                      type="date"
                      value={p.date}
                      onChange={(e) => setPicked((list) => list.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))}
                    />
                  </label>
                  <button
                    type="button"
                    className="icon-btn small"
                    aria-label="Remove photo"
                    onClick={() => {
                      setPicked((list) => list.filter((x) => x.path !== p.path))
                      void deleteMedia([p.path])
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          <UploadButton
            folder="photos"
            multiple
            label={picked.length ? '+ Add more photos' : '📷 Take a photo or choose from your phone'}
            onUploadedInfo={(files) => setPicked((list) => [...list, ...files.map((f) => ({ path: f.path, date: f.takenOn ?? today() }))])}
          />
          {picked.length === 0 && (
            <p className="hint">
              iPhone: choose Photo Library. Android: pick from Gallery or Google Photos. The date each photo was taken is filled in for you.
            </p>
          )}
        </>
      )}
      <Field label={item ? 'Body part' : picked.length > 1 ? 'Body part (for all)' : 'Body part'}>
        <select value={d.part} onChange={(e) => set('part', e.target.value as BodyPart)}>
          {BODY_PARTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>
      {item && (
        <Field label="Date taken">
          <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
      )}
      <Field label="Watching something? (optional)" hint="Give it a name like “Spot on left hind” to follow it across photos.">
        <input list="issues" value={d.issue ?? ''} onChange={(e) => set('issue', e.target.value || undefined)} />
        <datalist id="issues">
          {issues.map((i) => (
            <option key={i} value={i} />
          ))}
        </datalist>
      </Field>
      <Field label="Note">
        <textarea rows={2} value={d.note ?? ''} onChange={(e) => set('note', e.target.value)} placeholder="e.g. Spot looks smaller" />
      </Field>
      <ErrorText error={err} />
      <SaveBar
        busy={busy}
        saveLabel={!item && picked.length > 1 ? `Save ${picked.length} photos` : 'Save'}
        onSave={save}
        onDelete={
          item
            ? () => {
                void deleteMedia([item.data.path])
                void removeItem(item.id).then(onClose)
              }
            : undefined
        }
      />
    </Sheet>
  )
}
