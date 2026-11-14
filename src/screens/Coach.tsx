import { useState } from 'react'
import { AddButton, AddedBy, ErrorText, Field, LinkOut, MediaVideo, SaveBar, Screen, Sheet, UploadButton, useDraft } from '../components/ui'
import { formatDate, today } from '../lib/dates'
import { addItem, deleteMedia, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { CoachEntry, Skill } from '../lib/types'

/** Riding classes: a clip or link, Sofía's notes, and the coach's feedback. */
export function Coach() {
  const list = useItems<CoachEntry>('coach')
  const [edit, setEdit] = useState<Item<CoachEntry> | 'new' | null>(null)
  const sorted = [...list].sort((a, b) => b.data.date.localeCompare(a.data.date))
  return (
    <Screen title="Coach" action={<AddButton onClick={() => setEdit('new')} label="Class" />}>
      <p className="muted small">Save each class with a short clip or a link, what you worked on, and the coach’s feedback, so you can watch your progress.</p>
      {sorted.length === 0 && <p className="empty">No classes yet.</p>}
      <ul className="list">
        {sorted.map((c) => (
          <li key={c.id} className="card">
            <div className="row-between tap" onClick={() => setEdit(c)}>
              <strong>{c.data.title || 'Class'}</strong>
              <span className="muted small">{formatDate(c.data.date)}</span>
            </div>
            <MediaVideo path={c.data.clip} />
            {c.data.link && <LinkOut href={c.data.link}>▶︎ Watch video</LinkOut>}
            {c.data.skills?.length ? (
              <div className="chips">
                {c.data.skills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            ) : null}
            {c.data.feedback && (
              <div className="feedback">
                <span className="field-label">Coach feedback</span>
                <p>{c.data.feedback}</p>
              </div>
            )}
            {c.data.notes && (
              <div className="feedback mine">
                <span className="field-label">My notes</span>
                <p>{c.data.notes}</p>
              </div>
            )}
            <AddedBy item={c} />
          </li>
        ))}
      </ul>
      {edit && <CoachSheet item={edit === 'new' ? null : edit} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function CoachSheet({ item, onClose }: { item: Item<CoachEntry> | null; onClose: () => void }) {
  const skills = useItems<Skill>('skill')
  const [d, set] = useDraft<CoachEntry>(item?.data ?? { date: today(), title: '' })
  const [err, setErr] = useState('')
  const [skillQ, setSkillQ] = useState('')
  async function save() {
    if (item) await updateItem(item.id, d)
    else await addItem('coach', d)
    onClose()
  }
  const matches = skillQ ? skills.filter((s) => s.data.name.toLowerCase().includes(skillQ.toLowerCase()) && !d.skills?.includes(s.data.name)).slice(0, 5) : []
  return (
    <Sheet open title={item ? 'Edit class' : 'New class'} onClose={onClose}>
      <Field label="Title">
        <input value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Jumping lesson with Ana" />
      </Field>
      <Field label="Date">
        <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
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
      <Field label="Coach feedback">
        <textarea rows={3} value={d.feedback ?? ''} onChange={(e) => set('feedback', e.target.value)} />
      </Field>
      <Field label="My notes">
        <textarea rows={3} value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="How did it feel? What to try next time?" />
      </Field>
      <ErrorText error={err} />
      <SaveBar
        onSave={() => void save().catch((e) => setErr(String(e)))}
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
