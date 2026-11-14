import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { supabase } from './supabase'

export type Item<T = Record<string, unknown>> = {
  id: string
  kind: string
  data: T
  created_by: string | null
  created_at: string
  updated_at: string
}

type Status = 'loading' | 'ready' | 'error'

let items: Item[] = []
let status: Status = 'loading'
let errorMessage = ''
const listeners = new Set<() => void>()
let snapshot: { items: Item[]; status: Status; errorMessage: string } = { items, status, errorMessage }

function emit() {
  snapshot = { items, status, errorMessage }
  listeners.forEach((l) => l())
}

const LOCAL_KEY = 'ej-items-v1'

function saveLocal() {
  if (!supabase) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
    } catch {
      /* storage full or blocked: keep in memory */
    }
  }
}

function upsertLocalCopy(row: Item) {
  const i = items.findIndex((x) => x.id === row.id)
  items = i === -1 ? [row, ...items] : items.map((x) => (x.id === row.id ? row : x))
}

let started = false
export async function startStore() {
  if (started) return
  started = true
  if (!supabase) {
    try {
      items = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]')
    } catch {
      items = []
    }
    status = 'ready'
    emit()
    return
  }
  await reload()
  supabase
    .channel('items-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, (payload) => {
      if (payload.eventType === 'DELETE') {
        const id = (payload.old as { id: string }).id
        items = items.filter((x) => x.id !== id)
      } else {
        upsertLocalCopy(payload.new as Item)
      }
      emit()
    })
    .subscribe()
  // Catch up after the phone was asleep.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void reload()
  })
}

export function stopStore() {
  started = false
  items = []
  status = 'loading'
  supabase?.removeAllChannels()
  emit()
}

async function reload() {
  if (!supabase) return
  const all: Item[] = []
  const page = 1000
  for (let from = 0; ; from += page) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + page - 1)
    if (error) {
      status = 'error'
      errorMessage = error.message
      emit()
      return
    }
    all.push(...(data as Item[]))
    if (!data || data.length < page) break
  }
  items = all
  status = 'ready'
  emit()
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useStoreStatus() {
  return useSyncExternalStore(subscribe, () => snapshot)
}

export function useItems<T = Record<string, unknown>>(kind: string): Item<T>[] {
  const snap = useSyncExternalStore(subscribe, () => snapshot)
  return useMemo(() => snap.items.filter((x) => x.kind === kind) as Item<T>[], [snap.items, kind])
}

/** Returns the first item of a single-item kind (like EJ's profile), or undefined. */
export function useSingle<T>(kind: string): Item<T> | undefined {
  return useItems<T>(kind)[0]
}

function newId() {
  return crypto.randomUUID()
}

export async function addItem<T>(kind: string, data: T): Promise<Item<T>> {
  const now = new Date().toISOString()
  const row: Item<T> = { id: newId(), kind, data, created_by: currentUserId, created_at: now, updated_at: now }
  upsertLocalCopy(row as Item)
  emit()
  if (supabase) {
    const { error } = await supabase.from('items').insert({ id: row.id, kind, data })
    if (error) {
      items = items.filter((x) => x.id !== row.id)
      emit()
      throw new Error(error.message)
    }
  } else saveLocal()
  return row
}

export async function addMany<T>(kind: string, list: T[]) {
  const now = new Date().toISOString()
  const rows = list.map((data, i) => ({
    id: newId(),
    kind,
    data,
    created_by: currentUserId,
    // Keep the given order when sorted newest-first.
    created_at: new Date(Date.parse(now) - i).toISOString(),
    updated_at: now,
  }))
  items = [...rows, ...items] as Item[]
  emit()
  if (supabase) {
    const { error } = await supabase
      .from('items')
      .insert(rows.map(({ id, kind, data, created_at }) => ({ id, kind, data, created_at })))
    if (error) throw new Error(error.message)
  } else saveLocal()
}

export async function updateItem<T>(id: string, data: T) {
  const prev = items.find((x) => x.id === id)
  if (!prev) return
  const now = new Date().toISOString()
  upsertLocalCopy({ ...prev, data: data as Record<string, unknown>, updated_at: now })
  emit()
  if (supabase) {
    const { error } = await supabase.from('items').update({ data, updated_at: now }).eq('id', id)
    if (error) {
      upsertLocalCopy(prev)
      emit()
      throw new Error(error.message)
    }
  } else saveLocal()
}

