import { useState } from 'react'
import { ErrorText, Field, Lightbox, MediaImg, SaveBar, Screen, Segmented, Sheet, UploadButton, useDraft } from '../components/ui'
import { formatDate, today } from '../lib/dates'
import { addItem, removeItem, updateItem, useItems, useSingle, type Item } from '../lib/store'
import { ageAt, ERA_ORDER, ERAS, exactAge, milesBetween, sortKey, STOPS, storyDate, type Era, type StoryChapter, type StoryQuestion } from '../lib/story'
import type { CoachEntry, FunPhoto, Profile, TrickProgress, VetVisit } from '../lib/types'
import { PedImg } from './Pedigree'
import { TRICKS } from '../lib/tricks'

/** A photo from private storage: pedigree/… research photos or the family's own uploads. */
function StoryImg({ path, className, onClick }: { path: string; className?: string; onClick?: () => void }) {
  return path.startsWith('pedigree/') ? <PedImg path={path} className={className} onClick={onClick} /> : <MediaImg path={path} className={className} onClick={onClick} />
}

/** Horse → Life story: EJ's whole life, from his birth in South Dakota to today. */
export function LifeStory() {
  const profile = useSingle<Profile>('profile')?.data
  const chapters = useItems<StoryChapter>('story').sort((a, b) => sortKey(a.data.date).localeCompare(sortKey(b.data.date)))
  const questions = useItems<StoryQuestion>('storyq')
  const [editing, setEditing] = useState<Item<StoryChapter> | 'new' | null>(null)
  const [big, setBig] = useState<string | null>(null)
  const birth = profile?.birthDate ?? '2014-05-09'
  const name = profile?.name || 'EJ'
  // EJ's own photos first (his registration id is in the file name), then the rest of the family
  const allPhotos = [...new Set(chapters.flatMap((c) => c.data.photos ?? []))]
  const heroPhotos = [...allPhotos.filter((p) => p.includes('1849656') || p.startsWith('fun/')), ...allPhotos.filter((p) => !p.includes('1849656') && !p.startsWith('fun/'))].slice(0, 8)
  const miles = STOPS.slice(1).reduce((s, stop, i) => s + milesBetween(STOPS[i], stop), 0)

  return (
    <Screen title="Life story">
      <div className="card story-hero">
        <div className="story-hero-photos">
          {profile?.photo && <MediaImg path={profile.photo} className="story-hero-img" onClick={() => setBig(profile.photo!)} />}
          {heroPhotos.map((p) => (
            <StoryImg key={p} path={p} className="story-hero-img" onClick={() => setBig(p)} />
          ))}
        </div>
        <strong className="story-hero-name">The story of {name}</strong>
        <span className="small muted">{profile?.registeredName ? `${profile.registeredName} · ` : ''}grey Arabian gelding</span>
        <span className="small">
          {exactAge(birth, today())} old today
        </span>
        <div className="story-stats">
          <span>
            <strong>{STOPS.length}</strong> homes
          </span>
          <span>
            <strong>3</strong> states
          </span>
          <span>
            <strong>~{miles.toLocaleString()}</strong> miles
          </span>
          <span>
            <strong>{chapters.length}</strong> chapters
          </span>
        </div>
      </div>

      <JourneyMap />

      {chapters.length === 0 && <p className="empty">No chapters yet. Tap + Chapter to start his story.</p>}

      {ERA_ORDER.map((era) => {
        const list = chapters.filter((c) => c.data.era === era)
        if (!list.length && era !== 'us') return null
        const e = ERAS[era]
        return (
          <section key={era} className={'story-era era-' + era}>
            <h3 className="story-era-title">
              <span aria-hidden>{e.emoji}</span> {e.title}
              <span className="muted small"> · {e.years}</span>
            </h3>
            <p className="muted small story-era-place">{e.place}</p>
            <ol className="story-line">
              {list.map((c) => (
                <ChapterCard key={c.id} item={c} birth={birth} onEdit={() => setEditing(c)} onPhoto={setBig} />
              ))}
            </ol>
            {era === 'us' && <LiveMoments since="2026-11-01" birth={birth} onPhoto={setBig} />}
          </section>
        )
      })}

      <button className="btn" onClick={() => setEditing('new')}>
        ＋ Add a chapter
      </button>

      {questions.length > 0 && <Questions list={questions} />}

      <p className="hint">
        Pieced together from his AHA registration, the old Eljomar Arabians and Majik Arabians websites (via the Internet Archive), his pre-purchase vet exam and our own
        records. Dates marked “about” are best guesses.
      </p>

      {editing && <ChapterSheet item={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} />}
      <Lightbox path={big && !big.startsWith('pedigree/') ? big : null} onClose={() => setBig(null)} />
      {big?.startsWith('pedigree/') && <PedLightbox path={big} onClose={() => setBig(null)} />}
    </Screen>
  )
}

