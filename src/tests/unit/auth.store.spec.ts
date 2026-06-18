import { describe, it, expect, beforeEach } from 'vitest'
import { login, logout, isAuthenticated, setTokens, $accessToken, $currentUser } from '@/stores/auth'

// Helper to create a minimal fake JWT with a payload and future exp
function createFakeJwt(payload: Record<string, unknown>) {
  const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.`
}

beforeEach(() => {
  // Reset persistent atoms
  $currentUser.set(null)
  $accessToken.set('')
})

describe('auth store', () => {
  it('login sets user and tokens', () => {
    const user = { id: '1', email: 'a@a.com', nombre: 'Test User', rol: 'estudiante' }
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) + 60 })
    login(user as any, token, token)
    expect($currentUser.get()).toEqual(user)
    expect($accessToken.get()).toBe(token)
    expect(isAuthenticated()).toBe(true)
  })

  it('logout clears data', () => {
    const user = { id: '1', email: 'a@a.com', nombre: 'Test User', rol: 'estudiante' }
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) + 60 })
    login(user as any, token, token)
    logout()
    expect($currentUser.get()).toBeNull()
    expect($accessToken.get()).toBe('')
    expect(isAuthenticated()).toBe(false)
  })

  it('setTokens updates access token', () => {
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) + 60 })
    setTokens(token, token)
    expect($accessToken.get()).toBe(token)
  })
})
