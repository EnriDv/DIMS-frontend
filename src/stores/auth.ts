// frontend/src/stores/auth.ts
import { atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'

export interface User {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'docente' | 'estudiante'
}

export const $currentUser = persistentAtom<User | null>(
  'currentUser',
  null,
  {
    encode: JSON.stringify,
    decode: (str) => {
      try { return JSON.parse(str) } catch { return null }
    },
  }
)

// Access Token (15 min, para acceder a recursos)
export const $accessToken = persistentAtom<string>('accessToken', '')

// Refresh Token (7 días, solo para renovar el access token)
export const $refreshToken = persistentAtom<string>('refreshToken', '')

export const $authLoading = atom<boolean>(false)
export const $authError = atom<string | null>(null)

export function login(user: User, accessToken: string, refreshToken: string) {
  $currentUser.set(user)
  $accessToken.set(accessToken)
  $refreshToken.set(refreshToken)
  $authError.set(null)
}

export function logout() {
  $currentUser.set(null)
  $accessToken.set('')
  $refreshToken.set('')
  // Limpieza total del storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export function setAuthLoading(loading: boolean) { $authLoading.set(loading) }
export function setAuthError(error: string | null) { $authError.set(error) }

export function isAuthenticated(): boolean {
  const token = $accessToken.get()
  return token !== null && token !== ''
}

export function getAccessToken(): string {
  return $accessToken.get()
}

export function setTokens(accessToken: string, refreshToken: string) {
  $accessToken.set(accessToken)
  $refreshToken.set(refreshToken)
}
