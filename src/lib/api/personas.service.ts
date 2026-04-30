// frontend/src/lib/api/personas.service.ts
import { api } from './client'
import type { Persona } from '@/types'

export interface GetPersonasParams {
  carreraId?: number | null
  rol?: string
}

export const personasService = {
  getAll: async (params?: GetPersonasParams): Promise<Persona[]> => {
    const queryParams: Record<string, string> = {}

    if (params?.carreraId) queryParams.carreraId = params.carreraId.toString()
    if (params?.rol) queryParams.rol = params.rol

    return api.get<Persona[]>('/Personas', queryParams)
  },

  getById: async (id: number): Promise<Persona> => {
    return api.get<Persona>(`/Personas/${id}`)
  },
}