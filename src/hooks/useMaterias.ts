// frontend/src/hooks/useMaterias.ts
import { useQuery } from '@tanstack/react-query'
import { materiasService } from '@/lib/api/materias.service'
import { isSSR } from '@/lib/isSSR'

export const materiasKeys = {
  all: ['materias'] as const,
  malla: (carreraId: number) => [...materiasKeys.all, 'malla', carreraId] as const,
  detail: (id: number) => [...materiasKeys.all, 'detail', id] as const,
}

export function useMallaCurricular(carreraId?: number | null) {
  if (isSSR()) return { data: [], isLoading: false, isError: false, error: null }
  
  return useQuery({
    queryKey: carreraId ? materiasKeys.malla(carreraId) : materiasKeys.all,
    queryFn: async () => {
      if (!carreraId) return []
      return materiasService.getMalla(carreraId)
    },
    enabled: !!carreraId, // Solo dispara la query si hay un ID válido
    staleTime: 10 * 60 * 1000,
  })
}

export function useMateria(id: number) {
  if (isSSR()) return { data: undefined, isLoading: false, isError: false, error: null }
  
  return useQuery({
    queryKey: materiasKeys.detail(id),
    queryFn: () => materiasService.getById(id),
    enabled: id > 0,
    staleTime: 10 * 60 * 1000,
  })
}