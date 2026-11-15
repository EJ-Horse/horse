import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { setCurrentUser, startStore, stopStore, useStoreStatus } from './lib/store'
import { seedIfNeeded } from './lib/starter'
import { go, useRoute } from './lib/router'
import { Lock, NewPasscode, NotConfigured } from './screens/Lock'
import { Home, HorseHub, NamePrompt, RiderHub } from './screens/Home'
import { Health } from './screens/Health'
import { Photos, PhotoTimeline } from './screens/Photos'
import { Nutrition } from './screens/Nutrition'
import { Beautify } from './screens/Beautify'
import { Shopping } from './screens/Shopping'
import { Costs } from './screens/Costs'
import { Skills, Tips } from './screens/Skills'
import { Coach } from './screens/Coach'
import { Fears, Weekly } from './screens/Weekly'
import { Tricks } from './screens/Tricks'
import type { BodyPart } from './lib/types'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null)
  const [needsName, setNeedsName] = useState(false)
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    if (!supabase) {
      void startStore()
      return
    }
    void supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      setSession(s)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) return
    setCurrentUser(session.user.id)
    void startStore()
    void supabase
      .from('people')
      .select('name')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setNeedsName(!data))
    return () => {
      setCurrentUser(null)
      stopStore()
    }
  }, [session])

  if (!supabase && import.meta.env.PROD) return <NotConfigured />
  if (supabase && session === undefined) return <div className="splash">🐴</div>
  if (supabase && recovering) return <NewPasscode onDone={() => setRecovering(false)} />
  if (supabase && !session) return <Lock />
  if (session && needsName) return <NamePrompt userId={session.user.id} onDone={() => setNeedsName(false)} />
  return <Shell />
}

function Shell() {
  const route = useRoute()
  const { status, items, errorMessage } = useStoreStatus()
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    if (status === 'ready' && !seeded) {
      setSeeded(true)
      void seedIfNeeded(items)
    }
  }, [status, seeded, items])

  const section = route.split('/')[0]
  return (
    <div className="app">
      {!supabase && <div className="preview-banner">Preview mode: data is saved on this device only.</div>}
      {status === 'loading' && <div className="splash">🐴</div>}
      {status === 'error' && (
        <div className="card warn" style={{ margin: 16 }}>
          Couldn’t load data: {errorMessage}
        </div>
      )}
      {status === 'ready' && <Page route={route} />}
      <nav className="tabbar">
        {[
          ['home', '🏠', 'Home'],
          ['horse', '🐴', 'Horse'],
          ['rider', '🏇', 'Rider'],
        ].map(([to, icon, label]) => (
          <button key={to} className={section === to ? 'on' : ''} onClick={() => go(to)} aria-current={section === to ? 'page' : undefined}>
            <span aria-hidden>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

function Page({ route }: { route: string }) {
  const parts = route.split('/').map(decodeURIComponent)
  const [section, page, sub, extra] = parts
  if (section === 'horse') {
    if (page === 'health') return <Health />
    if (page === 'photos' && sub === 'issue' && extra) return <PhotoTimeline issue={extra} />
    if (page === 'photos' && sub) return <PhotoTimeline part={sub as BodyPart} />
    if (page === 'photos') return <Photos />
    if (page === 'nutrition') return <Nutrition />
    if (page === 'beautify') return <Beautify />
    if (page === 'shopping') return <Shopping />
    if (page === 'costs') return <Costs />
    return <HorseHub />
  }
  if (section === 'rider') {
    if (page === 'skills') return <Skills />
    if (page === 'tips') return <Tips />
    if (page === 'coach') return <Coach />
    if (page === 'weekly') return <Weekly />
    if (page === 'fears') return <Fears />
    if (page === 'tricks') return <Tricks />
    return <RiderHub />
  }
  return <Home />
}
