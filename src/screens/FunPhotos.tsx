import { useEffect, useState } from 'react'
import { AddedBy, Lightbox, MediaImg, Screen, Sheet, UploadButton } from '../components/ui'
import { formatDate, monthLabel, today } from '../lib/dates'
import { addItem, deleteMedia, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { FunPhoto } from '../lib/types'

/** Horse → Fun photos: just for fun, no health tracking. */
export function FunPhotos() {
  const list = useItems<FunPhoto>('funphoto')
  const [onlyFav, setOnlyFav] = useState(false)
  const [open, setOpen] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const shown = list
    .filter((p) => !onlyFav || p.data.favorite)
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || b.created_at.localeCompare(a.created_at))
  const months = new Map<string, Item<FunPhoto>[]>()
  for (const p of shown) {
    const k = p.data.date.slice(0, 7)
    months.set(k, [...(months.get(k) ?? []), p])
  }
  const current = open ? list.find((p) => p.id === open) : undefined
  const favCount = list.filter((p) => p.data.favorite).length

  return (
    <Screen title="Fun photos">
      <div className="fun-head">
        <UploadButton
          folder="fun"
          multiple
          label="📷 Add photos"
          onUploadedInfo={async (files) => {
            setBusy(true)
            try {
              for (const f of files) await addItem<FunPhoto>('funphoto', { path: f.path, date: f.takenOn ?? today() })
            } finally {
              setBusy(false)
            }
          }}
        />
        {list.length > 0 && (
          <div className="segmented mini fun-filter">
            <button className={!onlyFav ? 'on' : ''} onClick={() => setOnlyFav(false)}>
              All {list.length}
            </button>
            <button className={onlyFav ? 'on' : ''} onClick={() => setOnlyFav(true)}>
              ❤️ {favCount}
            </button>
          </div>
        )}
      </div>
      {busy && <p className="hint">Saving…</p>}
      {list.length === 0 && (
        <div className="empty">
          <div style={{ fontSize: 44 }}>🐴📸</div>
          Silly faces, cuddles, show days, muddy days… add any photo of EJ and Sofía here.
        </div>
      )}
      {onlyFav && shown.length === 0 && list.length > 0 && <p className="empty">No favourites yet. Open a photo and tap ❤️.</p>}
      {[...months.entries()].map(([month, photos]) => (
        <section key={month} className="day">
          <h3 className="day-title">
            {monthLabel(month)} <span className="muted">· {photos.length === 1 ? '1 photo' : `${photos.length} photos`}</span>
          </h3>
          <div className="day-grid">
            {photos.map((p) => (
              <button key={p.id} className="day-cell" onClick={() => setOpen(p.id)} aria-label={p.data.caption || `Photo from ${formatDate(p.data.date)}`}>
                <MediaImg path={p.data.path} className="day-img" />
                {p.data.favorite && <span className="day-badge">❤️</span>}
              </button>
            ))}
          </div>
        </section>
      ))}
      {current && <FunPhotoSheet item={current} onClose={() => setOpen(null)} />}
    </Screen>
  )
}

function FunPhotoSheet({ item, onClose }: { item: Item<FunPhoto>; onClose: () => void }) {
  const p = item.data
  const [caption, setCaption] = useState(p.caption ?? '')
  const [date, setDate] = useState(p.date)
  const [big, setBig] = useState(false)
  const save = (patch: Partial<FunPhoto>) => void updateItem(item.id, { ...p, ...patch })
  // save the caption shortly after typing stops
  useEffect(() => {
    if (caption === (p.caption ?? '')) return
    const t = setTimeout(() => void updateItem(item.id, { ...p, caption: caption || undefined }), 500)
    return () => clearTimeout(t)
  }, [caption, p, item.id])
  return (
    <Sheet open title={formatDate(p.date)} onClose={onClose}>
      <MediaImg path={p.path} className="fun-big tap" onClick={() => setBig(true)} />
      <div className="row-between" style={{ margin: '8px 0' }}>
        <AddedBy item={item} />
        <button className={'fav-btn' + (p.favorite ? ' on' : '')} onClick={() => save({ favorite: !p.favorite })} aria-pressed={!!p.favorite}>
          {p.favorite ? '❤️ Favourite' : '🤍 Favourite'}
        </button>
      </div>
      <label className="field">
        <span className="field-label">Caption</span>
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. EJ stealing Sofía’s carrot 😂" />
      </label>
      <label className="field">
        <span className="field-label">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            if (e.target.value) save({ date: e.target.value })
          }}
        />
      </label>
      <button
        className="btn ghost small danger"
        onClick={() => {
          if (confirm('Delete this photo?')) {
            void deleteMedia([p.path])
            void removeItem(item.id).then(onClose)
          }
        }}
      >
        Delete photo
      </button>
      <Lightbox path={big ? p.path : null} onClose={() => setBig(false)} />
    </Sheet>
  )
}
