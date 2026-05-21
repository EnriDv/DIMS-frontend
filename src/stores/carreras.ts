// src/stores/carreras.ts
import { atom, computed } from 'nanostores'
import type { Carrera } from '@/types'
import { api } from '@/lib/api/client'

export const $carreras = atom<Carrera[]>([])
export const $carrerasLoading = atom<boolean>(false)

export async function fetchCarreras() {
  $carrerasLoading.set(true)
  try {
    const data = await api.get<Carrera[]>('/Carreras')
    $carreras.set(data)
  } catch (error) {
    console.error("Error cargando carreras:", error)
  } finally {
    $carrerasLoading.set(false)
  }
}

export function getCarreraBySlug(slug: string) {
  return computed($carreras, (carreras) => 
    carreras.find((c) => c.slug === slug)
  )
}

export const $carrerasActivas = computed($carreras, (carreras) =>
  carreras.filter((c) => c.activa !== false)
)