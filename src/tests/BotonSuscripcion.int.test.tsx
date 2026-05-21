import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BotonSuscripcion from '@/components/eventos/BotonSuscripcion'
import { queryClient } from '@/lib/queryClient'
import { $accessToken, $refreshToken, $currentUser } from '@/stores/auth'

vi.mock('@/lib/api/eventos.service', () => ({
  eventosService: {
    suscribir: vi.fn().mockImplementation((id: number) => Promise.resolve({ success: true }))
  }
}))

// Use the HOC wrapper to provide QueryClient
function Wrapped(props: any) {
  const Comp = (BotonSuscripcion as any).default || BotonSuscripcion
  return queryClient && <Comp {...props} />
}

describe('BotonSuscripcion integration', () => {
  beforeEach(() => {
    // Clear auth
    $currentUser.set(null)
    $accessToken.set('')
    $refreshToken.set('')
  })

  it('redirects to login when unauthenticated and no refresh token', async () => {
    render(<BotonSuscripcion eventoId={1} />)
    const btn = screen.getByRole('button')
    // Mock window.location
    const orig = window.location
    // @ts-ignore
    delete (window as any).location
    // @ts-ignore
    window.location = { href: '' }

    fireEvent.click(btn)
    // Wait a tick
    await new Promise((r) => setTimeout(r, 10))
    expect(window.location.href).toContain('/login')

    ;(window as any).location = orig
  })

  it('calls suscribir when authenticated', async () => {
    $currentUser.set({ id: '1', email: 'a@a', nombre: 'Test', rol: 'estudiante' })
    // create a fake jwt with future exp
    const createFakeJwt = (payload: Record<string, unknown>) => {
      const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')
      const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
      return `${header}.${body}.`
    }
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) + 60 })
    $accessToken.set(token)

    render(<BotonSuscripcion eventoId={42} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)

    // Wait for mutation to settle
    await new Promise((r) => setTimeout(r, 50))

    const { eventosService } = (await import('@/lib/api/eventos.service')) as any
    expect(eventosService.suscribir).toHaveBeenCalledWith(42)
  })
})
