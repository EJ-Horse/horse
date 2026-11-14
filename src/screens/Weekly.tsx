import { useState } from 'react'
import { ErrorText, Field, SaveBar, Screen, Segmented, Sheet, AddButton, useDraft } from '../components/ui'
import { addDays, formatDate, parseDate, today, weekStart } from '../lib/dates'
import { addItem, getCurrentUserId, removeItem, updateItem, useItems, usePeople, type Item } from '../lib/store'
import { normalizeReaction, REACTIONS, type Fear, type Reaction, type Todo } from '../lib/types'

export function isDoneThisWeek(t: Todo, now = today()) {
  return t.doneWeek === weekStart(now)
}

/** Weekly checklist: ticks reset every Monday, so Sunday is the day to finish them. */
export function Weekly() {
  const todos = useItems<Todo>('todo')
  const people = usePeople()
  const [text, setText] = useState('')
  const [oneOff, setOneOff] = useState(false)
  const now = today()
  const sunday = addDays(weekStart(now), 6)
  const isSunday = parseDate(now).getDay() === 0
  // One-off tasks disappear the week after they were done.
  const visible = todos.filter((t) => !t.data.oneOff || !t.data.doneWeek || t.data.doneWeek === weekStart(now))
  const done = visible.filter((t) => isDoneThisWeek(t.data, now))
  const left = visible.filter((t) => !isDoneThisWeek(t.data, now))

  async function add() {
    if (!text.trim()) return
    await addItem('todo', { text: text.trim(), oneOff: oneOff || undefined })
    setText('')
  }

  function toggle(t: Item<Todo>) {
    const on = isDoneThisWeek(t.data, now)
    void updateItem(t.id, { ...t.data, doneWeek: on ? undefined : weekStart(now), doneBy: on ? undefined : getCurrentUserId() ?? undefined })
  }

  return (
    <Screen title="This week">
      <div className={'card ' + (isSunday ? 'warn' : 'soft')}>
        <strong>{isSunday ? '☀️ It’s Sunday: finish the list!' : `Finish by Sunday ${formatDate(sunday)}`}</strong>
        <p className="small" style={{ margin: '4px 0 0' }}>
          {done.length} of {visible.length} done. Weekly tasks reset on Monday.
        </p>
      </div>
      <ul className="checklist">
        {[...left, ...done].map((t) => {
          const on = isDoneThisWeek(t.data, now)
          return (
            <li key={t.id} className={on ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={on} onChange={() => toggle(t)} />
                <span>
                  {t.data.text}
                  {t.data.oneOff && <span className="tag">once</span>}
                  {on && t.data.doneBy && people[t.data.doneBy] && <span className="by"> · {people[t.data.doneBy]}</span>}
                </span>
              </label>
              <button
                className="icon-btn small"
                aria-label={`Delete ${t.data.text}`}
                onClick={() => {
                  if (confirm(`Delete “${t.data.text}”?`)) void removeItem(t.id)
                }}
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>
      <div className="card soft">
        <div className="input-row">
          <input placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void add()} />
          <button className="btn small" onClick={() => void add()}>
            Add
          </button>
        </div>
        <label className="check small">
          <input type="checkbox" checked={oneOff} onChange={(e) => setOneOff(e.target.checked)} /> Just this week (doesn’t repeat)
        </label>
      </div>
    </Screen>
  )
}

const REACTION_LABEL: Record<Reaction, string> = { curious: '👀 Curious', bothered: '😬 Bothered', 'freaks out': '😱 Freaks out' }
const REACTION_HINT: Record<Reaction, string> = {
  curious: 'Alert and watching, ears forward, but calm.',
  bothered: 'Tense, snorts, won’t go near it.',
  'freaks out': 'Spins, bolts, rears or won’t calm down.',
}
const STATUSES = ['scared', 'improving', 'fine now'] as const
const STATUS_ICON = { scared: '😨', improving: '📈', 'fine now': '😌' }

/** Things that scare EJ, with a history of how it's going. */
export function Fears() {
  const fears = useItems<Fear>('fear')
  const [edit, setEdit] = useState<Item<Fear> | 'new' | null>(null)
  const order = (f: Fear) => STATUSES.indexOf(f.status)
  const sorted = [...fears].sort((a, b) => order(a.data) - order(b.data) || b.data.firstSeen.localeCompare(a.data.firstSeen))
  return (
    <Screen title="What scares EJ" action={<AddButton onClick={() => setEdit('new')} label="Add" />}>
      <p className="muted small">Keep track of what spooks EJ and how it improves with practice.</p>
      {sorted.length === 0 && <p className="empty">Nothing yet. Brave horse!</p>}
      <ul className="list">
        {sorted.map((f) => (
          <li key={f.id} className={'card tap' + (f.data.status === 'fine now' ? ' faded' : '')} onClick={() => setEdit(f)}>
            <div className="row-between">
              <strong>{f.data.what}</strong>
              <span className="tag">
                {STATUS_ICON[f.data.status]} {f.data.status}
              </span>
            </div>
            <p className="muted small">
              {REACTION_LABEL[normalizeReaction(f.data.reaction)]} · since {formatDate(f.data.firstSeen)}
              {f.data.history?.length ? ` · ${f.data.history.length} updates` : ''}
            </p>
            {f.data.history?.length ? <p className="small">Latest: {f.data.history[f.data.history.length - 1].note}</p> : null}
          </li>
        ))}
      </ul>
      {edit && <FearSheet item={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function FearSheet({ item, onClose }: { item: Item<Fear> | null; onClose: () => void }) {
  const [d, set] = useDraft<Fear>(item?.data ?? { what: '', firstSeen: today(), reaction: 'bothered', status: 'scared', history: [] })
  const [update, setUpdate] = useState('')
  const [err, setErr] = useState('')
  async function save() {
    if (!d.what.trim()) return setErr('What scares EJ?')
    const data = update.trim() ? { ...d, history: [...(d.history ?? []), { date: today(), note: update.trim() }] } : d
    if (item) await updateItem(item.id, data)
    else await addItem('fear', data)
    onClose()
  }
  return (
    <Sheet open title={item ? d.what : 'Something scary'} onClose={onClose}>
      <Field label="What">
        <input value={d.what} onChange={(e) => set('what', e.target.value)} placeholder="e.g. Plastic bags, the tractor" />
      </Field>
      <Field label="First noticed">
        <input type="date" value={d.firstSeen} onChange={(e) => set('firstSeen', e.target.value)} />
      </Field>
      <Field label="Reaction">
        <Segmented value={normalizeReaction(d.reaction)} options={REACTIONS} labels={REACTION_LABEL} onChange={(v) => set('reaction', v)} />
        <span className="hint">{REACTION_HINT[normalizeReaction(d.reaction)]}</span>
      </Field>
      <Field label="Now">
        <Segmented value={d.status} options={STATUSES} labels={{ scared: '😨 Scared', improving: '📈 Better', 'fine now': '😌 Fine now' }} onChange={(v) => set('status', v)} />
      </Field>
      <Field label="Notes">
        <textarea rows={2} value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="What helps? e.g. let him sniff it first" />
      </Field>
      {item && (
        <Field label="Add an update">
          <input value={update} onChange={(e) => setUpdate(e.target.value)} placeholder="e.g. Walked past it calmly today" />
        </Field>
      )}
      {d.history?.length ? (
        <ul className="history">
          {[...d.history].reverse().map((h, i) => (
            <li key={i}>
              <span className="muted small">{formatDate(h.date)}</span> {h.note}
            </li>
          ))}
        </ul>
      ) : null}
      <ErrorText error={err} />
      <SaveBar onSave={save} onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined} />
    </Sheet>
  )
}