export async function removeItem(id: string) {
  const prev = items.find((x) => x.id === id)
  items = items.filter((x) => x.id !== id)
  emit()
  if (supabase) {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) {
      if (prev) upsertLocalCopy(prev)
      emit()
      throw new Error(error.message)
    }
  } else saveLocal()
}

// ---------- who is signed in ----------

let currentUserId: string | null = null
export function setCurrentUser(id: string | null) {
  currentUserId = id
}
export function getCurrentUserId() {
  return currentUserId
}

export function usePeople() {
  const [people, setPeople] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!supabase) return
    void supabase
      .from('people')
      .select('user_id,name')
      .then(({ data }) => {
        const map: Record<string, string> = {}
        for (const p of data ?? []) map[p.user_id as string] = p.name as string
        setPeople(map)
      })
  }, [])
  return people
}

// ---------- photos, invoices and video clips ----------

export const MAX_UPLOAD_MB = 50

/** Shrinks big photos so they upload fast and fit the free storage plan. */
export async function shrinkImage(file: File, maxSide = 1800, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality))
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

function extFor(blob: Blob, name: string) {
  if (blob.type === 'image/jpeg') return 'jpg'
  const fromName = name.split('.').pop()
  return fromName && fromName.length <= 5 ? fromName.toLowerCase() : 'bin'
}

/** Uploads a file and returns its storage path (kept in the item's data). */
export async function uploadMedia(file: File, folder: string): Promise<string> {
  const blob = await shrinkImage(file)
  if (blob.size > MAX_UPLOAD_MB * 1024 * 1024) {
    throw new Error(`That file is ${Math.round(blob.size / 1024 / 1024)} MB. The limit is ${MAX_UPLOAD_MB} MB, so paste a YouTube or Google Drive link instead.`)
  }
  const path = `${folder}/${newId()}.${extFor(blob, file.name)}`
  if (!supabase) {
    await idbPut(path, blob)
    return 'local:' + path
  }
  const { error } = await supabase.storage.from('media').upload(path, blob, { contentType: blob.type || file.type })
  if (error) throw new Error(error.message)
  return path
}

export async function deleteMedia(paths: (string | undefined | null)[]) {
  const real = paths.filter((p): p is string => !!p)
  if (!real.length) return
  if (!supabase) {
    for (const p of real) await idbDelete(p.replace(/^local:/, ''))
    return
  }
  await supabase.storage.from('media').remove(real)
}

const urlCache = new Map<string, { url: string; expires: number }>()

export async function mediaUrl(path: string): Promise<string> {
  const hit = urlCache.get(path)
  if (hit && hit.expires > Date.now()) return hit.url
  let url: string
  if (path.startsWith('local:')) {
    const blob = await idbGet(path.slice(6))
    url = blob ? URL.createObjectURL(blob) : ''
  } else if (supabase) {
    const { data } = await supabase.storage.from('media').createSignedUrl(path, 60 * 60 * 24)
    url = data?.signedUrl ?? ''
  } else url = ''
  urlCache.set(path, { url, expires: Date.now() + 1000 * 60 * 60 * 23 })
  return url
}

export function useMediaUrl(path: string | undefined | null) {
  const [url, setUrl] = useState<string>(() => (path && urlCache.get(path)?.url) || '')
  useEffect(() => {
    let alive = true
    if (!path) {
      setUrl('')
      return
    }
    void mediaUrl(path).then((u) => alive && setUrl(u))
    return () => {
      alive = false
    }
  }, [path])
  return url
}

// Tiny IndexedDB helper used only in local preview mode.
function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ej-media', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('files')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}
async function idbPut(key: string, blob: Blob) {
  const db = await idb()
  await new Promise((res, rej) => {
    const tx = db.transaction('files', 'readwrite')
    tx.objectStore('files').put(blob, key)
    tx.oncomplete = res
    tx.onerror = () => rej(tx.error)
  })
}
async function idbGet(key: string): Promise<Blob | undefined> {
  const db = await idb()
  return new Promise((res) => {
    const req = db.transaction('files').objectStore('files').get(key)
    req.onsuccess = () => res(req.result as Blob | undefined)
    req.onerror = () => res(undefined)
  })
}
async function idbDelete(key: string) {
  const db = await idb()
  db.transaction('files', 'readwrite').objectStore('files').delete(key)
}
