import { useState } from 'react'
import { AddButton, Chips, ErrorText, Field, LinkOut, SaveBar, Screen, Segmented, Sheet, useDraft } from '../components/ui'
import { autoDifficulty, difficultyOf, fitsLength, youtubeSearch } from '../lib/beautify'
import { addItem, removeItem, updateItem, useItems, useSingle, type Item } from '../lib/store'
import type { Difficulty, Hairstyle, Length, Profile } from '../lib/types'

const LENGTHS = ['short', 'medium', 'long'] as const
const DIFFS: Difficulty[] = ['easy', 'medium', 'hard']
const DIFF_ICON = { easy: '🟢', medium: '🟡', hard: '🔴' }

export function Beautify() {
  const profile = useSingle<Profile>('profile')
  const styles = useItems<Hairstyle>('style')
  const [area, setArea] = useState<'mane' | 'tail'>('mane')
  const [theme, setTheme] = useState<string>('all')
  const [open, setOpen] = useState<Item<Hairstyle> | null>(null)
  const [edit, setEdit] = useState<Item<Hairstyle> | 'new' | null>(null)
  const mane = profile?.data.maneLength
  const tail = profile?.data.tailLength
  const themes = [...new Set(styles.map((s) => s.data.theme).filter(Boolean))] as string[]

  function setLength(which: 'maneLength' | 'tailLength', v: Length) {
    if (profile) void updateItem(profile.id, { ...profile.data, [which]: v })
  }

  const shown = styles
    .filter((s) => s.data.area === area || s.data.area === 'both')
    .filter((s) => fitsLength(s.data, mane, tail))
    .filter((s) => (theme === 'all' ? true : theme === 'everyday' ? !s.data.theme : s.data.theme === theme))
  const hidden = styles.filter((s) => (s.data.area === area || s.data.area === 'both') && !fitsLength(s.data, mane, tail)).length

  return (
    <Screen title="Beautify" action={<AddButton onClick={() => setEdit('new')} label="Style" />}>
      <div className="card soft">
        <Field label="EJ’s mane length">
          <Segmented value={mane} options={LENGTHS} onChange={(v) => setLength('maneLength', v)} />
        </Field>
        <Field label="EJ’s tail length">
          <Segmented value={tail} options={LENGTHS} onChange={(v) => setLength('tailLength', v)} />
        </Field>
        {!mane && <p className="hint">Pick the lengths to see only the styles that work for EJ.</p>}
      </div>
      <Segmented value={area} options={['mane', 'tail'] as const} labels={{ mane: 'Mane', tail: 'Tail' }} onChange={setArea} />
      {themes.length > 0 && <Chips value={theme} options={['everyday', ...themes]} onChange={setTheme} all="All looks" />}
      {DIFFS.map((d) => {
        const group = shown.filter((s) => difficultyOf(s.data) === d)
        if (!group.length) return null
        return (
          <section key={d}>
            <h3 className="section-title">
              {DIFF_ICON[d]} {d[0].toUpperCase() + d.slice(1)}
            </h3>
            <ul className="list">
              {group.map((s) => (
                <li key={s.id} className="card tap" onClick={() => setOpen(s)}>
                  <div className="row-between">
                    <strong>
                      {s.data.favorite && '⭐ '}
                      {s.data.name}
                    </strong>
                    {s.data.theme && <span className="tag">{s.data.theme}</span>}
                  </div>
                  <p className="muted small">
                    {s.data.lengths.join(' / ')} {s.data.area} · {s.data.steps.split('\n').filter(Boolean).length} steps
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {shown.length === 0 && <p className="empty">No styles for this length yet. Add one with “+ Style”.</p>}
      {hidden > 0 && <p className="muted small">{hidden} more styles need a different length.</p>}
      {open && (
        <StyleView
          item={open}
          onClose={() => setOpen(null)}
          onEdit={() => {
            setEdit(open)
            setOpen(null)
          }}
        />
      )}
      {edit && <StyleSheet item={edit === 'new' ? null : edit} defaultArea={area} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function StyleView({ item, onClose, onEdit }: { item: Item<Hairstyle>; onClose: () => void; onEdit: () => void }) {
  const s = item.data
  const steps = s.steps.split('\n').filter((l) => l.trim())
  const [done, setDone] = useState<number[]>([])
  return (
    <Sheet open title={s.name} onClose={onClose}>
      <p className="muted small">
        {DIFF_ICON[difficultyOf(s)]} {difficultyOf(s)} · {s.lengths.join(' / ')} {s.area}
        {s.theme && ` · ${s.theme}`}
      </p>
      <ol className="steps">
        {steps.map((st, i) => (
          <li key={i} className={done.includes(i) ? 'done' : ''} onClick={() => setDone((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))}>
            {st}
          </li>
        ))}
      </ol>
      <p className="hint">Tap a step to tick it off while you braid.</p>
      <div className="quick-row">
        <LinkOut href={s.video || youtubeSearch(`horse ${s.name} tutorial`)}>▶︎ Watch how on YouTube</LinkOut>
        <button className="btn ghost small" onClick={() => void updateItem(item.id, { ...s, favorite: !s.favorite })}>
          {s.favorite ? '★ Favourite' : '☆ Favourite'}
        </button>
        <button className="btn ghost small" onClick={onEdit}>
          Edit
        </button>
      </div>
    </Sheet>
  )
}

function StyleSheet({ item, defaultArea, onClose }: { item: Item<Hairstyle> | null; defaultArea: 'mane' | 'tail'; onClose: () => void }) {
  const [d, set] = useDraft<Hairstyle>(item?.data ?? { name: '', area: defaultArea, lengths: ['medium'], difficulty: 'auto', steps: '' })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.name.trim()) return setErr('Add a name.')
    if (!d.lengths.length) return setErr('Pick at least one length.')
    if (item) await updateItem(item.id, d)
    else await addItem('style', d)
    onClose()
  }
  return (
    <Sheet open title={item ? 'Edit style' : 'New style'} onClose={onClose}>
      <Field label="Name">
        <input value={d.name} onChange={(e) => set('name', e.target.value)} />
      </Field>
      <Field label="For">
        <Segmented value={d.area} options={['mane', 'tail', 'both'] as const} onChange={(v) => set('area', v)} />
      </Field>
      <Field label="Works with length">
        <div className="chips">
          {LENGTHS.map((l) => (
            <button
              type="button"
              key={l}
              className={d.lengths.includes(l) ? 'chip on' : 'chip'}
              onClick={() => set('lengths', d.lengths.includes(l) ? d.lengths.filter((x) => x !== l) : [...d.lengths, l])}
            >
              {l}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Steps (one per line)">
        <textarea rows={6} value={d.steps} onChange={(e) => set('steps', e.target.value)} />
      </Field>
      <Field label="Difficulty" hint={d.difficulty === 'auto' ? `Auto: ${autoDifficulty(d.steps)} (based on the number of steps)` : undefined}>
        <Segmented value={d.difficulty} options={['auto', 'easy', 'medium', 'hard'] as const} onChange={(v) => set('difficulty', v)} />
      </Field>
      <Field label="Theme (optional)">
        <input value={d.theme ?? ''} onChange={(e) => set('theme', e.target.value || undefined)} placeholder="e.g. Halloween, Show day" />
      </Field>
      <Field label="Video link (optional)" hint="Leave empty to search YouTube by name.">
        <input type="url" value={d.video ?? ''} onChange={(e) => set('video', e.target.value || undefined)} placeholder="https://youtube.com/…" />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={save} onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined} />
    </Sheet>
  )
}
