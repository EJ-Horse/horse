import { useState } from 'react'
import { AddButton, ErrorText, Field, Lightbox, MediaImg, SaveBar, Segmented, Sheet, UploadButton, useDraft } from './ui'
import { formatDate, today } from '../lib/dates'
import { injuryDay, LAMENESS_LABEL, latestCheck, LEG_LABEL, needsVet, sortedChecks, trend, vetSummary } from '../lib/injury'
import { addItem, getCurrentUserId, removeItem, updateItem, useItems, usePeople, useSingle, type Item } from '../lib/store'
import type { Injury, InjuryCheck, Profile } from '../lib/types'

const TREND = { better: { t: '📉 Getting better', c: 'ok' }, worse: { t: '📈 Getting worse', c: 'overdue' }, same: { t: '➡️ About the same', c: 'soon' }, new: { t: 'First check', c: 'unknown' } }
const LEGS = ['LF', 'RF', 'LH', 'RH'] as const

/** Health → Injuries: follow an injury or lameness day by day until it heals. */
export function Injuries() {
  const list = useItems<Injury>('injury')
  const [open, setOpen] = useState<Item<Injury> | null>(null)
  const [creating, setCreating] = useState(false)
  const [showHealed, setShowHealed] = useState(false)
  const active = list.filter((i) => i.data.status === 'active').sort((a, b) => b.data.startDate.localeCompare(a.data.startDate))
  const healed = list.filter((i) => i.data.status === 'healed').sort((a, b) => (b.data.healedOn ?? '').localeCompare(a.data.healedOn ?? ''))
  // keep the open sheet in sync with live updates
  const current = open ? list.find((i) => i.id === open.id) ?? null : null

  return (
    <>
      <div className="row-between">
        <p className="muted small">Track an injury or lameness each day: lameness, heat, swelling and a photo.</p>
        <AddButton onClick={() => setCreating(true)} label="Injury" />
      </div>
      {active.length === 0 && <p className="empty">No active injuries. 🍀</p>}
      <ul className="list">
        {active.map((i) => (
          <InjuryCard key={i.id} item={i} onOpen={() => setOpen(i)} />
        ))}
      </ul>
      {healed.length > 0 && (
        <div className="card soft">
          <button className="row-between link-block" onClick={() => setShowHealed(!showHealed)}>
            <strong className="small">✅ Healed · {healed.length}</strong>
            <span>{showHealed ? '−' : '+'}</span>
          </button>
          {showHealed && (
            <ul className="list compact">
              {healed.map((i) => (
                <li key={i.id} className="tap" onClick={() => setOpen(i)}>
                  {i.data.title} <span className="muted small">· {formatDate(i.data.startDate)} → {formatDate(i.data.healedOn)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {creating && <NewInjurySheet onClose={() => setCreating(false)} onCreated={(i) => setOpen(i)} />}
      {current && <InjurySheet item={current} onClose={() => setOpen(null)} />}
    </>
  )
}

function Bars({ checks }: { checks: InjuryCheck[] }) {
  const last = checks.slice(-14)
  return (
    <div className="lame-bars" aria-label="Lameness over time">
      {last.map((c, i) => (
        <span key={i} className={'lame-bar l' + c.lameness} style={{ height: `${8 + c.lameness * 6}px` }} title={`${formatDate(c.date)}: ${c.lameness}/5`} />
      ))}
    </div>
  )
}

function InjuryCard({ item, onOpen }: { item: Item<Injury>; onOpen: () => void }) {
  const i = item.data
  const last = latestCheck(i)
  const tr = trend(i)
  return (
    <li className="card tap injury-card" onClick={onOpen}>
      <div className="row-between">
        <strong>🩹 {i.title}</strong>
        <span className="muted small">Day {injuryDay(i, today())}</span>
      </div>
      <p className="muted small">
        {[i.leg ? LEG_LABEL[i.leg] : '', i.part].filter(Boolean).join(' · ') || 'Location not set'} · since {formatDate(i.startDate)}
      </p>
      {last ? (
        <>
          <div className="row-between">
            <span className="small">
              Last check {formatDate(last.date)}: <strong>{last.lameness}/5</strong> · heat {last.heat} · swelling {last.swelling}
            </span>
          </div>
          <div className="row-between">
            <Bars checks={sortedChecks(i)} />
            <span className={'due ' + TREND[tr].c}>{TREND[tr].t}</span>
          </div>
          {needsVet(last) && <p className="vet-warn">⚠️ Lameness 3+, a hot leg or severe swelling: call Dr. Novick.</p>}
        </>
      ) : (
        <p className="small">No checks yet. Tap to add the first one.</p>
      )}
      {last?.date !== today() && <span className="btn small check-btn">+ Today’s check</span>}
    </li>
  )
}

function NewInjurySheet({ onClose, onCreated }: { onClose: () => void; onCreated: (i: Item<Injury>) => void }) {
  const [d, set] = useDraft<Injury>({ title: '', startDate: today(), status: 'active', checks: [] })
  const [err, setErr] = useState('')
  async function save() {
    if (!d.title.trim()) return setErr('What happened? e.g. “Swollen left hind fetlock”.')
    try {
      const row = await addItem('injury', { ...d, title: d.title.trim() })
      onClose()
      onCreated(row)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    }
  }
  return (
    <Sheet open title="New injury" onClose={onClose}>
      <Field label="What happened?">
        <input autoFocus value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Limping, cut on leg, swollen knee" />
      </Field>
      <Field label="Which leg? (if a leg)">
        <Segmented value={d.leg} options={LEGS} labels={LEG_LABEL} onChange={(v) => set('leg', v === d.leg ? undefined : v)} />
      </Field>
      <Field label="Where exactly?">
        <input value={d.part ?? ''} onChange={(e) => set('part', e.target.value || undefined)} placeholder="e.g. fetlock, hoof, knee, shoulder" />
      </Field>
      <Field label="When did it start?">
        <input type="date" value={d.startDate} onChange={(e) => set('startDate', e.target.value)} />
      </Field>
      <ErrorText error={err} />
      <SaveBar onSave={() => void save()} saveLabel="Start tracking" />
    </Sheet>
  )
}

function InjurySheet({ item, onClose }: { item: Item<Injury>; onClose: () => void }) {
  const i = item.data
  const people = usePeople()
  const profile = useSingle<Profile>('profile')
  const [adding, setAdding] = useState(!i.checks.some((c) => c.date === today()) && i.status === 'active')
  const [big, setBig] = useState<string | null>(null)
  const [copied, setCopied] = useState('')
  const checks = sortedChecks(i)
  const photos = checks.filter((c) => c.photo)
  const first = photos[0]
  const lastPhoto = photos.at(-1)

  async function share() {
    const text = vetSummary(i, profile?.data.name || 'EJ', today())
    try {
      if (navigator.share) await navigator.share({ title: `${profile?.data.name || 'EJ'}: ${i.title}`, text })
      else {
        await navigator.clipboard.writeText(text)
        setCopied('Copied. Paste it into a text to Dr. Novick.')
      }
    } catch {
      /* share cancelled */
    }
  }

  return (
    <Sheet open title={`🩹 ${i.title}`} onClose={onClose}>
      <p className="muted small">
        {[i.leg ? LEG_LABEL[i.leg] : '', i.part].filter(Boolean).join(' · ')} · since {formatDate(i.startDate)} · day {injuryDay(i, today())}
        {i.status === 'healed' && i.healedOn && ` · healed ${formatDate(i.healedOn)}`}
      </p>

      {i.status === 'active' &&
        (adding ? (
          <CheckForm
            onSave={async (c) => {
              await updateItem(item.id, { ...i, checks: [...i.checks.filter((x) => x.date !== c.date), c] })
              setAdding(false)
            }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button className="btn" style={{ width: '100%', margin: '4px 0 12px' }} onClick={() => setAdding(true)}>
            + Add a check
          </button>
        ))}

      {first && lastPhoto && first !== lastPhoto && (
        <div className="compare-side injury-compare">
          <figure>
            <MediaImg path={first.photo} className="compare-img" onClick={() => setBig(first.photo!)} />
            <figcaption>First · {formatDate(first.date)}</figcaption>
          </figure>
          <figure>
            <MediaImg path={lastPhoto.photo} className="compare-img" onClick={() => setBig(lastPhoto.photo!)} />
            <figcaption>Latest · {formatDate(lastPhoto.date)}</figcaption>
          </figure>
        </div>
      )}

      {checks.length > 0 && (
        <>
          <span className="field-label" style={{ display: 'block' }}>Lameness over time</span>
          <Bars checks={checks} />
          <ul className="check-list">
            {[...checks].reverse().map((c) => (
              <li key={c.date}>
                <div className="row-between">
                  <strong className="small">{formatDate(c.date)}</strong>
                  <span className={'lame-chip l' + c.lameness}>
                    {c.lameness}/5 · {LAMENESS_LABEL[c.lameness]}
                  </span>
                </div>
                <span className="small muted">
                  Heat: {c.heat} · Swelling: {c.swelling}
                  {c.by && people[c.by] ? ` · ${people[c.by]}` : ''}
                </span>
                {c.treatment && <span className="small">💧 {c.treatment}</span>}
                {c.note && <span className="small">{c.note}</span>}
                {c.photo && <MediaImg path={c.photo} className="thumb" onClick={() => setBig(c.photo!)} />}
              </li>
            ))}
          </ul>
        </>
      )}

      <label className="check" style={{ marginTop: 10 }}>
        <input type="checkbox" checked={!!i.vetSeen} onChange={(e) => void updateItem(item.id, { ...i, vetSeen: e.target.checked })} /> Vet has seen it
      </label>
      <div className="quick-row">
        <button className="btn secondary small" onClick={() => void share()} disabled={!checks.length}>
          📤 Send summary to the vet
        </button>
        {i.status === 'active' ? (
          <button className="btn ghost small" onClick={() => void updateItem(item.id, { ...i, status: 'healed', healedOn: today() })}>
            ✅ Mark healed
          </button>
        ) : (
          <button className="btn ghost small" onClick={() => void updateItem(item.id, { ...i, status: 'active', healedOn: undefined })}>
            Reopen
          </button>
        )}
        <button
          className="btn ghost small danger"
          onClick={() => {
            if (confirm('Delete this injury and all its checks?')) void removeItem(item.id).then(onClose)
          }}
        >
          Delete
        </button>
      </div>
      {copied && <p className="hint">{copied}</p>}
      <Lightbox path={big} onClose={() => setBig(null)} />
    </Sheet>
  )
}

function CheckForm({ onSave, onCancel }: { onSave: (c: InjuryCheck) => Promise<void>; onCancel: () => void }) {
  const [c, set] = useDraft<InjuryCheck>({ date: today(), lameness: 0, heat: 'none', swelling: 'none' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  return (
    <div className="card soft check-form">
      <strong className="small">Today’s check</strong>
      <Field label={`Lameness: ${c.lameness}/5 · ${LAMENESS_LABEL[c.lameness]}`}>
        <div className="lame-picker" role="radiogroup" aria-label="Lameness from 0 to 5">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={c.lameness === n} className={'lame-btn l' + n + (c.lameness === n ? ' on' : '')} onClick={() => set('lameness', n)}>
              {n}
            </button>
          ))}
        </div>
        <span className="hint">0 sound · 1 barely · 2 mild · 3 obvious · 4 severe · 5 won’t put weight on it</span>
      </Field>
      <Field label="Heat (feel with the back of your hand)">
        <Segmented value={c.heat} options={['none', 'warm', 'hot'] as const} onChange={(v) => set('heat', v)} />
      </Field>
      <Field label="Swelling">
        <Segmented value={c.swelling} options={['none', 'mild', 'moderate', 'severe'] as const} onChange={(v) => set('swelling', v)} />
      </Field>
      <Field label="Photo">
        {c.photo ? <MediaImg path={c.photo} className="preview-img" /> : <UploadButton folder="injuries" label="📷 Take or choose photo" onUploaded={([p]) => set('photo', p)} />}
      </Field>
      <Field label="What did you do?">
        <input value={c.treatment ?? ''} onChange={(e) => set('treatment', e.target.value || undefined)} placeholder="e.g. Cold hosed 15 min, wrapped, rested" />
      </Field>
      <Field label="Notes">
        <textarea rows={2} value={c.note ?? ''} onChange={(e) => set('note', e.target.value || undefined)} />
      </Field>
      <Field label="Date">
        <input type="date" value={c.date} onChange={(e) => set('date', e.target.value)} />
      </Field>
      {needsVet(c) && <p className="vet-warn">⚠️ This looks serious. Call Dr. Novick.</p>}
      <ErrorText error={err} />
      <div className="save-bar">
        <button type="button" className="btn ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await onSave({ ...c, by: getCurrentUserId() ?? undefined })
            } catch (e) {
              setErr(e instanceof Error ? e.message : String(e))
              setBusy(false)
            }
          }}
        >
          {busy ? 'Saving…' : 'Save check'}
        </button>
      </div>
    </div>
  )
}
