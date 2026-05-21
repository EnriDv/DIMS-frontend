// src/components/materias/MateriasPreview.tsx
import { useMallaCurricular } from '@/hooks/useMaterias'
import MateriaCard from './MateriaCard'
import { useEffect, useState } from 'react'
import { $carreras } from '@/stores/carreras'
import { useStore } from '@nanostores/react'
import { withQueryClient } from '@/lib/queryClient'

interface Props {
  carreraSlug: string
  limit?: number
}

function MateriasPreview({ carreraSlug, limit = 3 }: Props) {
  const carreras = useStore($carreras)
  const [carreraId, setCarreraId] = useState<number | null>(null)

  // Encontramos el ID de la carrera basándonos en el slug de la URL
  useEffect(() => {
    const carrera = carreras.find((c) => c.slug === carreraSlug)
    if (carrera) {
      setCarreraId(carrera.id)
    }
  }, [carreras, carreraSlug])

  // Usamos el ID para pedir la malla curricular a .NET
  const { data: materias, isLoading } = useMallaCurricular(carreraId)

  if (isLoading || !carreraId) {
    return (
      <div className="grid md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    )
  }

  if (!materias || materias.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
        <p className="text-slate-500 font-medium">No hay materias registradas para esta carrera.</p>
      </div>
    )
  }

  const preview = materias.slice(0, limit)

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {preview.map((materia) => (
          <MateriaCard key={materia.id} materia={materia} />
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex justify-between items-center">
        <div className="text-sm font-bold text-indigo-700 uppercase tracking-widest">
          Plan_Estudios_Sincronizado
        </div>
        <div className="text-xs font-medium text-indigo-500">
          Total: {materias.length} materias detectadas
        </div>
      </div>
    </div>
  )
}

export default withQueryClient(MateriasPreview)