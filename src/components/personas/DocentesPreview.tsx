// src/components/personas/DocentesPreview.tsx
import { usePersonas } from '@/hooks/usePersonas'
import { useEffect, useState } from 'react'
import { $carreras } from '@/stores/carreras'
import { useStore } from '@nanostores/react'
import { withQueryClient } from '@/lib/queryClient'

interface Props {
  carreraSlug: string
  limit?: number
}

function DocentesPreview({ carreraSlug, limit = 6 }: Props) {
  const carreras = useStore($carreras)
  const [carreraId, setCarreraId] = useState<number | null>(null)

  useEffect(() => {
    const carrera = carreras.find((c) => c.slug === carreraSlug)
    if (carrera) setCarreraId(carrera.id)
  }, [carreras, carreraSlug])

  // Pedimos a la API las personas de esta carrera
  const { data: personas, isLoading } = usePersonas(
    carreraId ? { carreraId } : undefined
  )

  if (isLoading || !carreraId) {
    return <div className="h-40 bg-slate-50 rounded-2xl animate-pulse" />
  }

  if (!personas || personas.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
        <p className="text-slate-500 font-medium">No hay docentes asignados a esta unidad.</p>
      </div>
    )
  }

  const preview = personas.slice(0, limit)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {preview.map((docente) => (
        <a 
          key={docente.id} 
          href={`/personas/${docente.id}`}
          className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-lg transition-all"
        >
          <div className="h-16 w-16 rounded-full bg-slate-100 overflow-hidden border-2 border-indigo-100">
            {docente.fotoUrl ? (
              <img src={docente.fotoUrl} alt={docente.nombre} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl">👨‍🏫</span>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{docente.nombre}</h4>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-tighter mt-1">{docente.rol}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

export default withQueryClient(DocentesPreview)