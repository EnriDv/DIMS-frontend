// frontend/src/hooks/useEventos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventosService, type GetEventosParams, type CreateEventoDto, type UpdateEventoDto } from '@/lib/api/eventos.service'
import { setEventos, setEventosLoading, setEventosError } from '@/stores/eventos'
import { isSSR } from '@/lib/isSSR'

export const eventosKeys = {
  all: ['eventos'] as const,
  lists: () => [...eventosKeys.all, 'list'] as const,
  list: (params?: GetEventosParams) => [...eventosKeys.lists(), params] as const,
  details: () => [...eventosKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventosKeys.details(), id] as const,
}

export function useEventos(params?: GetEventosParams) {
  // En SSR, retornar valores por defecto
  if (isSSR()) {
    return {
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isFetching: false,
    }
  }

  return useQuery({
    queryKey: eventosKeys.list(params),
    queryFn: async () => {
      setEventosLoading(true)
      try {
        const eventos = await eventosService.getAll(params)
        
        const key = params?.carreraId?.toString() || 'all'
        setEventos(key, eventos)
        setEventosError(null)
        
        return eventos
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al cargar eventos'
        setEventosError(message)
        throw error
      } finally {
        setEventosLoading(false)
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useEvento(id: number) {
  // En SSR, retornar valores por defecto
  if (isSSR()) {
    return {
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      isPending: false,
      isFetching: false,
    }
  }

  return useQuery({
    queryKey: eventosKeys.detail(id),
    queryFn: () => eventosService.getById(id),
    enabled: id > 0,
  })
}

export function useEventosSuscritos() {
  if (isSSR()) {
    return {
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    }
  }

  return useQuery({
    queryKey: ['eventos', 'suscritos'],
    queryFn: () => eventosService.getSuscritos(),
  })
}

// ============================================
// Mutations
// ============================================

export function useCreateEvento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEventoDto) => eventosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() })
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al crear evento'
      setEventosError(message)
    },
  })
}

export function useUpdateEvento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventoDto }) =>
      eventosService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() })
      queryClient.invalidateQueries({ queryKey: eventosKeys.detail(variables.id) })
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar evento'
      setEventosError(message)
    },
  })
}

export function useDeleteEvento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => eventosService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: eventosKeys.lists() })

      const previousLists = queryClient.getQueriesData({ queryKey: eventosKeys.lists() })

      queryClient.setQueriesData({ queryKey: eventosKeys.lists() }, (old: any) => {
        if (!Array.isArray(old)) return old
        return old.filter((e: any) => e.id !== id)
      })

      return { previousLists }
    },
    onError: (error, id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      
      const message = error instanceof Error ? error.message : 'Error al eliminar evento'
      setEventosError(message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: eventosKeys.lists() })
    },
  })
}

export function useSuscribirEvento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => eventosService.suscribir(id),
    onSuccess: (_, id) => {
      // Refrescamos el detalle de este evento específico para ver el nuevo contador
      queryClient.invalidateQueries({ queryKey: ['eventos', 'detail', id] })
      // También invalidamos la lista de suscritos del usuario
      queryClient.invalidateQueries({ queryKey: ['eventos', 'suscritos'] })
    }
  })
}
