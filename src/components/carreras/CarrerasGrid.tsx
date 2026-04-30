// src/components/carreras/CarrerasGrid.tsx
import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import type { Carrera } from '@/types'
import CarreraSkeleton from './CarreraSkeleton'
import { withQueryClient } from '@/lib/queryClient'

function CarrerasGrid() {
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Carrera[]>('/Carreras')
      .then(setCarreras)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <CarreraSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {carreras.map((carrera) => (
        <a
          key={carrera.id}
          href={`/carreras/${carrera.slug}`}
          className="group glass-card relative block overflow-hidden p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-lg lg:p-10 bg-white"
        >
          <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-indigo-50 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
            <div className="text-6xl transition-transform duration-500 group-hover:scale-110">
              {carrera.icono || '🎓'}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <h4 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                  {carrera.nombre}
                </h4>
                <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600 uppercase font-semibold">
                  {carrera.duracion || 'N/A'}
                </span>
              </div>
              <p className="line-clamp-2 max-w-2xl text-slate-600">
                {carrera.descripcion}
              </p>
            </div>
            <div className="text-slate-400 transition-colors group-hover:text-indigo-600">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export default withQueryClient(CarrerasGrid)