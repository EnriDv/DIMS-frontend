// src/components/eventos/BotonSuscripcion.tsx
import { useState, useEffect } from 'react'
import { useSuscribirEvento, useEventosSuscritos } from '@/hooks/useEventos'
import { isAuthenticated } from '@/stores/auth'
import { withQueryClient } from '@/lib/queryClient'

interface Props {
  eventoId: number
}

function BotonSuscripcion({ eventoId }: Props) {
  const suscripcion = useSuscribirEvento()
  const loggedIn = isAuthenticated()

  // Consultar las suscripciones del usuario sólo si está autenticado
  const { data: suscritos } = useEventosSuscritos()
  const [inscritoLocal, setInscritoLocal] = useState(false)

  // Sincronizar inscritoLocal si el backend dice que ya está inscrito
  useEffect(() => {
    if (suscritos && Array.isArray(suscritos)) {
      const yaInscrito = suscritos.some((e) => e.id === eventoId)
      if (yaInscrito) {
        setInscritoLocal(true)
      }
    }
  }, [suscritos, eventoId])

  const handleSuscripcion = async () => {
    if (!loggedIn) {
      const { $refreshToken } = await import('@/stores/auth')
      if (!$refreshToken.get()) {
        window.location.href = '/login?error=unauthorized'
        return
      }
    }

    suscripcion.mutate(eventoId, {
      onSuccess: () => {
        setInscritoLocal(true)
      },
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : 'No se pudo realizar la suscripción'
        alert(msg)
      },
    })
  }

  if (inscritoLocal) {
    return (
      <button className="w-full rounded-xl bg-green-500 py-4 text-sm font-black tracking-widest text-white uppercase shadow-lg flex items-center justify-center gap-2 cursor-default">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
        INSCRITO_CON_ÉXITO
      </button>
    )
  }

  return (
    <button
      onClick={handleSuscripcion}
      disabled={suscripcion.isPending}
      className={`w-full rounded-xl py-4 text-sm font-black tracking-widest text-white uppercase transition-all shadow-md hover:-translate-y-1 
        ${suscripcion.isPending ? 'bg-slate-400' : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-200'}`}
    >
      {suscripcion.isPending ? 'PROCESANDO_PETICIÓN...' : 'INSCRIBIRSE_AL_EVENTO'}
    </button>
  )
}

export default withQueryClient(BotonSuscripcion)
