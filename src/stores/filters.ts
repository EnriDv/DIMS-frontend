// frontend/src/stores/filters.ts
import { atom } from 'nanostores'

/**
 * Carrera actualmente seleccionada
 */
export const $carreraActiva = atom<string | null>(null)

/**
 * Query de búsqueda
 */
export const $searchQuery = atom<string>('')

// ============================================
// Actions
// ============================================

export function setCarreraActiva(slug: string | null) {
  $carreraActiva.set(slug)
}

export function clearCarreraActiva() {
  $carreraActiva.set(null)
}

export function setSearchQuery(query: string) {
  $searchQuery.set(query)
}

export function clearSearch() {
  $searchQuery.set('')
}