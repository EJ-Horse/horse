import { useState } from 'react'
import { AddButton, ErrorText, Field, LinkOut, SaveBar, Screen, Segmented, Sheet, useDraft } from '../components/ui'
import { formatDate, today } from '../lib/dates'
import { addItem, removeItem, updateItem, useItems, type Item } from '../lib/store'
import { LEVEL_ICON, TRICK_BASICS, TRICKS, type Trick } from '../lib/tricks'
import type { TrickProgress, TrickStatus } from '../lib/types'

type Row = Trick & { video?: string; progress?: Item<TrickProgress> }
const STATUS_LABEL: Record<TrickStatus, string> = { 'not started': '⚪ Not started', learning: '📚 Learning', 'got it': '🌟 Got it' }
const LEVELS = ['easy', 'medium', 'hard'] as const

/** Rider → Tricks: teach EJ tricks with treats, step by step. */
export function Tricks() {
  const progress = useItems<TrickProgress>('trick')
  const [open, setOpen] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [showBasics, setShowBasics] = useState(false)
  const byKey = new Map(progress.map((p) => [p.data.key, p]))
  const custom: Row[] = progress
    .filter((p) => p.data.custom)
    .map((p) => ({ key: p.data.key, name: p.data.custom!.name, emoji: '✨', level: p.data.custom!.level, what: p.data.custom!.what, steps: p.data.custom!.steps.split('\n').filter((l) => l.trim()), progress: p }))
  const rows: Row[] = [...TRICKS.map((t) => ({ ...t, progress: byKey.get(t.key) })), ...custom]
  const statusOf = (r: Row): TrickStatus => r.progress?.data.status ?? 'not started'
  const learned = rows.filter((r) => statusOf(r) === 'got it').length
  const nameOf = (k: string) => rows.find((r) => r.key === k)?.name ?? k
  const current = open ? rows.find((r) => r.key === open) : undefined

  return (
    <Screen title="Tricks" action={<AddButton onClick={() => setAdding(true)} label="Trick" />}>
      <div className="card soft">
        <div className="row-between">
          <strong>
            🌟 {learned} of {rows.length} learned
          </strong>
          <button className="link small" onClick={() => setShowBasics(!showBasics)}>
            {showBasics ? 'Hide' : 'How to teach'}
          </button>
        </div>
        <span className="progress-track">
          <span className="progress-seg excellent" style={{ flex: learned }} />
          <span className="progress-seg needs-work" style={{ flex: rows.filter((r) => statusOf(r) === 'learning').length }} />
          <span className="progress-seg none" style={{ flex: rows.filter((r) => statusOf(r) === 'not started').length }} />
        </span>
        {showBasics && (
          <ul className="bullets">
            {TRICK_BASICS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>

      {LEVELS.map((lvl) => {
        const group = rows.filter((r) => r.level === lvl)
        if (!group.length) return null
        return (
          <section key={lvl}>
            <h3 className="section-title">
              {LEVEL_ICON[lvl]} {lvl}
            </h3>
            <ul className="list">
              {group.map((r) => {
                const st = statusOf(r)
                const locked = (r.needs ?? []).filter((k) => (byKey.get(k)?.data.status ?? 'not started') !== 'got it')
                return (
                  <li key={r.key} className={'card tap trick-row' + (st === 'got it' ? ' done' : '')} onClick={() => setOpen(r.key)}>
                    <span className="trick-emoji" aria-hidden>
                      {r.emoji}
                    </span>
                    <span className="trick-info">
                      <strong>{r.name}</strong>
                      <span className="muted small">
                        {STATUS_LABEL[st]}
                        {r.progress?.data.sessions ? ` · ${r.progress.data.sessions} sessions` : ''}
                      </span>
                      {st === 'not started' && locked.length > 0 && <span className="hint">Learn first: {locked.map(nameOf).join(', ')}</span>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {current && <TrickSheet row={current} nameOf={nameOf} onClose={() => setOpen(null)} />}
      {adding && <NewTrickSheet onClose={() => setAdding(false)} />}
    </Screen>
  )
}

function TrickSheet({ row, nameOf, onClose }: { row: Row; nameOf: (k: string) => string; onClose: () => void }) {
  const p = row.progress?.data
  const status: TrickStatus = p?.status ?? 'not started'
  const [notes, setNotes] = useState(p?.notes ?? '')
  const [done, setDone] = useState<number[]>([])

  async function save(patch: Partial<TrickProgress>) {
    const base: TrickProgress = p ?? { key: row.key, status: 'not started' }
    const next = { ...base, ...patch }
    if (row.progress) await updateItem(row.progress.id, next)
    else await addItem('trick', next)
  }

  return (
    <Sheet open title={`${row.emoji} ${row.name}`} onClose={onClose}>
      <p className="muted small">
        {LEVEL_ICON[row.level]} {row.level}
        {row.needs?.length ? ` · learn first: ${row.needs.map(nameOf).join(', ')}` : ''}
      </p>
      <p className="skill-about">{row.what}</p>
      {row.safety && <p className="vet-warn">⚠️ {row.safety}</p>}
      <span className="field-label">Steps</span>
      <ol className="steps">
        {row.steps.map((s, i) => (
          <li key={i} className={done.includes(i) ? 'done' : ''} onClick={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}>
            {s}
          </li>
        ))}
      </ol>
      <Field label="Progress">
        <Segmented value={status} options={['not started', 'learning', 'got it'] as const} labels={STATUS_LABEL} onChange={(v) => void save({ status: v })} />
      </Field>
      <div className="quick-row">
        <button
          className="btn small"
          onClick={() => void save({ sessions: (p?.sessions ?? 0) + 1, lastPracticed: today(), status: status === 'not started' ? 'learning' : status })}
        >
          ✓ Practiced today
        </button>
        <span className="muted small">
          {p?.sessions ? `${p.sessions} sessions` : 'No sessions yet'}
          {p?.lastPracticed ? ` · last ${formatDate(p.lastPracticed)}` : ''}
        </span>
      </div>
      <Field label="Notes">
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (p?.notes ?? '') && void save({ notes: notes || undefined })} placeholder="How did it go?" />
      </Field>
      <div className="quick-row">
        <LinkOut href={row.video ?? 'https://www.youtube.com/results?search_query=' + encodeURIComponent(`teach horse ${row.name} trick`)}>▶︎ Watch how</LinkOut>
        {p?.custom && row.progress && (
          <button
            className="btn ghost small danger"
            onClick={() => {
              if (confirm('Delete this trick?')) void removeItem(row.progress!.id).then(onClose)
            }}
          >
            Delete trick
          </button>
        )}
      </div>
    </Sheet>
  )
}

function NewTrickSheet({ onClose }: { onClose: () => void }) {
  const [d, set] = useDraft({ name: '', level: 'easy' as 'easy' | 'medium' | 'hard', what: '', steps: '' })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.name.trim()) return setErr('Name the trick.')
    try {
      await addItem<TrickProgress>('trick', { key: 'custom-' + crypto.randomUUID(), status: 'not started', custom: { ...d, name: d.name.trim() } })
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="New trick" onClose={onClose}>
      <Field label="Trick">
        <input autoFocus value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Spin in a circle" />
      </Field>
      <Field label="Level">
        <Segmented value={d.level} options={['easy', 'medium', 'hard'] as const} onChange={(v) => set('level', v)} />
      </Field>
      <Field label="What it is">
        <textarea rows={2} value={d.what} onChange={(e) => set('what', e.target.value)} />
      </Field>
      <Field label="Steps (one per line)">
        <textarea rows={4} value={d.steps} onChange={(e) => set('steps', e.target.value)} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} />
    </Sheet>
  )
}
