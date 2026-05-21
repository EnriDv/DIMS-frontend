// frontend/src/lib/api/client.ts
import { $accessToken, $refreshToken, logout, setTokens } from '@/stores/auth'

const PUBLIC_API_URL = import.meta.env.PUBLIC_API_URL?.trim()
const INTERNAL_API_URL = (
  import.meta.env.SSR
    ? (process.env.INTERNAL_API_URL ?? import.meta.env.INTERNAL_API_URL)
    : undefined
)?.trim()

const API_BASE_URL = import.meta.env.SSR ? INTERNAL_API_URL || PUBLIC_API_URL : PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('Missing API URL. Set PUBLIC_API_URL (and INTERNAL_API_URL for SSR in Docker).')
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Lock para evitar múltiples refresh simultáneos
let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  // Si ya hay un refresh en progreso, esperar a que termine
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = $refreshToken.get()
      if (!refreshToken) {
        logout()
        return false
      }

      const response = await fetch(`${API_BASE_URL}/Auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        logout()
        return false
      }

      const data = await response.json()
      setTokens(data.accessToken, data.refreshToken)
      return true
    } catch (error) {
      console.error('Error al refrescar token:', error)
      logout()
      return false
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

async function handleResponse<T>(response: Response, retryFn?: () => Promise<Response>): Promise<T> {
  // Si es 401, intentar refresh y reintentar la petición original
  if (response.status === 401) {
    const refreshed = await refreshAccessToken()

    if (!refreshed) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login?error=unauthorized'
      }
      throw new ApiError(response.status, 'No autorizado')
    }

    // Refresh exitoso: reintentar la petición original con el nuevo token
    if (retryFn) {
      const retryResponse = await retryFn()
      return handleResponse<T>(retryResponse) // sin retryFn para evitar loop infinito
    }

    throw new ApiError(401, 'No autorizado. Por favor, recarga la página.')
  }

  if (response.status === 403) {
    if (typeof window !== 'undefined') {
      logout()
      window.location.href = '/login?error=unauthorized'
    }
    throw new ApiError(response.status, 'No tienes permisos')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`, errorData)
  }

  if (response.status === 204) return null as T
  return response.json()
}

// Interceptor para inyectar Token en headers
function getHeaders(customHeaders?: HeadersInit): HeadersInit {
  const token = $accessToken.get()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  }
}

export const api = {
  get: async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) url.searchParams.append(key, value)
      })
    }
    const makeRequest = () => fetch(url.toString(), { headers: getHeaders() })
    const response = await makeRequest()
    return handleResponse<T>(response, makeRequest)
  },

  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    const makeRequest = () =>
      fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      })
    const response = await makeRequest()
    return handleResponse<T>(response, makeRequest)
  },

  put: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const makeRequest = () =>
      fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      })
    const response = await makeRequest()
    return handleResponse<T>(response, makeRequest)
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const makeRequest = () =>
      fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
    const response = await makeRequest()
    return handleResponse<T>(response, makeRequest)
  },
}
