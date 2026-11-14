import { useSyncExternalStore } from 'react'

/** Hash routes like #/horse/health, so the phone's back button works. */
function current() {
  return location.hash.replace(/^#\/?/, '') || 'home'
}

function subscribe(l: () => void) {
  window.addEventListener('hashchange', l)
  return () => window.removeEventListener('hashchange', l)
}

export function useRoute(): string {
  return useSyncExternalStore(subscribe, current)
}

export function go(path: string) {
  location.hash = '/' + path
  window.scrollTo(0, 0)
}