function PedLightbox({ path, onClose }: { path: string; onClose: () => void }) {
  return (
    <div className="lightbox" onClick={onClose}>
      <PedImg path={path} className="lightbox-img" />
    </div>
  )
}

function ChapterCard({ item, birth, onEdit, onPhoto }: { item: Item<StoryChapter>; birth: string; onEdit: () => void; onPhoto: (p: string) => void }) {
  const c = item.data
  const [more, setMore] = useState(false)
  const long = c.text.length > 260
  return (
    <li className="story-item">
      <span className="story-dot" aria-hidden>
        {c.emoji}
      </span>
      <div className="card story-card">
        <div className="row-between">
          <span className="small muted">
            {storyDate(c.date, c.approx)} · <span className="story-age">{ageAt(birth, c.date)}</span>
          </span>
          <button className="link small" onClick={onEdit}>
            Edit
          </button>
        </div>
        <strong className="story-title">{c.title}</strong>
        {c.place && <span className="small muted">📍 {c.place}</span>}
        <p className="story-text">{long && !more ? c.text.slice(0, 240).replace(/\s+\S*$/, '') + '…' : c.text}</p>
        {long && (
          <button className="link small" onClick={() => setMore(!more)}>
            {more ? 'Show less' : 'Read more'}
          </button>
        )}
        {c.photos?.length ? (
          <div className="story-photos">
            {c.photos.map((p) => (
              <StoryImg key={p} path={p} className="story-photo" onClick={() => onPhoto(p)} />
            ))}
          </div>
        ) : null}
        {c.video && (
          <a className="btn ghost small" href={c.video} target="_blank" rel="noreferrer">
            ▶︎ Watch the video
          </a>
        )}
        {c.sources?.length ? (
          <span className="story-sources small muted">
            Source:{' '}
            {c.sources.map((s, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
              </span>
            ))}
          </span>
        ) : null}
      </div>
    </li>
  )
}

/** The newest things from the app itself: lessons, vet visits, fun photos and tricks. */
function LiveMoments({ since, birth, onPhoto }: { since: string; birth: string; onPhoto: (p: string) => void }) {
  const lessons = useItems<CoachEntry>('coach')
  const visits = useItems<VetVisit>('visit')
  const fun = useItems<FunPhoto>('funphoto')
  const tricks = useItems<TrickProgress>('trick')
  type M = { date: string; emoji: string; text: string; photo?: string }
  const moments: M[] = [
    ...lessons.map((l) => ({ date: l.data.date, emoji: '🏇', text: `${l.data.title || 'Ride'}${l.data.feedback ? `: “${l.data.feedback.trim()}”` : ''}` })),
    ...visits.map((v) => ({ date: v.data.date, emoji: '🩺', text: `Vet: ${v.data.reason}` })),
    ...fun.map((f) => ({ date: f.data.date, emoji: '📸', text: f.data.caption || 'Fun photo', photo: f.data.path })),
    ...tricks.filter((t) => t.data.status === 'got it' && t.data.lastPracticed).map((t) => ({ date: t.data.lastPracticed!, emoji: '🌟', text: `Learned a trick: ${t.data.custom?.name ?? TRICKS.find((x) => x.key === t.data.key)?.name ?? t.data.key}` })),
  ]
    .filter((m) => m.date >= since)
    .sort((a, b) => b.date.localeCompare(a.date))
  if (!moments.length) return null
  const shown = moments.slice(0, 12)
  return (
    <div className="card soft story-live">
      <strong>✨ Latest moments together</strong>
      <span className="small muted">Added automatically from lessons, vet visits, tricks and fun photos.</span>
      <ul className="story-live-list">
        {shown.map((m, i) => (
          <li key={i}>
            <span aria-hidden>{m.emoji}</span>
            <span className="story-live-text">
              <span className="small muted">
                {formatDate(m.date)} · {ageAt(birth, m.date)}
              </span>
              <span>{m.text}</span>
            </span>
            {m.photo && <MediaImg path={m.photo} className="story-live-photo" onClick={() => onPhoto(m.photo!)} />}
          </li>
        ))}
      </ul>
      {moments.length > shown.length && <span className="small muted">+ {moments.length - shown.length} more</span>}
    </div>
  )
}

