import { useState } from 'react'
import { AddButton, AddedBy, ErrorText, Field, Lightbox, MediaImg, SaveBar, Screen, Segmented, Sheet, UploadButton, useDraft } from '../components/ui'
import { addDays, dueLabel, dueState, formatDate, today } from '../lib/dates'
import { downloadIcs } from '../lib/ics'
import { addItem, deleteMedia, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { CareTask, Symptom, Vaccine } from '../lib/types'

const TABS = ['Vaccines', 'Care', 'Symptoms'] as const
type Tab = (typeof TABS)[number]

export function Health() {
  const [tab, setTab] = useState<Tab>('Vaccines')
  return (
    <Screen title="Health">
      <Segmented value={tab} options={TABS} onChange={setTab} />
      {tab === 'Vaccines' && <Vaccines />}
      {tab === 'Care' && <Care />}
      {tab === 'Symptoms' && <Symptoms />}
    </Screen>
  )
}

function DueChip({ due }: { due?: string }) {
  const st = dueState(due)
  return <span className={'due ' + st}>{dueLabel(due)}</span>
}

// ---------------- Vaccines ----------------

const VACCINE_NAMES = ['Flu (influenza)', 'Tetanus', 'Rabies', 'West Nile', 'EHV (rhino)', 'Strangles', 'EEE/WEE']

function Vaccines() {
  const list = useItems<Vaccine>('vaccine')
  const [edit, setEdit] = useState<Item<Vaccine> | 'new' | null>(null)
  // Show only the latest shot of each vaccine at the top; older shots are history.
  const latest = new Map<string, Item<Vaccine>>()
  for (const v of [...list].sort((a, b) => b.data.date.localeCompare(a.data.date))) {
    if (!latest.has(v.data.name)) latest.set(v.data.name, v)
  }
  const current = [...latest.values()].sort((a, b) => (a.data.nextDue ?? '9').localeCompare(b.data.nextDue ?? '9'))
  const history = [...list].filter((v) => !current.includes(v)).sort((a, b) => b.data.date.localeCompare(a.data.date))
  return (
    <>
      <div className="row-between">
        <p className="muted small">Next due first. Tap a vaccine to edit it.</p>
        <AddButton onClick={() => setEdit('new')} label="Vaccine" />
      </div>
      {current.length === 0 && <p className="empty">No vaccines yet. Add the last shot of each one and when the next is due.</p>}
      <ul className="list">
        {current.map((v) => (
          <li key={v.id} className="card tap" onClick={() => setEdit(v)}>
            <div className="row-between">
              <strong>{v.data.name}</strong>
              <DueChip due={v.data.nextDue} />
            </div>
            <p className="muted small">
              Last given {formatDate(v.data.date)}
              {v.data.vet && ` · ${v.data.vet}`} <AddedBy item={v} />
            </p>
            {v.data.nextDue && (
              <button
                className="link small"
                onClick={(e) => {
                  e.stopPropagation()
                  downloadIcs(`EJ: ${v.data.name} vaccine due`, v.data.nextDue!, v.data.notes ?? '')
                }}
              >
                📅 Add reminder to my calendar
              </button>
            )}
          </li>
        ))}
      </ul>
      {history.length > 0 && (
        <>
          <h3 className="section-title">History</h3>
          <ul className="list compact">
            {history.map((v) => (
              <li key={v.id} className="tap" onClick={() => setEdit(v)}>
                {v.data.name} · {formatDate(v.data.date)}
              </li>
            ))}
          </ul>
        </>
      )}
      {edit && <VaccineSheet item={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
    </>
  )
}

function VaccineSheet({ item, onClose }: { item: Item<Vaccine> | null; onClose: () => void }) {
  const [d, set] = useDraft<Vaccine>(item?.data ?? { name: '', date: today(), nextDue: addDays(today(), 365) })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.name.trim()) return setErr('Add the vaccine name.')
    try {
      if (item) await updateItem(item.id, d)
      else await addItem('vaccine', d)
      onClose()
    } catch (e) {
      setErr(String(e))
    }
  }
  return (
    <Sheet open title={item ? 'Edit vaccine' : 'New vaccine'} onClose={onClose}>
      <Field label="Vaccine">
        <input list="vaccine-names" value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Flu" />
        <datalist id="vaccine-names">
          {VACCINE_NAMES.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </Field>
      <Field label="Date given">
        <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
      <Field label="Next due">
        <input type="date" value={d.nextDue ?? ''} onChange={(e) => set('nextDue', e.target.value || undefined)} />
      </Field>
      <div className="quick-row">
        {[180, 365].map((n) => (
          <button key={n} type="button" className="chip" onClick={() => set('nextDue', addDays(d.date, n))}>
            +{n === 180 ? '6 months' : '1 year'}
          </button>
        ))}
      </div>
      <Field label="Vet">
        <input value={d.vet ?? ''} onChange={(e) => set('vet', e.target.value)} />
      </Field>
      <Field label="Notes">
        <textarea value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={2} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={save} onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined} />
    </Sheet>
  )
}

// ---------------- Care (hooves, clipping, etc.) ----------------

export function careNextDue(c: CareTask) {
  return c.lastDone ? addDays(c.lastDone, c.everyDays) : undefined
}

function Care() {
  const list = useItems<CareTask>('care')
  const [edit, setEdit] = useState<Item<CareTask> | 'new' | null>(null)
  const sorted = [...list].sort((a, b) => (careNextDue(a.data) ?? '0').localeCompare(careNextDue(b.data) ?? '0'))
  return (
    <>
      <div className="row-between">
        <p className="muted small">Tap “Done today” after each visit and the next date updates by itself.</p>
        <AddButton onClick={() => setEdit('new')} label="Task" />
      </div>
      <ul className="list">
        {sorted.map((c) => {
          const next = careNextDue(c.data)
          return (
            <li key={c.id} className="card">
              <div className="row-between tap" onClick={() => setEdit(c)}>
                <strong>{c.data.title}</strong>
                <DueChip due={next} />
              </div>
              <p className="muted small">
                Every {c.data.everyDays} days
                {c.data.seasonal && ` · ${c.data.seasonal} only`}
                {c.data.lastDone && ` · last ${formatDate(c.data.lastDone)}`}
              </p>
              <div className="quick-row">
                <button className="btn small" onClick={() => void updateItem(c.id, { ...c.data, lastDone: today() })}>
                  ✓ Done today
                </button>
                {next && (
                  <button className="btn ghost small" onClick={() => downloadIcs(`EJ: ${c.data.title}`, next, c.data.notes ?? '')}>
                    📅 Remind me
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      {edit && <CareSheet item={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
    </>
  )
}

function CareSheet({ item, onClose }: { item: Item<CareTask> | null; onClose: () => void }) {
  const [d, set] = useDraft<CareTask>(item?.data ?? { title: '', everyDays: 30 })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.title.trim()) return setErr('Add a name.')
    if (item) await updateItem(item.id, d)
    else await addItem('care', d)
    onClose()
  }
  return (
    <Sheet open title={item ? 'Edit care task' : 'New care task'} onClose={onClose}>
      <Field label="Task">
        <input value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Farrier" />
      </Field>
      <Field label="Repeat every (days)">
        <input type="number" inputMode="numeric" min={1} value={d.everyDays} onChange={(e) => set('everyDays', Number(e.target.value) || 1)} />
      </Field>
      <Field label="Last done">
        <input type="date" value={d.lastDone ?? ''} onChange={(e) => set('lastDone', e.target.value || undefined)} />
      </Field>
      <Field label="Season (optional)">
        <input value={d.seasonal ?? ''} onChange={(e) => set('seasonal', e.target.value || undefined)} placeholder="e.g. winter" />
      </Field>
      <Field label="Notes">
        <textarea value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={2} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={save} onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined} />
    </Sheet>
  )
}

// ---------------- Symptoms ----------------

const RED_FLAGS = [
  'Rolling, pawing, looking at the belly (colic signs)',
  'Not eating or not passing manure',
  'Lame and won’t put weight on a leg',
  'Deep cut, a wound near a joint, or heavy bleeding',
  'Fever: above 38.5 °C (101.5 °F)',
  'Eye injury, or the eye is swollen shut',
  'Fast breathing at rest, or sweating without a reason',
]

function Symptoms() {
  const list = useItems<Symptom>('symptom')
  const [edit, setEdit] = useState<Item<Symptom> | 'new' | null>(null)
  const [big, setBig] = useState<string | null>(null)
  const [showFlags, setShowFlags] = useState(false)
  const open = list.filter((s) => !s.data.resolved).sort((a, b) => b.data.date.localeCompare(a.data.date))
  const closed = list.filter((s) => s.data.resolved).sort((a, b) => b.data.date.localeCompare(a.data.date))
  return (
    <>
      <div className="card warn">
        <button className="row-between link-block" onClick={() => setShowFlags(!showFlags)}>
          <strong>🚨 Call the vet now if…</strong>
          <span>{showFlags ? '−' : '+'}</span>
        </button>
        {showFlags && (
          <ul className="bullets">
            {RED_FLAGS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="row-between">
        <p className="muted small">Write down what you see and add photos. This doesn’t replace the vet.</p>
        <AddButton onClick={() => setEdit('new')} label="Symptom" />
      </div>
      {list.length === 0 && <p className="empty">Nothing logged. Hopefully it stays that way!</p>}
      <ul className="list">
        {[...open, ...closed].map((s) => (
          <li key={s.id} className={'card tap' + (s.data.resolved ? ' faded' : '')} onClick={() => setEdit(s)}>
            <div className="row-between">
              <strong>{s.data.what}</strong>
              <span className={'sev ' + s.data.severity}>{s.data.resolved ? 'resolved' : s.data.severity}</span>
            </div>
            <p className="muted small">
              {formatDate(s.data.date)}
              {s.data.where && ` · ${s.data.where}`}
              {s.data.vetCalled && ' · vet called'} <AddedBy item={s} />
            </p>
            {s.data.photos?.length ? (
              <div className="thumbs">
                {s.data.photos.map((p) => (
                  <MediaImg
                    key={p}
                    path={p}
                    className="thumb"
                    onClick={() => {
                      setBig(p)
                    }}
                  />
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {edit && <SymptomSheet item={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
      <Lightbox path={big} onClose={() => setBig(null)} />
    </>
  )
}

function SymptomSheet({ item, onClose }: { item: Item<Symptom> | null; onClose: () => void }) {
  const [d, set] = useDraft<Symptom>(item?.data ?? { date: today(), what: '', severity: 'mild', photos: [] })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.what.trim()) return setErr('Describe what you see.')
    if (item) await updateItem(item.id, d)
    else await addItem('symptom', d)
    onClose()
  }
  return (
    <Sheet open title={item ? 'Symptom' : 'New symptom'} onClose={onClose}>
      <Field label="What do you see?">
        <input value={d.what} onChange={(e) => set('what', e.target.value)} placeholder="e.g. Swelling, cut, limping" />
      </Field>
      <Field label="Where on EJ?">
        <input value={d.where ?? ''} onChange={(e) => set('where', e.target.value)} placeholder="e.g. Back left leg, above the hoof" />
      </Field>
      <Field label="Date">
        <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
      <Field label="How bad?">
        <Segmented value={d.severity} options={['mild', 'moderate', 'serious'] as const} onChange={(v) => set('severity', v)} />
      </Field>
      <Field label="Photos">
        <div className="thumbs">
          {d.photos?.map((p) => (
            <div key={p} className="thumb-wrap">
              <MediaImg path={p} className="thumb" />
              <button
                type="button"
                className="thumb-x"
                aria-label="Remove photo"
                onClick={() => set('photos', d.photos!.filter((x) => x !== p))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <UploadButton folder="symptoms" multiple onUploaded={(ps) => set('photos', [...(d.photos ?? []), ...ps])} />
      </Field>
      <Field label="Notes / what the vet said">
        <textarea value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={3} />
      </Field>
      <label className="check">
        <input type="checkbox" checked={!!d.vetCalled} onChange={(e) => set('vetCalled', e.target.checked)} /> Vet called
      </label>
      <label className="check">
        <input type="checkbox" checked={!!d.resolved} onChange={(e) => set('resolved', e.target.checked)} /> Resolved
      </label>
      <ErrorText error={err} />
      <SaveBar
        onSave={save}
        onDelete={
          item
            ? () => {
                void deleteMedia(item.data.photos ?? [])
                void removeItem(item.id).then(onClose)
              }
            : undefined
        }
      />
    </Sheet>
  )
}
