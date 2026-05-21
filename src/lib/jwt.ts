// frontend/src/lib/jwt.ts

/**
 * Decodifica de forma segura un JWT sin usar librerías de terceros (isomórfico: cliente y servidor)
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    // Función segura para decodificar base64 en SSR (Node) o Cliente (Browser)
    const jsonPayload =
      typeof window === 'undefined'
        ? Buffer.from(base64, 'base64').toString('utf-8')
        : decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map((c) => {
              return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`
            })
            .join('')
        )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export function getUserRoleFromToken(token: string): string | null {
  const payload = decodeJwtPayload(token)
  // Dependiendo de cómo genere el token .NET, el rol puede venir en este claim
  return (
    (payload?.role as string) ||
    (payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as string) ||
    null
  )
}

/**
 * Comprueba si un JWT ya venció según el claim "exp" del payload.
 * Devuelve true si expiró o no se puede leer.
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true
  const payload = decodeJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return true
  // exp es en segundos Unix; dejamos un margen de 10 seg para evitar race conditions
  return payload.exp * 1000 < Date.now() - 10_000
}