function Questions({ list }: { list: Item<StoryQuestion>[] }) {
  const open = list.filter((q) => !q.data.answer)
  const done = list.filter((q) => q.data.answer)
  return (
    <section>
      <h3 className="section-title">🔎 Still to find out</h3>
      <p className="hint">Gaps in his story. Good things to ask the seller or check in his papers. Tap one to write the answer.</p>
      <ul className="list">
        {[...open, ...done].map((q) => (
          <QuestionRow key={q.id} item={q} />
        ))}
      </ul>
    </section>
  )
}

function QuestionRow({ item }: { item: Item<StoryQuestion> }) {
  const q = item.data
  const [edit, setEdit] = useState(false)
  const [answer, setAnswer] = useState(q.answer ?? '')
  return (
    <li className={'card story-q' + (q.answer ? ' answered' : '')}>
      <button className="story-q-head" onClick={() => setEdit(!edit)}>
        <span aria-hidden>{q.answer ? '✅' : '❓'}</span>
        <span>
          <strong>{q.q}</strong>
          <span className="small muted"> {q.why}</span>
          {q.answer && !edit && <span className="story-q-answer">{q.answer}</span>}
        </span>
      </button>
      {edit && (
        <div className="story-q-edit">
          <textarea rows={2} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="What did you find out?" />
          <button
            className="btn small"
            onClick={() => {
              void updateItem(item.id, { ...q, answer: answer.trim() || undefined })
              setEdit(false)
            }}
          >
            Save
          </button>
        </div>
      )}
    </li>
  )
}

function ChapterSheet({ item, onClose }: { item?: Item<StoryChapter>; onClose: () => void }) {
  const [d, set] = useDraft<StoryChapter>(item?.data ?? { date: today(), era: 'us', emoji: '💛', title: '', text: '', ours: true })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.title.trim()) return setErr('Give the chapter a title.')
    if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(d.date)) return setErr('Use a date like 2026-11-19, 2026-11 or 2026.')
    const clean = { ...d, title: d.title.trim(), text: d.text.trim() }
    try {
      if (item) await updateItem(item.id, clean)
      else await addItem('story', clean)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title={item ? 'Edit chapter' : 'New chapter'} onClose={onClose}>
      <Field label="Title">
        <input value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. First show together" />
      </Field>
      <Field label="Date (2026-11-19, 2026-11 or 2026)">
        <input value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
      <label className="field">
        <span className="field-label">
          <input type="checkbox" checked={!!d.approx} onChange={(e) => set('approx', e.target.checked || undefined)} /> The date is a guess
        </span>
      </label>
      <Field label="Part of his life">
        <Segmented value={d.era} options={ERA_ORDER} labels={{ sd: '🌾 SD', mt: '🏔️ MT', ca: '🌉 CA', us: '💛 Us' }} onChange={(v: Era) => set('era', v)} />
      </Field>
      <Field label="Emoji">
        <input value={d.emoji} onChange={(e) => set('emoji', e.target.value)} maxLength={4} />
      </Field>
      <Field label="Where">
        <input value={d.place ?? ''} onChange={(e) => set('place', e.target.value || undefined)} />
      </Field>
      <Field label="What happened">
        <textarea rows={5} value={d.text} onChange={(e) => set('text', e.target.value)} />
      </Field>
      <span className="field-label">Photos</span>
      <div className="story-photos">
        {(d.photos ?? []).map((p) => (
          <button key={p} className="story-photo-del" onClick={() => set('photos', (d.photos ?? []).filter((x) => x !== p))} aria-label="Remove photo">
            <StoryImg path={p} className="story-photo" />
            <span>✕</span>
          </button>
        ))}
      </div>
      <UploadButton folder="story" multiple label="📷 Add photos" onUploaded={(paths) => set('photos', [...(d.photos ?? []), ...paths])} />
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} />
      {item && (
        <button
          className="btn ghost small danger"
          onClick={() => {
            if (confirm('Delete this chapter?')) void removeItem(item.id).then(onClose)
          }}
        >
          Delete chapter
        </button>
      )}
    </Sheet>
  )
}

