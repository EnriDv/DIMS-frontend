import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MisEventosSuscritos from '@/components/eventos/MisEventosSuscritos'
import { queryClient } from '@/lib/queryClient'
import { $accessToken, $refreshToken, $currentUser } from '@/stores/auth'

vi.mock('@/lib/api/eventos.service', () => ({
  eventosService: {
    getSuscritos: vi.fn().mockImplementation(() => Promise.resolve([
      {
        id: 10,
        titulo: 'Evento de Prueba Suscrito',
        descripcionCorta: 'Descripción corta',
        descripcion: 'Descripción completa',
        fechaEvento: new Date(Date.now() + 86400000).toISOString(),
        lugar: 'Aula 202',
        tipo: 'workshop',
        capacidad: 20,
        inscritos: 1
      }
    ]))
  }
}))

function Wrapped() {
  const Comp = (MisEventosSuscritos as any).default || MisEventosSuscritos
  return queryClient && <Comp />
}

describe('MisEventosSuscritos behavior', () => {
  beforeEach(() => {
    $currentUser.set(null)
    $accessToken.set('')
    $refreshToken.set('')
    queryClient.clear()
  })

  it('renders nothing when user is unauthenticated', () => {
    const { container } = render(<Wrapped />)
    expect(container.firstChild).toBeNull()
  })

  it('renders subscribed events when user is authenticated', async () => {
    $currentUser.set({ id: '1', email: 'test@ucb.com', nombre: 'Test Student', rol: 'estudiante' })
    const createFakeJwt = (payload: Record<string, unknown>) => {
      const header = Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')
      const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
      return `${header}.${body}.`
    }
    const token = createFakeJwt({ sub: '1', exp: Math.floor(Date.now() / 1000) + 600 })
    $accessToken.set(token)

    render(<Wrapped />)

    // Wait for the query to resolve and content to render
    await new Promise((r) => setTimeout(r, 100))

    expect(screen.getByText('Evento de Prueba Suscrito')).toBeDefined()
    expect(screen.getByText('Aula 202')).toBeDefined()
  })
})
