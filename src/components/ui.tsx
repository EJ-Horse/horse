import { isValidElement, useEffect, useRef, useState, type ReactNode } from 'react'
import { MAX_UPLOAD_MB, uploadMedia, useMediaUrl, usePeople, type Item } from '../lib/store'
import { go } from '../lib/router'

export function Screen({
  title,
  back = true,
  action,
  children,
}: {
  title: string
  back?: boolean
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="screen">
      <header className="topbar">
        {back ? (
          <button className="icon-btn" aria-label="Back" onClick={() => history.back()}>
            ‹
          </button>
        ) : (
          <span style={{ width: 40 }} />
        )}
        <h1>{title}</h1>
        <div className="topbar-action">{action}</div>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}

export function AddButton({ onClick, label = 'Add' }: { onClick: () => void; label?: string }) {
  return (
    <button className="pill-btn" onClick={onClick}>
      + {label}
    </button>
  )
}

export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  )
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  // Only wrap plain inputs in a <label>; a label around buttons would forward stray taps to the first button.
  const simple = isValidElement(children) && typeof children.type === 'string' && ['input', 'select', 'textarea'].includes(children.type)
  const inner = (
    <>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="hint">{hint}</span>}
    </>
  )
  return simple ? <label className="field">{inner}</label> : <div className="field" role="group" aria-label={label}>{inner}</div>
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  labels,
}: {
  value: T | undefined
  options: readonly T[]
  onChange: (v: T) => void
  labels?: Partial<Record<T, string>>
}) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          role="radio"
          aria-checked={value === o}
          className={value === o ? 'on' : ''}
          onClick={() => onChange(o)}
        >
          {labels?.[o] ?? o}
        </button>
      ))}
    </div>
  )
}

export function Chips<T extends string>({
  value,
  options,
  onChange,
  all,
}: {
  value: T | 'all'
  options: readonly T[]
  onChange: (v: T | 'all') => void
  all?: string
}) {
  return (
    <div className="chips">
      {all && (
        <button className={value === 'all' ? 'chip on' : 'chip'} onClick={() => onChange('all')}>
          {all}
        </button>
      )}
      {options.map((o) => (
        <button key={o} className={value === o ? 'chip on' : 'chip'} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>
}

export function SaveBar({ onSave, onDelete, busy, saveLabel = 'Save' }: { onSave: () => void; onDelete?: () => void; busy?: boolean; saveLabel?: string }) {
  return (
    <div className="save-bar">
      {onDelete && (
        <button
          type="button"
          className="btn ghost danger"
          onClick={() => {
            if (confirm('Delete this? This can’t be undone.')) onDelete()
          }}
        >
          Delete
        </button>
      )}
      <button type="button" className="btn" disabled={busy} onClick={onSave}>
        {busy ? 'Saving…' : saveLabel}
      </button>
    </div>
  )
}

export function MediaImg({ path, alt = '', className, onClick }: { path?: string; alt?: string; className?: string; onClick?: () => void }) {
  const url = useMediaUrl(path)
  if (!path) return null
  if (!url) return <div className={'img-placeholder ' + (className ?? '')} />
  return <img src={url} alt={alt} className={className} onClick={onClick} loading="lazy" />
}

export function MediaVideo({ path }: { path?: string }) {
  const url = useMediaUrl(path)
  if (!path || !url) return null
  return <video src={url} controls playsInline className="clip" preload="metadata" />
}

/** A file button that uploads right away and hands back the stored path. */
export function UploadButton({
  folder,
  accept = 'image/*',
  label = 'Add photo',
  multiple = false,
  capture,
  onUploaded,
}: {
  folder: string
  accept?: string
  label?: string
  multiple?: boolean
  capture?: boolean
  onUploaded: (paths: string[]) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function onPick(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    setErr('')
    try {
      const paths: string[] = []
      for (const f of Array.from(files)) paths.push(await uploadMedia(f, folder))
      onUploaded(paths)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
      if (ref.current) ref.current.value = ''
    }
  }
  return (
    <div className="upload">
      <button type="button" className="btn secondary" disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? 'Uploading…' : label}
      </button>
      <input
        ref={ref}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        {...(capture ? { capture: 'environment' } : {})}
        onChange={(e) => void onPick(e.target.files)}
      />
      {accept.includes('video') && <span className="hint">Clips up to {MAX_UPLOAD_MB} MB. For longer videos, paste a link instead.</span>}
      {err && <p className="error">{err}</p>}
    </div>
  )
}

export function Lightbox({ path, onClose }: { path: string | null; onClose: () => void }) {
  if (!path) return null
  return (
    <div className="lightbox" onClick={onClose}>
      <MediaImg path={path} className="lightbox-img" />
      <button className="icon-btn lightbox-close" aria-label="Close">
        ×
      </button>
    </div>
  )
}

export function AddedBy({ item }: { item: Item<unknown> }) {
  const people = usePeople()
  const name = item.created_by ? people[item.created_by] : ''
  if (!name) return null
  return <span className="by">by {name}</span>
}

export function LinkOut({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return null
  return (
    <a className="btn secondary small" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function Tile({ to, icon, title, sub, badge }: { to: string; icon: string; title: string; sub?: string; badge?: string | number }) {
  return (
    <button className="tile" onClick={() => go(to)}>
      <span className="tile-icon" aria-hidden>
        {icon}
      </span>
      <span className="tile-title">{title}</span>
      {sub && <span className="tile-sub">{sub}</span>}
      {badge ? <span className="badge">{badge}</span> : null}
    </button>
  )
}

/** Small helper so forms can edit a draft object. */
export function useDraft<T>(initial: T) {
  const [draft, setDraft] = useState<T>(initial)
  const set = <K extends keyof T>(k: K, v: T[K]) => setDraft((d) => ({ ...d, [k]: v }))
  return [draft, set, setDraft] as const
}

export function ErrorText({ error }: { error: string }) {
  return error ? <p className="error">{error}</p> : null
}
