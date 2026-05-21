// frontend/src/lib/api/eventos.service.ts
import { api } from './client'
import type { Evento } from '@/types'

export interface GetEventosParams {
  carreraId?: number | null
  proximos?: boolean
  admin?: boolean
}

export interface CreateEventoDto {
  titulo: string
  descripcion: string
  fechaEvento: string
  lugar: string
  tipo: string
  carreraId?: number | null
  capacidad: number
  imagenUrl?: string
}

export interface UpdateEventoDto {
  titulo: string
  descripcion?: string
  fechaEvento: string
  lugar: string
  tipo: string
  carreraId?: number | null
  imagenUrl?: string
  capacidad: number
  publicado: boolean
}

export const eventosService = {
  getAll: async (params?: GetEventosParams): Promise<Evento[]> => {
    const queryParams: Record<string, string> = {}
    if (params?.carreraId !== undefined && params?.carreraId !== null) {
      queryParams.carreraId = params.carreraId.toString()
    }
    if (params?.proximos) queryParams.proximos = 'true'

    const endpoint = params?.admin ? '/Eventos/admin' : '/Eventos'
    return api.get<Evento[]>(endpoint, queryParams)
  },

  getById: async (id: number): Promise<Evento> => {
    return api.get<Evento>(`/Eventos/${id}`)
  },

  create: async (data: CreateEventoDto): Promise<number> => {
    return api.post<number>('/Eventos', data)
  },

  update: async (id: number, data: UpdateEventoDto): Promise<void> => {
    return api.put<void>(`/Eventos/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/Eventos/${id}`)
  }
  ,
  suscribir: async (id: number): Promise<{ message: string }> => {
    return api.post<{ message: string }>(`/Eventos/${id}/suscribir`, {});
  },
}