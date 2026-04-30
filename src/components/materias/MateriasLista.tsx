import { useStore } from '@nanostores/react'
import { $carreraActiva } from '@/stores/filters'
import { $carreras } from '@/stores/carreras'
import { useMallaCurricular } from '@/hooks/useMaterias'
import MateriaCard from './MateriaCard'
import ErrorMessage from '../ui/ErrorMessage'
import { withQueryClient } from '@/lib/queryClient'

function MateriasLista() {
  const carreraActivaSlug = useStore($carreraActiva)
  const carreras = useStore($carreras)
  const carreraSeleccionada = carreras.find(c => c.slug === carreraActivaSlug)
  const carreraId = carreraSeleccionada?.id || null

  const { data: materias, isLoading, isError, error } = useMallaCurricular(carreraId)

  if (!carreraId) return <div className="text-center p-20 bg-white rounded-2xl">Selecciona una carrera</div>
  if (isLoading) return <div className="animate-pulse">Cargando...</div>
  if (isError) return <ErrorMessage message="Error" />

  const porSemestre = (materias || []).reduce((acc, m) => {
    const sem = m.semestre || 0;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(m);
    return acc;
  }, {} as any);

  return (
    <div className="space-y-12">
      {Object.keys(porSemestre).map(sem => (
        <div key={sem}>
          <h2 className="text-2xl font-black mb-6">Semestre {sem}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {porSemestre[sem].map((m: any) => <MateriaCard key={m.id} materia={m} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default withQueryClient(MateriasLista)