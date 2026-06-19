import { isTokenExpired } from '@/lib/jwt'
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

function setServerAuthCookie(token: string) {
  if (typeof window === 'undefined') return

  const isHttps = window.location.protocol === 'https:'
  const secureAttr = isHttps ? '; Secure' : ''

  // biome-ignore lint/suspicious/noDocumentCookie: SSR auth requires cookie assignment
  document.cookie = `auth_token=${token}; Path=/; SameSite=Lax; max-age=86400${secureAttr}`
}

function clearServerAuthCookie() {
  if (typeof window === 'undefined') return

  const isHttps = window.location.protocol === 'https:'
  const secureAttr = isHttps ? '; Secure' : ''

  // biome-ignore lint/suspicious/noDocumentCookie: SSR auth requires cookie assignment
  document.cookie = `auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${secureAttr}`
}

export function login(user: User, accessToken: string, refreshToken: string) {
  $currentUser.set(user)
  $accessToken.set(accessToken)
  $refreshToken.set(refreshToken)
  $authError.set(null)
  setServerAuthCookie(accessToken)
}

export function logout() {
  $currentUser.set(null)
  $accessToken.set('')
  $refreshToken.set('')

  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  clearServerAuthCookie()
}

export function setAuthLoading(loading: boolean) { $authLoading.set(loading) }
export function setAuthError(error: string | null) { $authError.set(error) }

export function isAuthenticated(): boolean {
  const token = $accessToken.get()
  if (!token) return false
  return !isTokenExpired(token)
}

export function getAccessToken(): string {
  return $accessToken.get()
}

export function setTokens(accessToken: string, refreshToken: string) {
  $accessToken.set(accessToken)
  $refreshToken.set(refreshToken)
  setServerAuthCookie(accessToken)
}
