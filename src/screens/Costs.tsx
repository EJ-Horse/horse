import { useState } from 'react'
import { AddButton, AddedBy, ErrorText, Field, LinkOut, MediaImg, SaveBar, Screen, Sheet, UploadButton, useDraft } from '../components/ui'
import { formatDate, monthKey, monthLabel, today } from '../lib/dates'
import { addItem, deleteMedia, removeItem, updateItem, useItems, useMediaUrl, useSingle, type Item } from '../lib/store'
import { COST_CATEGORIES, type Cost, type Profile } from '../lib/types'
import { DocLink } from './Pedigree'
import { totalsByCategory, totalsByMonth } from '../lib/costs'

export function money(n: number, currency = '$') {
  return currency + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function Costs() {
  const costs = useItems<Cost>('cost')
  const profile = useSingle<Profile>('profile')
  const cur = profile?.data.currency || '$'
  const [edit, setEdit] = useState<Item<Cost> | 'new' | null>(null)
  const paid = costs.filter((c) => !c.data.pending)
  const pending = costs.filter((c) => c.data.pending).sort((a, b) => a.data.date.localeCompare(b.data.date))
  const pendingTotal = pending.reduce((s, c) => s + c.data.amount, 0)
  const months = totalsByMonth(paid.map((c) => c.data))
  const [month, setMonth] = useState(monthKey(today()))
  const inMonth = paid.filter((c) => monthKey(c.data.date) === month).sort((a, b) => b.data.date.localeCompare(a.data.date))
  const cats = totalsByCategory(inMonth.map((c) => c.data))
  const year = month.slice(0, 4)
  const yearTotal = paid.filter((c) => c.data.date.startsWith(year)).reduce((s, c) => s + c.data.amount, 0)
  const monthTotal = inMonth.reduce((s, c) => s + c.data.amount, 0)
  const allMonths = [...new Set([monthKey(today()), ...months.map((m) => m.month)])].sort().reverse()
  const max = Math.max(1, ...cats.map((c) => c.total))

  return (
    <Screen title="Costs" action={<AddButton onClick={() => setEdit('new')} label="Cost" />}>
      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">{monthLabel(month)}</span>
          <span className="stat-value">{money(monthTotal, cur)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total {year}</span>
          <span className="stat-value">{money(yearTotal, cur)}</span>
        </div>
      </div>
      {pending.length > 0 && (
        <div className="card warn">
          <div className="row-between">
            <strong>⏳ Pending</strong>
            <strong>{money(pendingTotal, cur)}</strong>
          </div>
          <ul className="list compact">
            {pending.map((c) => (
              <li key={c.id} className="row-between tap" onClick={() => setEdit(c)}>
                <span>
                  {c.data.description || c.data.category}
                  <span className="muted small"> · {c.data.category}</span>
                </span>
                <span>{money(c.data.amount, cur)}</span>
              </li>
            ))}
          </ul>
          <p className="hint">Not counted as spent yet. Tap one and untick “Pending” once it’s paid.</p>
        </div>
      )}
      <select value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month">
        {allMonths.map((m) => (
          <option key={m} value={m}>
            {monthLabel(m)}
          </option>
        ))}
      </select>
      {cats.length > 0 && (
        <div className="card">
          {cats.map((c) => (
            <div key={c.category} className="bar-row">
              <span className="bar-label">{c.category}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(c.total / max) * 100}%` }} />
              </span>
              <span className="bar-value">{money(c.total, cur)}</span>
            </div>
          ))}
        </div>
      )}
      {inMonth.length === 0 && <p className="empty">No costs this month.</p>}
      <ul className="list">
        {inMonth.map((c) => (
          <li key={c.id} className="card tap" onClick={() => setEdit(c)}>
            <div className="row-between">
              <strong>{c.data.description || c.data.category}</strong>
              <strong>{money(c.data.amount, cur)}</strong>
            </div>
            <p className="muted small">
              {c.data.category} · {formatDate(c.data.date)}
              {c.data.invoice && (c.data.invoice.startsWith('pedigree/docs/') ? ' · 📄 contract' : ' · 📎 invoice')} <AddedBy item={c} />
            </p>
          </li>
        ))}
      </ul>
      {edit && <CostSheet item={edit === 'new' ? null : edit} currency={cur} onClose={() => setEdit(null)} />}
    </Screen>
  )
}

function InvoiceLink({ path }: { path: string }) {
  if (path.startsWith('pedigree/docs/')) return <DocLink path={path} label="📄 Open the document" />
  return <MediaInvoiceLink path={path} />
}

function MediaInvoiceLink({ path }: { path: string }) {
  const url = useMediaUrl(path)
  return <LinkOut href={url}>📎 Open invoice</LinkOut>
}

function CostSheet({ item, currency, onClose }: { item: Item<Cost> | null; currency: string; onClose: () => void }) {
  const [d, set] = useDraft<Cost>(item?.data ?? { date: today(), category: 'Stable', amount: 0 })
  const [amount, setAmount] = useState(item ? String(item.data.amount) : '')
  const [err, setErr] = useState('')
  async function save() {
    const n = Number(amount.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) return setErr('Enter the amount.')
    const data = { ...d, amount: n }
    if (item) await updateItem(item.id, data)
    else await addItem('cost', data)
    onClose()
  }
  const isImage = d.invoice && /\.(jpe?g|png|webp|heic|gif)$/i.test(d.invoice)
  return (
    <Sheet open title={item ? 'Edit cost' : 'New cost'} onClose={onClose}>
      <Field label={`Amount (${currency})`}>
        <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" autoFocus={!item} />
      </Field>
      <Field label="Category">
        <div className="chips">
          {COST_CATEGORIES.map((c) => (
            <button type="button" key={c} className={d.category === c ? 'chip on' : 'chip'} onClick={() => set('category', c)}>
              {c}
            </button>
          ))}
        </div>
      </Field>
      <Field label="What for">
        <input value={d.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="e.g. November board" />
      </Field>
      <Field label="Date">
        <input type="date" value={d.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
      <label className="check">
        <input type="checkbox" checked={!!d.pending} onChange={(e) => set('pending', e.target.checked || undefined)} /> Pending (not paid yet)
      </label>
      <Field label="Invoice / receipt">
        {d.invoice ? (
          <div className="quick-row">
            {isImage ? <MediaImg path={d.invoice} className="thumb" /> : <InvoiceLink path={d.invoice} />}
            <button type="button" className="btn ghost small" onClick={() => set('invoice', undefined)}>
              Remove
            </button>
          </div>
        ) : (
          <UploadButton folder="invoices" accept="image/*,application/pdf" label="📎 Attach photo or PDF" onUploaded={([p]) => set('invoice', p)} />
        )}
      </Field>
      <ErrorText error={err} />
      <SaveBar
        onSave={save}
        onDelete={
          item
            ? () => {
                if (!item.data.invoice?.startsWith('pedigree/docs/')) void deleteMedia([item.data.invoice])
                void removeItem(item.id).then(onClose)
              }
            : undefined
        }
      />
    </Sheet>
  )
}
