// frontend/src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { authService, type LoginDto, type RegisterDto } from '@/lib/api/auth.service'
import { login, logout, setAuthError, setAuthLoading, setTokens } from '@/stores/auth'

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onMutate: () => {
      setAuthLoading(true)
      setAuthError(null)
    },
    onSuccess: (response) => {
      // MAPEAREMOS los datos planos del backend al objeto estructurado User
      const userData = {
        id: response.userId,
        nombre: response.nombre,
        email: response.email || '',
        rol: response.rol
      }

      // Guardamos ambos tokens
      login(userData, response.accessToken, response.refreshToken)
      setAuthError(null)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      setAuthError(message)
    },
    onSettled: () => {
      setAuthLoading(false)
    },
  })
}
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onMutate: () => {
      setAuthLoading(true)
      setAuthError(null)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario'
      setAuthError(message)
    },
    onSettled: () => {
      setAuthLoading(false)
    },
  })
}


export function useRefreshToken() {
  return useMutation({
    mutationFn: () => authService.refresh(),
    onSuccess: (response) => {
      // Actualizar ambos tokens sin afectar los datos del usuario
      setTokens(response.accessToken, response.refreshToken)
    },
    onError: () => {
      // Si el refresh falla, hacer logout
      logout()
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
    },
    onError: () => {
      // Forzamos el logout local incluso si el servidor falla
      logout()
    },
  })
}
