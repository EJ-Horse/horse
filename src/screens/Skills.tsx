import { useState } from 'react'
import { AddButton, Chips, ErrorText, Field, LinkOut, SaveBar, Screen, Segmented, Sheet, useDraft } from '../components/ui'
import { youtubeSearch } from '../lib/beautify'
import { formatDate, today } from '../lib/dates'
import { addItem, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { Discipline, Level, Rating, Skill } from '../lib/types'

export const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced']
const DISCIPLINES = ['dressage', 'jumping'] as const
const RATINGS: Rating[] = ['needs work', 'good', 'excellent']
const RATING_ICON: Record<Rating, string> = { 'needs work': '🔸', good: '👍', excellent: '🌟' }

function cap(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

function useDiscipline() {
  const [disc, setDisc] = useState<Discipline>(() => (localStorage.getItem('ej-disc') as Discipline) || 'dressage')
  return [
    disc,
    (d: Discipline) => {
      setDisc(d)
      try {
        localStorage.setItem('ej-disc', d)
      } catch {
        /* ignore */
      }
    },
  ] as const
}

/** Skills: what Sofía can do, rated needs work / good / excellent. */
export function Skills() {
  const skills = useItems<Skill>('skill')
  const [disc, setDisc] = useDiscipline()
  const [edit, setEdit] = useState<Item<Skill> | 'new' | null>(null)
  const mine = skills.filter((s) => s.data.discipline === disc)
  const rated = mine.filter((s) => s.data.rating)
  const excellent = mine.filter((s) => s.data.rating === 'excellent').length
  return (
    <Screen title="Skills" action={<AddButton onClick={() => setEdit('new')} label="Skill" />}>
      <Segmented value={disc} options={DISCIPLINES} labels={{ dressage: 'Dressage', jumping: 'Jumping' }} onChange={setDisc} />
      <div className="progress-card card soft">
        <span>
          {rated.length}/{mine.length} rated · {excellent} excellent
        </span>
        <span className="progress-track">
          {RATINGS.map((r) => (
            <span key={r} className={'progress-seg ' + r.replace(' ', '-')} style={{ flex: mine.filter((s) => s.data.rating === r).length }} />
          ))}
          <span className="progress-seg none" style={{ flex: mine.length - rated.length }} />
        </span>
      </div>
      {LEVELS.map((lvl) => {
        const group = mine.filter((s) => s.data.level === lvl)
        if (!group.length) return null
        return (
          <section key={lvl}>
            <h3 className="section-title">{cap(lvl)}</h3>
            <ul className="list">
              {group.map((s) => (
                <li key={s.id} className="card">
                  <div className="row-between tap" onClick={() => setEdit(s)}>
                    <strong>{s.data.name}</strong>
                    {s.data.ratedOn && <span className="muted small">{formatDate(s.data.ratedOn)}</span>}
                  </div>
                  <div className="rating-row" role="radiogroup" aria-label={`Rate ${s.data.name}`}>
                    {RATINGS.map((r) => (
                      <button
                        key={r}
                        role="radio"
                        aria-checked={s.data.rating === r}
                        className={'rating ' + r.replace(' ', '-') + (s.data.rating === r ? ' on' : '')}
                        onClick={() => void updateItem(s.id, { ...s.data, rating: s.data.rating === r ? undefined : r, ratedOn: today() })}
                      >
                        {RATING_ICON[r]} {r}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {edit && <SkillSheet item={edit === 'new' ? null : edit} discipline={disc} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

/** Tips: cues for each skill plus a video button. */
export function Tips() {
  const skills = useItems<Skill>('skill')
  const [disc, setDisc] = useDiscipline()
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState<Item<Skill> | null>(null)
  const shown = skills
    .filter((s) => s.data.discipline === disc)
    .filter((s) => level === 'all' || s.data.level === level)
    .filter((s) => !q || (s.data.name + ' ' + (s.data.cues ?? '')).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => LEVELS.indexOf(a.data.level) - LEVELS.indexOf(b.data.level))
  return (
    <Screen title="Tips">
      <Segmented value={disc} options={DISCIPLINES} labels={{ dressage: 'Dressage', jumping: 'Jumping' }} onChange={setDisc} />
      <input className="search" placeholder="Search tips" value={q} onChange={(e) => setQ(e.target.value)} />
      <Chips value={level} options={LEVELS} onChange={setLevel} all="All levels" />
      <ul className="list">
        {shown.map((s) => (
          <li key={s.id} className="card">
            <div className="row-between">
              <strong>{s.data.name}</strong>
              <span className="tag">{s.data.level}</span>
            </div>
            {s.data.cues ? (
              <ul className="bullets">
                {s.data.cues
                  .split('\n')
                  .filter((l) => l.trim())
                  .map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
              </ul>
            ) : (
              <p className="muted small">No cues yet.</p>
            )}
            <div className="quick-row">
              <LinkOut href={s.data.video || youtubeSearch(`${s.data.discipline} ${s.data.name} riding lesson`)}>▶︎ Watch video</LinkOut>
              <button className="btn ghost small" onClick={() => setEdit(s)}>
                Edit cues
              </button>
            </div>
          </li>
        ))}
      </ul>
      {edit && <SkillSheet item={edit} discipline={disc} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function SkillSheet({ item, discipline, onClose }: { item: Item<Skill> | null; discipline: Discipline; onClose: () => void }) {
  const [d, set] = useDraft<Skill>(item?.data ?? { name: '', level: 'beginner', discipline })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.name.trim()) return setErr('Add a name.')
    if (item) await updateItem(item.id, d)
    else await addItem('skill', d)
    onClose()
  }
  return (
    <Sheet open title={item ? d.name : 'New skill'} onClose={onClose}>
      <Field label="Skill">
        <input value={d.name} onChange={(e) => set('name', e.target.value)} />
      </Field>
      <Field label="Discipline">
        <Segmented value={d.discipline} options={DISCIPLINES} onChange={(v) => set('discipline', v)} />
      </Field>
      <Field label="Level">
        <Segmented value={d.level} options={LEVELS} onChange={(v) => set('level', v)} />
      </Field>
      <Field label="Cues & tips (one per line)">
        <textarea rows={5} value={d.cues ?? ''} onChange={(e) => set('cues', e.target.value)} />
      </Field>
      <Field label="Video link" hint="A YouTube link. Leave empty to search YouTube by name.">
        <input type="url" value={d.video ?? ''} onChange={(e) => set('video', e.target.value || undefined)} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={save} onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined} />
    </Sheet>
  )
}
