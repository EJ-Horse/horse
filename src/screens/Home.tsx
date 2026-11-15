import { useState } from 'react'
import { Field, MediaImg, SaveBar, Screen, Sheet, Tile, UploadButton, useDraft } from '../components/ui'
import { ageFrom, daysBetween, dueLabel, dueState, formatDate, today, monthKey } from '../lib/dates'
import { go } from '../lib/router'
import { useItems, useSingle, updateItem, type Item } from '../lib/store'
import { supabase } from '../lib/supabase'
import type { CoachEntry, RideSchedule, CareTask, Cost, Fear, HorsePhoto, Profile, ShopItem, Skill, Symptom, Todo, Vaccine, VetVisit } from '../lib/types'
import { careNextDue, lastVisit } from './Health'
import { AttentionBar, AttentionRow, AttentionSheet, useOpenAttention } from '../components/Attention'
import type { Attention } from '../lib/types'
import { DEFAULT_SCHEDULE, weekSlots } from '../lib/rides'
import { isDoneThisWeek } from './Weekly'
import { money } from './Costs'

type Alert = { key: string; text: string; sub: string; state: string; to: string }

function useAlerts(): Alert[] {
  const vaccines = useItems<Vaccine>('vaccine')
  const care = useItems<CareTask>('care')
  const symptoms = useItems<Symptom>('symptom')
  const out: Alert[] = []
  const latest = new Map<string, Item<Vaccine>>()
  for (const v of [...vaccines].sort((a, b) => b.data.date.localeCompare(a.data.date))) if (!latest.has(v.data.name)) latest.set(v.data.name, v)
  for (const v of latest.values()) {
    const st = dueState(v.data.nextDue, today(), 30)
    if (st === 'overdue' || st === 'soon') out.push({ key: v.id, text: `💉 ${v.data.name}`, sub: dueLabel(v.data.nextDue), state: st, to: 'horse/health' })
  }
  for (const c of care) {
    const next = careNextDue(c.data)
    const st = dueState(next, today(), 7)
    if (st === 'overdue' || st === 'soon') out.push({ key: c.id, text: `🧰 ${c.data.title}`, sub: dueLabel(next), state: st, to: 'horse/health' })
  }
  for (const s of symptoms.filter((s) => !s.data.resolved)) {
    out.push({ key: s.id, text: `🩹 ${s.data.what}`, sub: 'Open symptom', state: s.data.severity === 'serious' ? 'overdue' : 'soon', to: 'horse/health' })
  }
  return out.sort((a, b) => (a.state === 'overdue' ? -1 : 0) - (b.state === 'overdue' ? -1 : 0))
}

