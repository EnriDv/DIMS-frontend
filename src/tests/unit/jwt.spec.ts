import { describe, it, expect } from 'vitest'
import { decodeJwtPayload, isTokenExpired, getUserRoleFromToken } from '@/lib/jwt'

// Helper to create a fake JWT with a payload
function createFakeJwt(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.`
}

describe('jwt utils', () => {
  it('decodes payload correctly', () => {
    const token = createFakeJwt({ sub: '123', role: 'admin', exp: Math.floor(Date.now() / 1000) + 60 })
    const payload = decodeJwtPayload(token)
    expect(payload).toBeTruthy()
    expect(payload?.sub).toBe('123')
    expect(payload?.role).toBe('admin')
  })

  it('detects expired token', () => {
    const token = createFakeJwt({ exp: Math.floor(Date.now() / 1000) - 3600 })
    expect(isTokenExpired(token)).toBe(true)
  })

  it('extracts role claim', () => {
    const token = createFakeJwt({ role: 'docente' })
    expect(getUserRoleFromToken(token)).toBe('docente')
  })
})
