import { useState } from 'react'
import { AddedBy, ErrorText, Field, SaveBar, Segmented, Sheet, useDraft } from './ui'
import { dueLabel, dueState, today } from '../lib/dates'
import { addItem, getCurrentUserId, removeItem, updateItem, useItems, type Item } from '../lib/store'
import type { Attention } from '../lib/types'

const AREA_LABEL = { horse: '🐴 EJ', rider: '🏇 Sofía' }

export function useOpenAttention(area?: Attention['area']) {
  return useItems<Attention>('attention')
    .filter((a) => !a.data.done && (!area || a.data.area === area))
    .sort((a, b) => (a.data.due ?? '9').localeCompare(b.data.due ?? '9') || b.created_at.localeCompare(a.created_at))
}

export function markDone(a: Item<Attention>) {
  return updateItem(a.id, { ...a.data, done: true, doneOn: today(), doneBy: getCurrentUserId() ?? undefined })
}

/** One open item, with a done button. Used on Home and on the hubs. */
export function AttentionRow({ item, showArea, onOpen }: { item: Item<Attention>; showArea?: boolean; onOpen: () => void }) {
  const st = dueState(item.data.due, today(), 3)
  return (
    <li className="attn-row">
      <button className="attn-done" aria-label={`Mark “${item.data.text}” done`} onClick={() => void markDone(item)}>
        ✓
      </button>
      <span className="attn-text tap" onClick={onOpen}>
        {showArea && <span className="muted small">{AREA_LABEL[item.data.area]} · </span>}
        {item.data.text} <AddedBy item={item} />
      </span>
      {item.data.due && <span className={'due ' + st}>{dueLabel(item.data.due)}</span>}
    </li>
  )
}

/** Slim bar on the Horse and Rider tabs: open items for that area plus “+ Add”. */
export function AttentionBar({ area }: { area: Attention['area'] }) {
  const open = useOpenAttention(area)
  const [edit, setEdit] = useState<Item<Attention> | 'new' | null>(null)
  return (
    <div className={'card attn-bar' + (open.length ? ' has-items' : '')}>
      <div className="row-between">
        <strong className="small">⚠️ Needs attention{open.length ? ` · ${open.length}` : ''}</strong>
        <button className="pill-btn" onClick={() => setEdit('new')}>
          + Add
        </button>
      </div>
      {open.length > 0 && (
        <ul className="attn-list">
          {open.map((a) => (
            <AttentionRow key={a.id} item={a} onOpen={() => setEdit(a)} />
          ))}
        </ul>
      )}
      {edit && <AttentionSheet item={edit === 'new' ? null : edit} area={area} onClose={() => setEdit(null)} />}
    </div>
  )
}

export function AttentionSheet({ item, area, onClose }: { item: Item<Attention> | null; area: Attention['area']; onClose: () => void }) {
  const [d, set] = useDraft<Attention>(item?.data ?? { text: '', area })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.text.trim()) return setErr('What needs attention?')
    try {
      const data = { ...d, text: d.text.trim() }
      if (item) await updateItem(item.id, data)
      else await addItem('attention', data)
      onClose()
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title={item ? 'Needs attention' : 'Add something that needs attention'} onClose={onClose}>
      <Field label="What needs attention?">
        <input
          autoFocus={!item}
          value={d.text}
          onChange={(e) => set('text', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void save()}
          placeholder={d.area === 'horse' ? 'e.g. Left hind shoe loose' : 'e.g. Helmet strap broken'}
        />
      </Field>
      <Field label="For">
        <Segmented value={d.area} options={['horse', 'rider'] as const} labels={AREA_LABEL} onChange={(v) => set('area', v)} />
      </Field>
      <Field label="By when? (optional)">
        <input type="date" value={d.due ?? ''} onChange={(e) => set('due', e.target.value || undefined)} />
      </Field>
      <p className="hint">It shows on Home until someone marks it ✓ done.</p>
      <ErrorText error={err} />
      <SaveBar
        onSave={() => void save()}
        saveLabel={item ? 'Save' : 'Add'}
        onDelete={item ? () => void removeItem(item.id).then(onClose) : undefined}
      />
    </Sheet>
  )
}
