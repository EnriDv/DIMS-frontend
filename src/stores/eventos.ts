// frontend/src/stores/eventos.ts
import { atom, map, computed } from 'nanostores'
import type { Evento } from '@/types'

export const $eventosCache = map<Record<string, Evento[]>>({})
export const $eventosLoading = atom<boolean>(false)
export const $eventosError = atom<string | null>(null)

// ============================================
// Actions
// ============================================

export function setEventos(key: string, eventos: Evento[]) {
  $eventosCache.setKey(key, eventos)
}

export function addEvento(key: string, evento: Evento) {
  const current = $eventosCache.get()[key] || []
  $eventosCache.setKey(key, [evento, ...current])
}

export function updateEvento(key: string, id: number, updatedEvento: Partial<Evento>) {
  const current = $eventosCache.get()[key] || []
  $eventosCache.setKey(
    key,
    current.map((e) => (e.id === id ? { ...e, ...updatedEvento } : e))
  )
}

export function removeEvento(key: string, id: number) {
  const current = $eventosCache.get()[key] || []
  $eventosCache.setKey(
    key,
    current.filter((e) => e.id !== id)
  )
}

export function setEventosLoading(loading: boolean) {
  $eventosLoading.set(loading)
}

export function setEventosError(error: string | null) {
  $eventosError.set(error)
}

export function invalidateEventosCache(carreraSlug?: string | null) {
  if (carreraSlug) {
    const cache = $eventosCache.get()
    delete cache[carreraSlug]
    $eventosCache.set(cache)
  } else {
    $eventosCache.set({})
  }
}

// ============================================
// Computed
// ============================================

export function getEventosPorCarrera(carreraSlug: string | null) {
  return computed($eventosCache, (cache) => {
    const key = carreraSlug || 'all'
    return cache[key] || []
  })
}

export const $eventosProximos = computed($eventosCache, (cache) => {
  const allEventos = Object.values(cache).flat()
  const now = new Date()
  return allEventos
    .filter((e) => new Date(e.fechaEvento) > now)
    .sort((a, b) => new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime())
    .slice(0, 5)
})