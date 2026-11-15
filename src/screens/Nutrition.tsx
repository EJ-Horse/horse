import { useState } from 'react'
import { AddButton, Chips, ErrorText, Field, SaveBar, Screen, Segmented, Sheet, useDraft } from '../components/ui'
import { addItem, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { Food } from '../lib/types'
import { FOOD_GUIDE, lookupFood, sameFood, type GuideFood } from '../lib/foodGuide'
import { PsychoArt, psychoLine, quipFor } from '../components/Psycho'

const STATUS = ['allowed', 'limit', 'forbidden'] as const
const STATUS_LABEL = { allowed: '✅ OK', limit: '⚖️ Limit', forbidden: '⛔ Never' }
const LIKING = ['loves', 'likes', 'meh', 'dislikes'] as const
const LIKING_ICON = { loves: '😍', likes: '🙂', meh: '😐', dislikes: '🙅' }

type Entry = { key: string; name: string; status: Food['status']; limit?: string; notes?: string; aliases?: string[]; item?: Item<Food>; guide?: GuideFood }

const VERDICT = {
  allowed: { icon: '✅', title: 'YES', sub: 'EJ can eat this.' },
  limit: { icon: '⚖️', title: 'YES, in small amounts', sub: 'Fine as a treat, within the limit.' },
  forbidden: { icon: '⛔', title: 'NO', sub: 'Don’t give this to EJ.' },
}

export function Nutrition() {
  const foods = useItems<Food>('food')
  const [filter, setFilter] = useState<Food['status'] | 'all'>('all')
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState<Item<Food> | { preset: Food } | null>(null)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  // EJ's own list first (it may have custom limits and likes), then the rest of the guide.
  const mine: Entry[] = foods.map((f) => {
    const guide = FOOD_GUIDE.find((g) => sameFood(g.name, f.data.name))
    return { key: f.id, ...f.data, aliases: guide?.aliases, item: f, guide }
  })
  const rest: Entry[] = FOOD_GUIDE.filter((g) => !foods.some((f) => sameFood(f.data.name, g.name))).map((g) => ({ key: 'g:' + g.name, ...g, guide: g }))
  const all = [...mine, ...rest]
  const byStatus = (e: Entry) => filter === 'all' || e.status === filter
  const sortFn = (a: Entry, b: Entry) => STATUS.indexOf(a.status) - STATUS.indexOf(b.status) || a.name.localeCompare(b.name)
  const favorites = foods.filter((f) => f.data.liking === 'loves')

  const look = lookupFood(q, all)
  const quip = q.trim() ? quipFor(q) : null
  // obvious non-food words ("fingers", "rainbow", "lego") get the psycho card unless it's an exact food name
  const mode: 'answer' | 'maybe' | 'psycho' = !q.trim() ? 'answer' : quip && look.topScore < 100 ? 'psycho' : look.kind === 'answer' ? 'answer' : look.kind === 'maybe' ? 'maybe' : 'psycho'
  const results = look.matches
  const answer = mode === 'answer' ? look.top : undefined

  const open = (e: Entry) => setEdit(e.item ?? { preset: { name: e.name, status: e.status, limit: e.limit, notes: e.notes } })

  return (
    <Screen title="Nutrition" action={<AddButton onClick={() => setEdit({ preset: { name: q, status: 'allowed' } })} label="Food" />}>
      <div className="food-search">
        <input
          className="search big"
          placeholder="🔎 Can EJ eat…? (e.g. grapes)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          enterKeyHint="search"
          autoCapitalize="none"
        />
        {q && (
          <button className="icon-btn small clear-search" aria-label="Clear search" onClick={() => setQ('')}>
            ×
          </button>
        )}
      </div>

      {q.trim() ? (
        <>
          {mode === 'maybe' && (
            <div className="card verdict unknown">
              <span className="verdict-icon" aria-hidden>
                🤔
              </span>
              <div className="verdict-text">
                <strong className="verdict-title">Did you mean…?</strong>
                <span className="small">Keep typing, or tap one below.</span>
              </div>
            </div>
          )}
          {answer ? (
            <div className={'card verdict ' + answer.status}>
              <span className="verdict-icon" aria-hidden>
                {VERDICT[answer.status].icon}
              </span>
              <div className="verdict-text">
                <strong className="verdict-title">{VERDICT[answer.status].title}</strong>
                <span className="verdict-food">{answer.name}</span>
                {answer.limit && <span className="small limit">Max: {answer.limit}</span>}
                <span className="small">{answer.notes || answer.guide?.notes || VERDICT[answer.status].sub}</span>
                {answer.item && answer.guide?.notes && answer.guide.notes !== answer.notes && <span className="small muted">{answer.guide.notes}</span>}
                {answer.item?.data.liking && <span className="small">EJ {answer.item.data.liking} it {LIKING_ICON[answer.item.data.liking]}</span>}
                <div className="quick-row" style={{ marginTop: 6 }}>
                  <button className="btn ghost small" onClick={() => open(answer)}>
                    {answer.item ? 'Edit' : '+ Add to EJ’s list'}
                  </button>
                </div>
              </div>
            </div>
          ) : mode === 'maybe' ? null : (
            <div className="card psycho">
              <PsychoArt query={q} size={130} />
              <strong className="psycho-title">DON’T BE A PSYCHO</strong>
              <span className="psycho-line">{psychoLine(q)}</span>
              <span className="muted small">
                If “{q.trim()}” really is a food we don’t know, ask Dr. Novick first.{' '}
                <button className="link small" onClick={() => setEdit({ preset: { name: q.trim(), status: 'limit' } })}>
                  Add it
                </button>
              </span>
            </div>
          )}
          {mode !== 'psycho' && results.length > (answer ? 1 : 0) && (
            <>
              <h3 className="section-title">{answer ? 'Other matches' : 'Foods that start like that'}</h3>
              <ul className="list">
                {results.slice(answer ? 1 : 0, 8).map((e) => (
                  <FoodRow key={e.key} e={e} onOpen={() => open(e)} />
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <>
          {favorites.length > 0 && (
            <div className="card soft">
              <strong>EJ loves 😍</strong>
              <p className="small" style={{ margin: '4px 0 0' }}>
                {favorites.map((f) => f.data.name).join(', ')}
              </p>
            </div>
          )}
          <Chips value={filter} options={STATUS} onChange={setFilter} all="All" />
          <h3 className="section-title">EJ’s foods</h3>
          <ul className="list">
            {mine.filter(byStatus).sort(sortFn).map((e) => (
              <FoodRow key={e.key} e={e} onOpen={() => open(e)} />
            ))}
          </ul>
          {mine.filter(byStatus).length === 0 && <p className="empty">Nothing here yet.</p>}

          <h3 className="section-title">📖 Food guide · {rest.filter(byStatus).length} more</h3>
          {GROUPS.map((g) => {
            const list = rest.filter((e) => e.guide?.group === g).filter(byStatus).sort(sortFn)
            if (!list.length) return null
            const isOpen = openGroup === g
            return (
              <div key={g} className="card guide-group">
                <button className="row-between link-block" onClick={() => setOpenGroup(isOpen ? null : g)} aria-expanded={isOpen}>
                  <strong className="small">
                    {g} <span className="muted">· {list.length}</span>
                  </strong>
                  <span>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <ul className="list">
                    {list.map((e) => (
                      <FoodRow key={e.key} e={e} onOpen={() => open(e)} />
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </>
      )}
      <p className="muted small">General guidance only. Treats should stay a small part of the diet; ask the vet before big changes.</p>
      {edit && <FoodSheet item={'id' in edit ? edit : null} preset={'preset' in edit ? edit.preset : undefined} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

const GROUPS: GuideFood['group'][] = ['Fruit', 'Vegetables', 'Herbs & plants', 'Grains & feed', 'Snacks & other', 'Toxic plants']

function FoodRow({ e, onOpen }: { e: Entry; onOpen: () => void }) {
  return (
    <li className={'card tap food ' + e.status} onClick={onOpen}>
      <div className="row-between">
        <strong>
          {e.name} {e.item?.data.liking && LIKING_ICON[e.item.data.liking]}
        </strong>
        <span className={'status ' + e.status}>{STATUS_LABEL[e.status]}</span>
      </div>
      {e.limit && <p className="small limit">Max: {e.limit}</p>}
      {e.notes && <p className="muted small">{e.notes}</p>}
      {!e.item && <p className="hint">Tap to add to EJ’s list</p>}
    </li>
  )
}

function FoodSheet({ item, preset, onClose }: { item: Item<Food> | null; preset?: Food; onClose: () => void }) {
  const [d, set] = useDraft<Food>(item?.data ?? preset ?? { name: '', status: 'allowed' })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.name.trim()) return setErr('Add a name.')
    if (item) await updateItem(item.id, d)
    else await addItem('food', d)
    onClose()
  }
  return (
    <Sheet open title={item ? d.name : 'New food'} onClose={onClose}>
      <Field label="Food">
        <input value={d.name} onChange={(e) => set('name', e.target.value)} />
      </Field>
      <Field label="Is it OK?">
        <Segmented value={d.status} options={STATUS} labels={STATUS_LABEL} onChange={(v) => set('status', v)} />
      </Field>
      {d.status === 'limit' && (
        <Field label="Healthy limit">
          <input value={d.limit ?? ''} onChange={(e) => set('limit', e.target.value)} placeholder="e.g. 2 a day" />
        </Field>
      )}
      <Field label="Does EJ like it?">
        <Segmented value={d.liking} options={LIKING} labels={LIKING_ICON} onChange={(v) => set('liking', v === d.liking ? undefined : v)} />
      </Field>
      <Field label="Notes">
        <textarea rows={2} value={d.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={save} onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined} />
    </Sheet>
  )
}
