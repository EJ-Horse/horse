import { useState } from 'react'
import { AddButton, Chips, ErrorText, Field, SaveBar, Screen, Segmented, Sheet, useDraft } from '../components/ui'
import { addItem, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { Food } from '../lib/types'

const STATUS = ['allowed', 'limit', 'forbidden'] as const
const STATUS_LABEL = { allowed: '✅ OK', limit: '⚖️ Limit', forbidden: '⛔ Never' }
const LIKING = ['loves', 'likes', 'meh', 'dislikes'] as const
const LIKING_ICON = { loves: '😍', likes: '🙂', meh: '😐', dislikes: '🙅' }

export function Nutrition() {
  const foods = useItems<Food>('food')
  const [filter, setFilter] = useState<Food['status'] | 'all'>('all')
  const [q, setQ] = useState('')
  const [edit, setEdit] = useState<Item<Food> | 'new' | null>(null)
  const shown = foods
    .filter((f) => filter === 'all' || f.data.status === filter)
    .filter((f) => !q || f.data.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => STATUS.indexOf(a.data.status) - STATUS.indexOf(b.data.status) || a.data.name.localeCompare(b.data.name))
  const favorites = foods.filter((f) => f.data.liking === 'loves')
  return (
    <Screen title="Nutrition" action={<AddButton onClick={() => setEdit('new')} label="Food" />}>
      {favorites.length > 0 && (
        <div className="card soft">
          <strong>EJ loves 😍</strong>
          <p className="small" style={{ margin: '4px 0 0' }}>
            {favorites.map((f) => f.data.name).join(', ')}
          </p>
        </div>
      )}
      <input className="search" placeholder="Can EJ eat…?" value={q} onChange={(e) => setQ(e.target.value)} />
      <Chips value={filter} options={STATUS} onChange={setFilter} all="All" />
      <ul className="list">
        {shown.map((f) => (
          <li key={f.id} className={'card tap food ' + f.data.status} onClick={() => setEdit(f)}>
            <div className="row-between">
              <strong>
                {f.data.name} {f.data.liking && LIKING_ICON[f.data.liking]}
              </strong>
              <span className={'status ' + f.data.status}>{STATUS_LABEL[f.data.status]}</span>
            </div>
            {f.data.limit && <p className="small limit">Max: {f.data.limit}</p>}
            {f.data.notes && <p className="muted small">{f.data.notes}</p>}
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="empty">Nothing matches. Add it with “+ Food”.</p>}
      <p className="muted small">Treats should stay a small part of the diet. Ask the vet before big changes.</p>
      {edit && <FoodSheet item={edit === 'new' ? null : edit} name={edit === 'new' ? q : ''} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function FoodSheet({ item, name, onClose }: { item: Item<Food> | null; name: string; onClose: () => void }) {
  const [d, set] = useDraft<Food>(item?.data ?? { name, status: 'allowed' })
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
