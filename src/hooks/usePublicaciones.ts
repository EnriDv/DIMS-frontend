import { useQuery } from '@tanstack/react-query';
import { publicacionesService, type GetPublicacionesParams } from '@/lib/api/publicaciones.service';
import { isSSR } from '@/lib/isSSR';

export const publicacionesKeys = {
  all: ['publicaciones'] as const,
  list: (params?: GetPublicacionesParams) => [...publicacionesKeys.all, 'list', params] as const,
};

export function usePublicaciones(params?: GetPublicacionesParams) {
  if (isSSR()) return { data: [], isLoading: false };

  return useQuery({
    queryKey: publicacionesKeys.list(params),
    queryFn: () => publicacionesService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
}