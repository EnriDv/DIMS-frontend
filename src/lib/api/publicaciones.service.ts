import { api } from './client';
import type { Publicacion } from '@/types';

export interface GetPublicacionesParams {
  carreraId?: number | null;
  tipo?: string;
}

export const publicacionesService = {
  getAll: async (params?: GetPublicacionesParams): Promise<Publicacion[]> => {
    const queryParams: Record<string, string> = {};
    if (params?.carreraId) queryParams.carreraId = params.carreraId.toString();
    if (params?.tipo) queryParams.tipo = params.tipo;

    return api.get<Publicacion[]>('/Publicaciones', queryParams);
  },

  getById: async (id: number): Promise<Publicacion> => {
    return api.get<Publicacion>(`/Publicaciones/${id}`);
  }
};