export function Home() {
  const profile = useSingle<Profile>('profile')
  const p = profile?.data ?? { name: 'EJ' }
  const alerts = useAlerts()
  const manual = useOpenAttention()
  const [adding, setAdding] = useState(false)
  const [openItem, setOpenItem] = useState<Item<Attention> | null>(null)
  const todos = useItems<Todo>('todo').filter((t) => !t.data.oneOff || !t.data.doneWeek || isDoneThisWeek(t.data))
  const done = todos.filter((t) => isDoneThisWeek(t.data)).length
  const [editing, setEditing] = useState(false)
  return (
    <Screen title={p.name || 'EJ'} back={false}>
      <button className="hero" onClick={() => setEditing(true)}>
        {p.photo ? <MediaImg path={p.photo} className="hero-img" /> : <img src={`${import.meta.env.BASE_URL}ej-face.jpg`} alt="EJ" className="hero-img" />}
        <span className="hero-text">
          <strong>{p.name || 'EJ'}</strong>
          <span className="muted small">
            {p.birthDate ? ageFrom(p.birthDate) : 'about 13 years'}
            {p.breed && ` · ${p.breed}`}
            {p.color && ` · ${p.color}`}
          </span>
          <span className="link small">{p.birthDate ? 'Edit profile' : 'Add birth date & details'}</span>
        </span>
      </button>

      {alerts.length > 0 || manual.length > 0 ? (
        <div className="card">
          <div className="row-between">
            <strong>Needs attention</strong>
            <button className="pill-btn" onClick={() => setAdding(true)}>
              + Add
            </button>
          </div>
          {manual.length > 0 && (
            <ul className="attn-list">
              {manual.map((a) => (
                <AttentionRow key={a.id} item={a} showArea onOpen={() => setOpenItem(a)} />
              ))}
            </ul>
          )}
          {alerts.length > 0 && (
            <ul className="alerts">
              {alerts.map((a) => (
                <li key={a.key} className="tap" onClick={() => go(a.to)}>
                  <span>{a.text}</span>
                  <span className={'due ' + a.state}>{a.sub}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="card soft row-between">
          <span>✅ Nothing needs attention.</span>
          <button className="pill-btn" onClick={() => setAdding(true)}>
            + Add
          </button>
        </div>
      )}
      {adding && <AttentionSheet item={null} area="horse" onClose={() => setAdding(false)} />}
      {openItem && <AttentionSheet item={openItem} area={openItem.data.area} onClose={() => setOpenItem(null)} />}

      <button className="card tap week-card" onClick={() => go('rider/weekly')}>
        <span>
          <strong>This week</strong>
          <span className="muted small"> · {done} of {todos.length} done</span>
        </span>
        <span className="progress-track">
          <span className="progress-seg good" style={{ flex: done }} />
          <span className="progress-seg none" style={{ flex: Math.max(0, todos.length - done) }} />
        </span>
      </button>

      <div className="tiles">
        <Tile to="horse" icon="🐴" title="Horse" sub="Health, photos, food, looks, shopping, costs" />
        <Tile to="rider" icon="🏇" title="Rider" sub="Rides, skills, tips, weekly, fears" />
      </div>

      {p.vetPhone || p.farrierPhone ? (
        <div className="quick-row">
          {p.vetPhone && (
            <a className="btn secondary small" href={`tel:${p.vetPhone}`}>
              📞 Vet{p.vetName ? ` (${p.vetName})` : ''}
            </a>
          )}
          {p.farrierPhone && (
            <a className="btn secondary small" href={`tel:${p.farrierPhone}`}>
              📞 Farrier
            </a>
          )}
        </div>
      ) : null}
      {editing && profile && <ProfileSheet item={profile} onClose={() => setEditing(false)} />}
    </Screen>
  )
}

export function HorseHub() {
  const photos = useItems<HorsePhoto>('photo')
  const shop = useItems<ShopItem>('shop').filter((s) => !s.data.bought)
  const costs = useItems<Cost>('cost')
  const cur = useSingle<Profile>('profile')?.data.currency || '$'
  const alerts = useAlerts().length
  const month = costs.filter((c) => !c.data.pending && monthKey(c.data.date) === monthKey(today())).reduce((s, c) => s + c.data.amount, 0)
  return (
    <Screen title="Horse" back={false}>
      <AttentionBar area="horse" />
      <VetCard />
      <div className="tiles">
        <Tile to="horse/health" icon="🩺" title="Health" sub="Vaccines, care, symptoms" badge={alerts || undefined} />
        <Tile to="horse/photos" icon="📸" title="Photos" sub={`${photos.length} photos`} />
        <Tile to="horse/nutrition" icon="🥕" title="Nutrition" sub="OK, limit, never" />
        <Tile to="horse/beautify" icon="🎀" title="Beautify" sub="Braids & looks" />
        <Tile to="horse/shopping" icon="🛒" title="Shopping" sub={shop.length ? `${shop.length} to buy` : 'List'} />
        <Tile to="horse/costs" icon="💶" title="Costs" sub={`${money(month, cur)} this month`} />
      </div>
    </Screen>
  )
}

export function RiderHub() {
  const skills = useItems<Skill>('skill')
  const fears = useItems<Fear>('fear').filter((f) => f.data.status !== 'fine now')
  const todos = useItems<Todo>('todo').filter((t) => !t.data.oneOff || !t.data.doneWeek || isDoneThisWeek(t.data))
  const left = todos.filter((t) => !isDoneThisWeek(t.data)).length
  const excellent = skills.filter((s) => s.data.rating === 'excellent').length
  const rides = useItems<CoachEntry>('coach')
  const schedule = useSingle<RideSchedule>('rideSchedule')?.data.slots ?? DEFAULT_SCHEDULE
  const ridesDue = weekSlots(schedule, rides.map((r) => r.data), today()).filter((s) => s.state === 'due').length
  return (
    <Screen title="Sofía" back={false}>
      <figure className="rider-hero">
        <img src={`${import.meta.env.BASE_URL}sofia-ej.jpg`} alt="Sofía with EJ" />
      </figure>
      <AttentionBar area="rider" />
      <div className="tiles">
        <Tile to="rider/skills" icon="🏆" title="Skills" sub={`${excellent}/${skills.length} excellent`} />
        <Tile to="rider/tips" icon="💡" title="Tips" sub="Cues & videos" />
        <Tile to="rider/coach" icon="🏇" title="Rides" sub="Lessons & solo rides" badge={ridesDue || undefined} />
        <Tile to="rider/weekly" icon="✅" title="This week" sub={left ? `${left} left` : 'All done'} badge={left || undefined} />
        <Tile to="rider/fears" icon="😨" title="What scares EJ" sub={fears.length ? `${fears.length} active` : 'Nothing'} />
      </div>
    </Screen>
  )
}

function ProfileSheet({ item, onClose }: { item: Item<Profile>; onClose: () => void }) {
  const [d, set] = useDraft<Profile>(item.data)
  async function save() {
    await updateItem(item.id, d)
    onClose()
  }
  return (
    <Sheet open title="EJ’s profile" onClose={onClose}>
      {d.photo && <MediaImg path={d.photo} className="preview-img" />}
      <UploadButton folder="profile" label={d.photo ? 'Change photo' : '📷 Add EJ’s photo'} onUploaded={([p]) => set('photo', p)} />
      <Field label="Name">
        <input value={d.name} onChange={(e) => set('name', e.target.value)} />
      </Field>
      <Field label="Birth date">
        <input type="date" value={d.birthDate ?? ''} onChange={(e) => set('birthDate', e.target.value || undefined)} />
      </Field>
      <Field label="Breed">
        <input value={d.breed ?? ''} onChange={(e) => set('breed', e.target.value)} />
      </Field>
      <Field label="Colour">
        <input value={d.color ?? ''} onChange={(e) => set('color', e.target.value)} placeholder="e.g. Bay, chestnut" />
      </Field>
      <Field label="Height">
        <input value={d.height ?? ''} onChange={(e) => set('height', e.target.value)} placeholder="e.g. 16 hh" />
      </Field>
      <Field label="Stable">
        <input value={d.stable ?? ''} onChange={(e) => set('stable', e.target.value)} />
      </Field>
      <Field label="Vet name">
        <input value={d.vetName ?? ''} onChange={(e) => set('vetName', e.target.value)} />
      </Field>
      <Field label="Vet clinic">
        <input value={d.vetClinic ?? ''} onChange={(e) => set('vetClinic', e.target.value)} />
      </Field>
      <Field label="Vet phone">
        <input type="tel" value={d.vetPhone ?? ''} onChange={(e) => set('vetPhone', e.target.value)} />
      </Field>
      <Field label="Farrier phone">
        <input type="tel" value={d.farrierPhone ?? ''} onChange={(e) => set('farrierPhone', e.target.value)} />
      </Field>
      <Field label="Currency symbol for costs">
        <input value={d.currency ?? '$'} onChange={(e) => set('currency', e.target.value)} maxLength={4} />
      </Field>
      <SaveBar onSave={save} />
      {supabase && (
        <button className="btn ghost danger" style={{ width: '100%', marginTop: 16 }} onClick={() => void supabase!.auth.signOut()}>
          Sign out
        </button>
      )}
    </Sheet>
  )
}

/** Asked once after the first sign-in so the app can show who added what. */
export function NamePrompt({ userId, onDone }: { userId: string; onDone: () => void }) {
  const [name, setName] = useState('')
  async function save() {
    if (!name.trim() || !supabase) return
    await supabase.from('people').upsert({ user_id: userId, name: name.trim() })
    onDone()
  }
  return (
    <div className="lock">
      <div className="card lock-card">
        <span style={{ fontSize: 48 }}>👋</span>
        <h1>What’s your name?</h1>
        <p className="muted small">So the app can show who added what.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sofía" autoFocus />
        <button className="btn" style={{ width: '100%' }} onClick={() => void save()} disabled={!name.trim()}>
          Continue
        </button>
      </div>
    </div>
  )
}


/** Always-visible vet contact on the Horse tab. */
function VetCard() {
  const profile = useSingle<Profile>('profile')
  const visits = useItems<VetVisit>('visit')
  const [editing, setEditing] = useState(false)
  const p = profile?.data
  const last = lastVisit(visits)
  const ago = last ? daysBetween(last.data.date, today()) : null
  return (
    <div className="card vet-card">
      <div className="row-between">
        <span className="vet-title">
          <span aria-hidden>🩺</span>
          <span>
            <strong>{p?.vetName || 'Add your vet'}</strong>
            {p?.vetClinic && <span className="muted small"> · {p.vetClinic}</span>}
          </span>
        </span>
        <button className="link small" onClick={() => setEditing(true)}>
          Edit
        </button>
      </div>
      <p className="small muted">
        {last ? (
          <>
            Last seen {formatDate(last.data.date)} ({ago === 0 ? 'today' : `${ago} days ago`}) · {last.data.reason}
          </>
        ) : (
          'No visits logged yet'
        )}
      </p>
      <div className="quick-row">
        {p?.vetPhone ? (
          <a className="btn small" href={`tel:${p.vetPhone.replace(/[^\d+]/g, '')}`}>
            📞 Call {p.vetPhone}
          </a>
        ) : (
          <button className="btn small secondary" onClick={() => setEditing(true)}>
            Add phone number
          </button>
        )}
        <button className="btn ghost small" onClick={() => go('horse/health')}>
          Visits
        </button>
      </div>
      {editing && profile && <ProfileSheet item={profile} onClose={() => setEditing(false)} />}
    </div>
  )
}
