// frontend/src/hooks/useNoticias.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { noticiasService, type GetNoticiasParams, type CreateNoticiaDto, type UpdateNoticiaDto } from '@/lib/api/noticias.service'
import { setNoticias, setNoticiasLoading, setNoticiasError } from '@/stores/noticias'
import { isSSR } from '@/lib/isSSR'
import type { Noticia } from '@/types'

export const noticiasKeys = {
  all: ['noticias'] as const,
  lists: () => [...noticiasKeys.all, 'list'] as const,
  list: (params?: GetNoticiasParams) => [...noticiasKeys.lists(), params] as const,
  details: () => [...noticiasKeys.all, 'detail'] as const,
  detail: (id: number) => [...noticiasKeys.details(), id] as const,
}

export function useNoticias(params?: GetNoticiasParams) {
  if (isSSR()) {
    return { data: [], isLoading: false, isError: false, error: null }
  }

  return useQuery({
    queryKey: noticiasKeys.list(params),
    queryFn: async () => {
      setNoticiasLoading(true)
      try {
        const noticias = await noticiasService.getAll(params)
        const key = params?.carreraId ? params.carreraId.toString() : 'all'
        setNoticias(key, noticias)
        setNoticiasError(null)
        return noticias
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al cargar noticias'
        setNoticiasError(message)
        throw error
      } finally {
        setNoticiasLoading(false)
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useNoticia(id: number) {
  if (isSSR()) {
    return { data: undefined, isLoading: false, isError: false, error: null }
  }

  return useQuery({
    queryKey: noticiasKeys.detail(id),
    queryFn: () => noticiasService.getById(id),
    enabled: id > 0,
  })
}

export function useCreateNoticia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateNoticiaDto) => noticiasService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() }),
  })
}

export function useUpdateNoticia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoticiaDto }) => noticiasService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() })
      queryClient.invalidateQueries({ queryKey: noticiasKeys.detail(variables.id) })
    },
  })
}

export function useDeleteNoticia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => noticiasService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noticiasKeys.lists() })
  })
}