// frontend/src/lib/api/materias.service.ts
import { api } from './client'
import type { Materia } from '@/types'

export const materiasService = {
  getMalla: async (carreraId: number): Promise<Materia[]> => {
    return api.get<Materia[]>(`/Carreras/${carreraId}/malla`)
  },

  getById: async (id: number): Promise<Materia> => {
    return api.get<Materia>(`/Materias/${id}`)
  },
}