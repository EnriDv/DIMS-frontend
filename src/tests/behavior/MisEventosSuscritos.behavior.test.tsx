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
    $accessToken.set('fake-token')

    render(<Wrapped />)

    expect(await screen.findByText('Evento de Prueba Suscrito')).toBeDefined()
    expect(screen.getByText('Aula 202')).toBeDefined()
  })
})
