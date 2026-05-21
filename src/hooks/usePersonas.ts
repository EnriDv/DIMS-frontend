// frontend/src/hooks/usePersonas.ts
import { useQuery } from '@tanstack/react-query'
import { personasService, type GetPersonasParams } from '@/lib/api/personas.service'
import { isSSR } from '@/lib/isSSR'

export const personasKeys = {
  all: ['personas'] as const,
  lists: () => [...personasKeys.all, 'list'] as const,
  list: (params?: GetPersonasParams) => [...personasKeys.lists(), params] as const,
  details: () => [...personasKeys.all, 'detail'] as const,
  detail: (id: number) => [...personasKeys.details(), id] as const,
}

export function usePersonas(params?: GetPersonasParams) {
  if (isSSR()) {
    return { data: [], isLoading: false, isError: false, error: null }
  }

  return useQuery({
    queryKey: personasKeys.list(params),
    queryFn: () => personasService.getAll(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function usePersona(id: number) {
  if (isSSR()) {
    return { data: undefined, isLoading: false, isError: false, error: null }
  }

  return useQuery({
    queryKey: personasKeys.detail(id),
    queryFn: () => personasService.getById(id),
    enabled: id > 0,
    staleTime: 10 * 60 * 1000,
  })
}