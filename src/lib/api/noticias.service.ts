// frontend/src/lib/api/noticias.service.ts
import { api } from './client'
import type { Noticia } from '@/types'

export interface GetNoticiasParams {
  carreraId?: number | null
  limit?: number
  destacadas?: boolean
  admin?: boolean
}

export interface CreateNoticiaDto {
  titulo: string
  contenido: string
  carreraId?: number | null
  imagenUrl?: string
  publicada?: boolean
  destacada?: boolean
}

export interface UpdateNoticiaDto extends Partial<CreateNoticiaDto> {}

export const noticiasService = {
  getAll: async (params?: GetNoticiasParams): Promise<Noticia[]> => {
    const queryParams: Record<string, string> = {}
    
    // El backend en C# espera 'carreraId', no 'carreraSlug'
    if (params?.carreraId !== undefined && params?.carreraId !== null) {
      queryParams.carreraId = params.carreraId.toString()
    }
    if (params?.destacadas) queryParams.destacadas = 'true'

    const endpoint = params?.admin ? '/Noticias/admin' : '/Noticias'
    return api.get<Noticia[]>(endpoint, queryParams)
  },

  getById: async (id: number): Promise<Noticia> => {
    return api.get<Noticia>(`/Noticias/${id}`)
  },

  create: async (data: CreateNoticiaDto): Promise<{ id: number; message: string }> => {
    return api.post<{ id: number; message: string }>('/Noticias', data)
  },

  update: async (id: number, data: UpdateNoticiaDto): Promise<void> => {
    return api.put<void>(`/Noticias/${id}`, data)
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/Noticias/${id}`)
  },
}