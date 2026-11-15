import { useState } from 'react'
import { ErrorText, Field, SaveBar, Screen, Segmented, Sheet, AddButton, useDraft } from '../components/ui'
import { addDays, formatDate, parseDate, today, weekStart } from '../lib/dates'
import { addItem, getCurrentUserId, removeItem, updateItem, useItems, usePeople, type Item } from '../lib/store'
import { normalizeReaction, REACTIONS, type Fear, type Reaction, type Repeat, type Todo } from '../lib/types'
import { REPEAT_LABEL, repeatLabel, repeatOf, todoStatus, visibleTodos } from '../lib/todos'

export function isTaskDone(t: Todo, now = today()) {
  return todoStatus(t, now).done
}

const REPEATS: Repeat[] = ['weekly', 'biweekly', 'monthly', 'quarterly', 'once', 'days']

function RepeatPicker({ repeat, everyDays, onChange }: { repeat: Repeat; everyDays?: number; onChange: (r: Repeat, days?: number) => void }) {
  return (
    <div className="repeat-picker">
      <div className="chips" role="radiogroup" aria-label="Repeats">
        {REPEATS.map((r) => (
          <button key={r} type="button" role="radio" aria-checked={repeat === r} className={repeat === r ? 'chip on' : 'chip'} onClick={() => onChange(r, r === 'days' ? everyDays ?? 3 : undefined)}>
            {REPEAT_LABEL[r]}
          </button>
        ))}
      </div>
      {repeat === 'days' && (
        <label className="check small">
          Every
          <input
            type="number"
            inputMode="numeric"
            min={1}
            className="days-input"
            value={everyDays ?? 3}
            onChange={(e) => onChange('days', Math.max(1, Number(e.target.value) || 1))}
          />
          days
        </label>
      )}
    </div>
  )
}

/** Tasks for Sofía and you. Each one repeats weekly (default), monthly, etc., or just once. */
export function Weekly() {
  const todos = useItems<Todo>('todo')
  const people = usePeople()
  const [text, setText] = useState('')
  const [repeat, setRepeat] = useState<Repeat>('weekly')
  const [everyDays, setEveryDays] = useState<number | undefined>()
  const [edit, setEdit] = useState<Item<Todo> | null>(null)
  const now = today()
  const sunday = addDays(weekStart(now), 6)
  const isSunday = parseDate(now).getDay() === 0
  const visible = visibleTodos(todos, now)
  const status = new Map(visible.map((t) => [t.id, todoStatus(t.data, now)]))
  const left = visible.filter((t) => !status.get(t.id)!.done)
  const done = visible.filter((t) => status.get(t.id)!.done).sort((a, b) => (status.get(a.id)!.nextDue ?? '9').localeCompare(status.get(b.id)!.nextDue ?? '9'))
  const weeklyLeft = left.filter((t) => repeatOf(t.data) === 'weekly').length

  async function add() {
    if (!text.trim()) return
    await addItem('todo', { text: text.trim(), repeat, everyDays: repeat === 'days' ? everyDays ?? 3 : undefined })
    setText('')
    setRepeat('weekly')
    setEveryDays(undefined)
  }

  function toggle(t: Item<Todo>) {
    const on = status.get(t.id)!.done
    void updateItem(t.id, {
      ...t.data,
      lastDone: on ? undefined : now,
      doneWeek: undefined,
      doneBy: on ? undefined : getCurrentUserId() ?? undefined,
    })
  }

  const row = (t: Item<Todo>) => {
    const st = status.get(t.id)!
    const r = repeatOf(t.data)
    return (
      <li key={t.id} className={st.done ? 'done' : ''}>
        <label>
          <input type="checkbox" checked={st.done} onChange={() => toggle(t)} />
          <span>
            <span className="task-text">{t.data.text}</span>
            {r !== 'weekly' && <span className="tag">{repeatLabel(t.data)}</span>}
            {st.done && (
              <span className="by">
                {t.data.doneBy && people[t.data.doneBy] ? ` · ${people[t.data.doneBy]}` : ''}
                {st.nextDue ? ` · back ${formatDate(st.nextDue)}` : ''}
              </span>
            )}
          </span>
        </label>
        <button className="icon-btn small" aria-label={`Edit ${t.data.text}`} onClick={() => setEdit(t)}>
          ✎
        </button>
      </li>
    )
  }

  return (
    <Screen title="Tasks">
      <div className={'card ' + (isSunday && weeklyLeft ? 'warn' : 'soft')}>
        <strong>
          {isSunday && weeklyLeft ? '☀️ It’s Sunday: finish the weekly tasks!' : `Weekly tasks: finish by Sunday ${formatDate(sunday)}`}
        </strong>
        <p className="small" style={{ margin: '4px 0 0' }}>
          {done.length} of {visible.length} done. Each task comes back on its own schedule.
        </p>
      </div>
      {left.length > 0 && <ul className="checklist">{left.map(row)}</ul>}
      {done.length > 0 && (
        <>
          <h3 className="section-title">Done</h3>
          <ul className="checklist">{done.map(row)}</ul>
        </>
      )}
      <div className="card soft">
        <div className="input-row">
          <input placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void add()} />
          <button className="btn small" onClick={() => void add()}>
            Add
          </button>
        </div>
        <span className="field-label">Repeats</span>
        <RepeatPicker
          repeat={repeat}
          everyDays={everyDays}
          onChange={(r, d) => {
            setRepeat(r)
            setEveryDays(d)
          }}
        />
      </div>
      {edit && <TaskSheet item={edit} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function TaskSheet({ item, onClose }: { item: Item<Todo>; onClose: () => void }) {
  const [d, set, setDraft] = useDraft<Todo>({ ...item.data, repeat: repeatOf(item.data), oneOff: undefined })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.text.trim()) return setErr('Add the task.')
    try {
      await updateItem(item.id, { ...d, text: d.text.trim(), everyDays: d.repeat === 'days' ? d.everyDays ?? 3 : undefined })
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="Task" onClose={onClose}>
      <Field label="Task">
        <input value={d.text} onChange={(e) => set('text', e.target.value)} />
      </Field>
      <span className="field-label">Repeats</span>
      <RepeatPicker repeat={d.repeat ?? 'weekly'} everyDays={d.everyDays} onChange={(r, days) => setDraft((x) => ({ ...x, repeat: r, everyDays: days }))} />
      <ErrorText error={err} />
      <SaveBar
        onSave={() => void save()}
        onDelete={() => {
          void removeItem(item.id).then(onClose)
        }}
      />
    </Sheet>
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
