// frontend/src/lib/api/auth.service.ts
import { api } from './client'
import type { User } from '@/types'
import { $refreshToken } from '@/stores/auth'

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userId: string
  nombre: string
  rol: 'admin' | 'docente' | 'estudiante'
  email?: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export const authService = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/Auth/login', credentials)
  },

  refresh: async (): Promise<RefreshResponse> => {
    const refreshToken = $refreshToken.get()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    return api.post<RefreshResponse>('/Auth/refresh', { refreshToken })
  },

  logout: async (): Promise<void> => {
    try {
      await api.post<void>('/Auth/logout')
    } catch (e) {
      console.warn("Logout en servidor no disponible, procediendo con limpieza local.")
    }
  },
}