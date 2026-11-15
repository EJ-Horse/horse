import { useState } from 'react'
import { ErrorText, Field, LinkOut, SaveBar, Segmented, Sheet, useDraft } from './ui'
import { formatDate, parseDate, today } from '../lib/dates'
import { closuresSoon, countdown, upcoming } from '../lib/events'
import { downloadIcs } from '../lib/ics'
import { timeLabel } from '../lib/rides'
import { removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { HorseEvent } from '../lib/types'

const KIND_ICON = { show: '🏆', clinic: '🎓', vet: '🩺', other: '📅', closed: '🚫' }

function dayLabel(date: string) {
  return parseDate(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

/** Shows the next upcoming event on Home; renders nothing when there isn't one. */
export function NextEvent() {
  const all = useItems<HorseEvent>('event')
  const events = upcoming(all.filter((e) => e.data.kind !== 'closed'), today())
  const closures = closuresSoon(all, today())
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Item<HorseEvent> | null>(null)
  const next = events[0]
  if (!next && !closures.length) return null
  const e = next?.data
  const more = events.length - 1
  return (
    <div className="card event-card">
      {next && e && (
        <>
          <button className="event-head" onClick={() => setOpen(!open)} aria-expanded={open}>
            <span className="event-icon" aria-hidden>
              {KIND_ICON[e.kind ?? 'other']}
            </span>
            <span className="event-main">
              <span className="muted small">Next event</span>
              <strong>{e.title}</strong>
              <span className="small">
                {dayLabel(e.date)}
                {e.endDate && e.endDate !== e.date && `–${dayLabel(e.endDate)}`}
                {e.time && ` · ${timeLabel(e.time)}`} · <span className="event-when">{countdown(e, today())}</span>
              </span>
            </span>
            <span className="muted" aria-hidden>
              {open ? '−' : '+'}
            </span>
          </button>
          {open && (
            <div className="event-body">
              {e.location && (
                <p className="small">
                  📍{' '}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(e.location)}`} target="_blank" rel="noreferrer">
                    {e.location}
                  </a>
                </p>
              )}
              {e.notes && <p className="small pre">{e.notes}</p>}
              <div className="quick-row">
                <button
                  className="btn small secondary"
                  onClick={() => downloadIcs(`EJ: ${e.title}`, e.date, [e.time && timeLabel(e.time), e.location, e.notes].filter(Boolean).join('\n'))}
                >
                  📅 Add to calendar
                </button>
                {e.link && <LinkOut href={e.link}>Details ↗</LinkOut>}
                <button className="btn ghost small" onClick={() => setEdit(next)}>
                  Edit
                </button>
              </div>
              {more > 0 && (
                <ul className="list compact">
                  {events.slice(1, 4).map((x) => (
                    <li key={x.id} className="tap" onClick={() => setEdit(x)}>
                      {KIND_ICON[x.data.kind ?? 'other']} {x.data.title} <span className="muted">· {formatDate(x.data.date)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
      {closures.length > 0 && (
        <ul className={'closure-notes' + (next ? ' with-event' : '')}>
          {closures.map((c) => (
            <li key={c.id} className="tap" onClick={() => setEdit(c)}>
              <span aria-hidden>🚫</span>
              <span>
                <strong>Barn closed</strong> {dayLabel(c.data.date)}
                {c.data.endDate && c.data.endDate !== c.data.date && ` – ${dayLabel(c.data.endDate)}`}
                <span className="muted"> · {c.data.title}</span>
                {c.data.notes && <span className="muted small"> · {c.data.notes}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {edit && <EventSheet item={edit} onClose={() => setEdit(null)} />}
    </div>
  )
}

function EventSheet({ item, onClose }: { item: Item<HorseEvent>; onClose: () => void }) {
  const [d, set] = useDraft<HorseEvent>(item.data)
  const [err, setErr] = useState('')
  async function save() {
    if (!d.title.trim()) return setErr('Add a name.')
    try {
      await updateItem(item.id, d)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="Event" onClose={onClose}>
      <Field label="Name">
        <input value={d.title} onChange={(e) => set('title', e.target.value)} />
      </Field>
      <Field label="Type">
        <Segmented value={d.kind ?? 'other'} options={['show', 'clinic', 'vet', 'closed', 'other'] as const} onChange={(v) => set('kind', v)} />
      </Field>
      <div className="two-col">
        <Field label="Date">
          <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Time">
          <input type="time" value={d.time ?? ''} onChange={(e) => set('time', e.target.value || undefined)} />
        </Field>
      </div>
      <Field label="Last day (if more than one day)">
        <input type="date" value={d.endDate ?? ''} onChange={(e) => set('endDate', e.target.value || undefined)} />
      </Field>
      <Field label="Where">
        <input value={d.location ?? ''} onChange={(e) => set('location', e.target.value || undefined)} />
      </Field>
      <Field label="Notes">
        <textarea rows={3} value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
      <Field label="Link">
        <input type="url" value={d.link ?? ''} onChange={(e) => set('link', e.target.value || undefined)} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} onDelete={() => void removeItem(item.id).then(onClose)} />
    </Sheet>
  )
}
