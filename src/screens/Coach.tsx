import { useState } from 'react'
import { AddButton, AddedBy, ErrorText, Field, LinkOut, MediaVideo, SaveBar, Screen, Segmented, Sheet, UploadButton, useDraft } from '../components/ui'
import { parseDate, today } from '../lib/dates'
import { DAY_NAMES, DEFAULT_SCHEDULE, rideType, timeLabel, weekSlots } from '../lib/rides'
import { addItem, deleteMedia, removeItem, updateItem, useItems, useSingle, type Item } from '../lib/store'
import { closedOn } from '../lib/events'
import { ACTIVITIES, type HorseEvent, type CoachEntry, type Feel, type RideSchedule, type RideSlot, type RideType, type Skill } from '../lib/types'

const FEEL_LABEL: Record<Feel, string> = { great: '😊 Great', ok: '🙂 OK', tough: '😕 Tough' }
const TYPE_LABEL: Record<RideType, string> = { lesson: '👩‍🏫 Lesson', solo: '🐴 Solo ride' }

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

function shortDay(date: string) {
  return parseDate(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

/** Lessons with the teacher and solo rides, driven by Sofía's weekly schedule. */
export function Coach() {
  const list = useItems<CoachEntry>('coach')
  const scheduleItem = useSingle<RideSchedule>('rideSchedule')
  const slots = scheduleItem?.data.slots ?? DEFAULT_SCHEDULE
  const [edit, setEdit] = useState<Item<CoachEntry> | { preset: Partial<CoachEntry> } | null>(null)
  const [editingSchedule, setEditingSchedule] = useState(false)
  const sorted = [...list].sort((a, b) => b.data.date.localeCompare(a.data.date) || (b.data.time ?? '').localeCompare(a.data.time ?? ''))
  const events = useItems<HorseEvent>('event')
  const week = weekSlots(
    slots,
    list.map((x) => x.data),
    today(),
    (d) => closedOn(events, d),
  )
  const lessons = list.filter((x) => rideType(x.data) === 'lesson').length
  const solos = list.length - lessons

  return (
    <Screen title="Rides" action={<AddButton onClick={() => setEdit({ preset: {} })} label="Ride" />}>
      <div className="card">
        <div className="row-between">
          <strong>This week</strong>
          <button className="link small" onClick={() => setEditingSchedule(true)}>
            Edit schedule
          </button>
        </div>
        <ul className="week-rides">
          {week.map((s) => (
            <li key={`${s.day}-${s.time}-${s.type}`} className={'week-ride is-' + s.state}>
              <span className="week-ride-when">
                <strong>{shortDay(s.date)}</strong>
                <span className="muted small">
                  {timeLabel(s.time)} · {s.type === 'lesson' ? 'Lesson' : 'Solo ride'}
                </span>
              </span>
              {s.state === 'logged' ? (
                <button className="chip on" onClick={() => setEdit(list[s.entryIndex!])}>
                  ✓ Logged
                </button>
              ) : s.state === 'due' ? (
                <button
                  className="btn small"
                  onClick={() =>
                    setEdit({ preset: { date: s.date, time: s.time, type: s.type, title: s.type === 'lesson' ? 'Lesson' : 'Solo ride' } })
                  }
                >
                  Log it
                </button>
              ) : s.state === 'closed' ? (
                <span className="muted small">🚫 Barn closed</span>
              ) : (
                <span className="muted small">Upcoming</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {list.length > 0 && (
        <p className="muted small">
          {plural(list.length, 'ride')} logged · {plural(lessons, 'lesson')} · {solos} solo
        </p>
      )}
      {sorted.length === 0 && <p className="empty">No rides logged yet. Tap “Log it” after each ride.</p>}
      <ul className="list">
        {sorted.map((c) => (
          <li key={c.id} className="card tap" onClick={() => setEdit(c)}>
            <div className="row-between">
              <strong>
                {rideType(c.data) === 'lesson' ? '👩‍🏫' : '🐴'} {c.data.title || (rideType(c.data) === 'lesson' ? 'Lesson' : 'Solo ride')}
              </strong>
              <span className="muted small">
                {shortDay(c.data.date)}
                {c.data.time && ` · ${timeLabel(c.data.time)}`}
              </span>
            </div>
            {(c.data.activities?.length || c.data.feel) && (
              <div className="chips">
                {c.data.feel && <span className={'tag feel-' + c.data.feel}>{FEEL_LABEL[c.data.feel]}</span>}
                {c.data.activities?.map((a) => (
                  <span key={a} className="tag">
                    {a}
                  </span>
                ))}
              </div>
            )}
            {c.data.notes && <p className="small pre">{c.data.notes}</p>}
            {c.data.feedback && (
              <div className="feedback">
                <span className="field-label">Teacher’s feedback</span>
                <p>{c.data.feedback}</p>
              </div>
            )}
            {c.data.skills?.length ? <p className="muted small">Skills: {c.data.skills.join(', ')}</p> : null}
            <div onClick={(e) => e.stopPropagation()}>
              <MediaVideo path={c.data.clip} />
              {c.data.link && <LinkOut href={c.data.link}>▶︎ Watch video</LinkOut>}
            </div>
            <AddedBy item={c} />
          </li>
        ))}
      </ul>
      {edit && <RideSheet item={'id' in edit ? edit : null} preset={'preset' in edit ? edit.preset : {}} onClose={() => setEdit(null)} />}
      {editingSchedule && <ScheduleSheet item={scheduleItem} slots={slots} onClose={() => setEditingSchedule(false)} />}
    </Screen>
  )
}

function RideSheet({ item, preset, onClose }: { item: Item<CoachEntry> | null; preset: Partial<CoachEntry>; onClose: () => void }) {
  const skills = useItems<Skill>('skill')
  const [d, set, setDraft] = useDraft<CoachEntry>(item?.data ?? { date: today(), title: 'Lesson', type: 'lesson', ...preset })
  const [err, setErr] = useState('')
  const [skillQ, setSkillQ] = useState('')
  const [more, setMore] = useState(!!(item?.data.clip || item?.data.link || item?.data.skills?.length))
  const type = rideType(d)

  async function save() {
    try {
      if (item) await updateItem(item.id, d)
      else await addItem('coach', d)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  const toggleActivity = (a: string) =>
    setDraft((x) => ({ ...x, activities: x.activities?.includes(a) ? x.activities.filter((y) => y !== a) : [...(x.activities ?? []), a] }))
  const matches = skillQ ? skills.filter((s) => s.data.name.toLowerCase().includes(skillQ.toLowerCase()) && !d.skills?.includes(s.data.name)).slice(0, 5) : []

  return (
    <Sheet open title={item ? 'Ride' : type === 'lesson' ? 'Log a lesson' : 'Log a solo ride'} onClose={onClose}>
      <Field label="Type">
        <Segmented
          value={type}
          options={['lesson', 'solo'] as const}
          labels={TYPE_LABEL}
          onChange={(v) => {
            set('type', v)
            if (!d.title || d.title === 'Lesson' || d.title === 'Solo ride') set('title', v === 'lesson' ? 'Lesson' : 'Solo ride')
          }}
        />
      </Field>
      <div className="two-col">
        <Field label="Date">
          <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="Time">
          <input type="time" value={d.time ?? ''} onChange={(e) => set('time', e.target.value || undefined)} />
        </Field>
      </div>
      <Field label="What did you do?">
        <div className="chips">
          {ACTIVITIES.map((a) => (
            <button key={a} type="button" className={d.activities?.includes(a) ? 'chip on' : 'chip'} onClick={() => toggleActivity(a)}>
              {a}
            </button>
          ))}
        </div>
      </Field>
      <Field label="How did it go?">
        <Segmented value={d.feel} options={['great', 'ok', 'tough'] as const} labels={FEEL_LABEL} onChange={(v) => set('feel', v === d.feel ? undefined : v)} />
      </Field>
      <Field label="Notes">
        <textarea
          rows={3}
          value={d.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Anything that happened? e.g. EJ spooked at the tarp, great canter on the left lead"
        />
      </Field>
      {type === 'lesson' && (
        <Field label="Teacher’s feedback">
          <textarea rows={2} value={d.feedback ?? ''} onChange={(e) => set('feedback', e.target.value)} placeholder="What to work on next time" />
        </Field>
      )}

      {!more ? (
        <button type="button" className="link small" onClick={() => setMore(true)}>
          + Add a video or skills worked on
        </button>
      ) : (
        <>
          <Field label="Video clip">
            {d.clip ? (
              <>
                <MediaVideo path={d.clip} />
                <button type="button" className="btn ghost small" onClick={() => set('clip', undefined)}>
                  Remove clip
                </button>
              </>
            ) : (
              <UploadButton folder="clips" accept="video/*" label="🎥 Add clip" onUploaded={([p]) => set('clip', p)} />
            )}
          </Field>
          <Field label="…or a link (YouTube, Google Drive)">
            <input type="url" value={d.link ?? ''} onChange={(e) => set('link', e.target.value || undefined)} placeholder="https://" />
          </Field>
          <Field label="Skills worked on">
            <div className="chips">
              {d.skills?.map((s) => (
                <button type="button" key={s} className="chip on" onClick={() => set('skills', d.skills!.filter((x) => x !== s))}>
                  {s} ×
                </button>
              ))}
            </div>
            <input value={skillQ} onChange={(e) => setSkillQ(e.target.value)} placeholder="Type to add a skill" />
            {matches.map((m) => (
              <button
                type="button"
                key={m.id}
                className="suggest"
                onClick={() => {
                  set('skills', [...(d.skills ?? []), m.data.name])
                  setSkillQ('')
                }}
              >
                + {m.data.name}
              </button>
            ))}
          </Field>
        </>
      )}
      <ErrorText error={err} />
      <SaveBar
        onSave={() => void save()}
        onDelete={
          item
            ? () => {
                void deleteMedia([item.data.clip])
                void removeItem(item.id).then(onClose)
              }
            : undefined
        }
      />
    </Sheet>
  )
}

function ScheduleSheet({ item, slots, onClose }: { item: Item<RideSchedule> | undefined; slots: RideSlot[]; onClose: () => void }) {
  const [rows, setRows] = useState<RideSlot[]>(slots)
  const [err, setErr] = useState('')
  const update = (i: number, patch: Partial<RideSlot>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  async function save() {
    try {
      const data = { slots: rows.filter((r) => r.time) }
      if (item) await updateItem(item.id, data)
      else await addItem('rideSchedule', data)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="Weekly schedule" onClose={onClose}>
      <p className="muted small">The rides Sofía usually does each week. They show up under “This week” so they’re quick to log.</p>
      <ul className="schedule-rows">
        {rows.map((r, i) => (
          <li key={i}>
            <select value={r.day} onChange={(e) => update(i, { day: Number(e.target.value) })} aria-label="Day">
              {DAY_NAMES.map((n, d) => (
                <option key={n} value={d}>
                  {n}
                </option>
              ))}
            </select>
            <input type="time" value={r.time} onChange={(e) => update(i, { time: e.target.value })} aria-label="Time" />
            <select value={r.type} onChange={(e) => update(i, { type: e.target.value as RideType })} aria-label="Type">
              <option value="lesson">Lesson</option>
              <option value="solo">Solo</option>
            </select>
            <button type="button" className="icon-btn small" aria-label="Remove" onClick={() => setRows((x) => x.filter((_, j) => j !== i))}>
              ×
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className="btn secondary small" onClick={() => setRows((r) => [...r, { day: 0, time: '16:00', type: 'lesson' }])}>
        + Add a ride
      </button>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} />
    </Sheet>
  )
}

