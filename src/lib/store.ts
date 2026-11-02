import { useSyncExternalStore } from 'react'
import type { AppState } from './types'
import { STATE_VERSION, createSeedState } from './seed'

const STORAGE_KEY = 'pixeldrive.app.v1'

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.version === STATE_VERSION) return parsed
    }
  } catch {
    // Storage blocked or corrupted: fall back to a fresh seeded state.
  }
  return createSeedState()
}

let state: AppState = load()
const listeners = new Set<() => void>()

function emit(): void {
  listeners.forEach((listener) => listener())
}

function persist(next: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Persistence is best-effort; the in-memory state keeps the app working.
  }
}

/** Another tab (e.g. the operator's) wrote new data: pick it up so both screens stay live. */
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return
  state = load()
  emit()
})

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, () => state)
}

export function update(change: (current: AppState) => AppState): void {
  state = change(state)
  persist(state)
  emit()
}

export function resetSampleData(): void {
  update(() => createSeedState())
}
