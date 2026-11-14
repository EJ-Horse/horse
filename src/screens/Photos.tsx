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

/** History of one body part (or one tracked issue), with side-by-side compare. */
export function PhotoTimeline({ part, issue }: { part?: BodyPart; issue?: string }) {
  const all = useItems<HorsePhoto>('photo')
  const list = all.filter((p) => (issue ? p.data.issue === issue : p.data.part === part)).sort(byNewest)
  const [adding, setAdding] = useState(false)
  const [edit, setEdit] = useState<Item<HorsePhoto> | null>(null)
  const [big, setBig] = useState<string | null>(null)
  const [pick, setPick] = useState<string[]>([]) // up to two ids to compare
  const comparing = pick.length === 2 ? pick.map((id) => list.find((p) => p.id === id)!).filter(Boolean) : null
  // Default compare: the two newest.
  const pair = comparing ?? (list.length >= 2 ? [list[0], list[1]] : null)

  function toggle(id: string) {
    setPick((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-1), id]))
  }

  return (
    <Screen title={issue ? `🔎 ${issue}` : part!} action={<AddButton onClick={() => setAdding(true)} label="Photo" />}>
      {list.length === 0 && <p className="empty">No photos yet. Add the first one so you have something to compare with later.</p>}
      {pair && pair.length === 2 && <Compare older={pair[0].data.date <= pair[1].data.date ? pair[0] : pair[1]} newer={pair[0].data.date <= pair[1].data.date ? pair[1] : pair[0]} />}
      {list.length >= 2 && <p className="muted small">Tap ⇄ on any two photos to compare those instead.</p>}
      <ul className="timeline">
        {list.map((p) => (
          <li key={p.id} className={'card timeline-item' + (pick.includes(p.id) ? ' picked' : '')}>
            <MediaImg path={p.data.path} className="timeline-img" onClick={() => setBig(p.data.path)} />
            <div className="timeline-meta">
              <strong>{formatDate(p.data.date)}</strong>
              {issue && <span className="muted small">{p.data.part}</span>}
              {p.data.issue && !issue && <span className="tag">🔎 {p.data.issue}</span>}
              {p.data.note && <p className="small">{p.data.note}</p>}
              <AddedBy item={p} />
              <div className="quick-row">
                {list.length >= 2 && (
                  <button className={'chip' + (pick.includes(p.id) ? ' on' : '')} onClick={() => toggle(p.id)}>
                    ⇄ Compare
                  </button>
                )}
                <button className="chip" onClick={() => setEdit(p)}>
                  Edit
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {adding && <PhotoSheet part={part ?? list[0]?.data.part} issue={issue} onClose={() => setAdding(false)} />}
      {edit && <PhotoSheet item={edit} onClose={() => setEdit(null)} />}
      <Lightbox path={big} onClose={() => setBig(null)} />
    </Screen>
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
  const [err, setErr] = useState('')
  async function save() {
    if (!d.path) return setErr('Add the photo first.')
    if (item) await updateItem(item.id, d)
    else await addItem('photo', d as HorsePhoto)
    onClose()
    if (!item && d.part && !issue) go('horse/photos/' + encodeURIComponent(d.part))
  }
  return (
    <Sheet open title={item ? 'Edit photo' : 'New photo'} onClose={onClose}>
      {d.path ? (
        <MediaImg path={d.path} className="preview-img" />
      ) : (
        <UploadButton folder="photos" label="📷 Take or choose photo" onUploaded={([p]) => set('path', p)} />
      )}
      <Field label="Body part">
        <select value={d.part} onChange={(e) => set('part', e.target.value as BodyPart)}>
          {BODY_PARTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>
      <Field label="Date taken">
        <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
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