/** A simple map of the West with the four places he has lived, joined in order. */
function JourneyMap() {
  const W = 340
  const H = 190
  const x = (lon: number) => ((lon + 126) / (126 - 95)) * W
  const y = (lat: number) => ((49.5 - lat) / (49.5 - 35.5)) * H
  const pts = STOPS.map((s) => ({ ...s, X: x(s.lon), Y: y(s.lat) }))
  const path = pts.map((p, i) => (i === 0 ? `M${p.X} ${p.Y}` : `Q${(pts[i - 1].X + p.X) / 2} ${Math.min(pts[i - 1].Y, p.Y) - 22} ${p.X} ${p.Y}`)).join(' ')
  const states: [string, number, number][] = [
    ['WA', -120.5, 47.4], ['OR', -120.5, 43.9], ['CA', -119.6, 37.2], ['NV', -116.8, 39.3], ['ID', -114.6, 44.2], ['MT', -109.6, 47.0],
    ['WY', -107.5, 43.0], ['UT', -111.7, 39.3], ['ND', -100.5, 47.4], ['SD', -100.3, 44.4], ['NE', -99.8, 41.5], ['CO', -105.5, 39.0],
  ]
  return (
    <div className="card story-map">
      <strong>🗺️ His journey</strong>
      <svg viewBox={`0 0 ${W} ${H}`} className="story-map-svg" role="img" aria-label="Map: Aberdeen South Dakota, then Corvallis Montana, then Placer County California, then San Martin California">
        <rect width={W} height={H} rx={10} className="map-bg" />
        {[-120, -115, -110, -105, -100].map((lon) => (
          <line key={lon} x1={x(lon)} y1={0} x2={x(lon)} y2={H} className="map-grid" />
        ))}
        {[37, 40, 43, 46].map((lat) => (
          <line key={lat} x1={0} y1={y(lat)} x2={W} y2={y(lat)} className="map-grid" />
        ))}
        {states.map(([s, lon, lat]) => (
          <text key={s} x={x(lon)} y={y(lat)} className="map-state" textAnchor="middle">
            {s}
          </text>
        ))}
        <path d={path} className="map-route" />
        {pts.map((p, i) => (
          <g key={p.name}>
            <circle cx={p.X} cy={p.Y} r={i === pts.length - 1 ? 7 : 5.5} className={i === pts.length - 1 ? 'map-dot now' : 'map-dot'} />
            <text x={p.X + (i === 0 ? 0 : i >= 2 ? 9 : 0)} y={p.Y + (i === 0 ? 18 : i === 1 ? 17 : i === 2 ? -8 : 14)} className="map-label" textAnchor={i === 0 ? 'end' : i >= 2 ? 'start' : 'middle'}>
              {p.year} · {p.name}
            </text>
          </g>
        ))}
      </svg>
      <span className="small muted">
        About {STOPS.slice(1).reduce((s, stop, i) => s + milesBetween(STOPS[i], stop), 0).toLocaleString()} miles as the crow flies. The roads are longer!
      </span>
    </div>
  )
}
