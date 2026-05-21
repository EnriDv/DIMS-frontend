// frontend/src/stores/noticias.ts
import { atom, map, computed } from 'nanostores'
import type { Noticia } from '@/types'

/**
 * Cache de noticias por carrera
 * Estructura: { 'all': Noticia[], 'ia': Noticia[], 'software': Noticia[] }
 */
export const $noticiasCache = map<Record<string, Noticia[]>>({})

/**
 * Estado de carga
 */
export const $noticiasLoading = atom<boolean>(false)

/**
 * Error
 */
export const $noticiasError = atom<string | null>(null)

// ============================================
// Actions
// ============================================

export function setNoticias(key: string, noticias: Noticia[]) {
  $noticiasCache.setKey(key, noticias)
}

export function addNoticia(key: string, noticia: Noticia) {
  const current = $noticiasCache.get()[key] || []
  $noticiasCache.setKey(key, [noticia, ...current])
}

export function updateNoticia(key: string, id: number, updatedNoticia: Partial<Noticia>) {
  const current = $noticiasCache.get()[key] || []
  $noticiasCache.setKey(
    key,
    current.map((n) => (n.id === id ? { ...n, ...updatedNoticia } : n))
  )
}

export function removeNoticia(key: string, id: number) {
  const current = $noticiasCache.get()[key] || []
  $noticiasCache.setKey(
    key,
    current.filter((n) => n.id !== id)
  )
}

export function setNoticiasLoading(loading: boolean) {
  $noticiasLoading.set(loading)
}

export function setNoticiasError(error: string | null) {
  $noticiasError.set(error)
}

export function invalidateNoticiasCache(carreraSlug?: string | null) {
  if (carreraSlug) {
    const cache = $noticiasCache.get()
    delete cache[carreraSlug]
    $noticiasCache.set(cache)
  } else {
    $noticiasCache.set({})
  }
}

// ============================================
// Computed
// ============================================

export function getNoticiasPorCarrera(carreraSlug: string | null) {
  return computed($noticiasCache, (cache) => {
    const key = carreraSlug || 'all'
    return cache[key] || []
  })
}