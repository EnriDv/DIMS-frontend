import { useStore } from '@nanostores/react'
import { $carreraActiva } from '@/stores/filters'
import { usePersonas } from '@/hooks/usePersonas'
import PersonaCard from './PersonaCard'
import ErrorMessage from '../ui/ErrorMessage'
import RoleProtected from '../auth/RoleProtected'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import type { Carrera } from '@/types'
import { withQueryClient } from '@/lib/queryClient'

function PersonasLista({ rol }: { rol?: string }) {
  const carreraActivaSlug = useStore($carreraActiva)
  const [carreraId, setCarreraId] = useState<number | null>(null)

  useEffect(() => {
    if (!carreraActivaSlug) {
      setCarreraId(null);
      return;
    }
    api.get<Carrera[]>('/Carreras').then(carreras => {
      const encontrada = carreras.find(c => c.slug === carreraActivaSlug)
      if (encontrada) setCarreraId(encontrada.id)
    }).catch(console.error)
  }, [carreraActivaSlug])

  const { data: personas, isLoading, isError, error } = usePersonas(
    carreraId || rol ? { carreraId, rol } : undefined
  )

  if (isLoading || (carreraActivaSlug && !carreraId)) {
    return <div className="grid md:grid-cols-3 gap-6">{/* Skeleton code */}</div>
  }

  if (isError) return <ErrorMessage message="Error al cargar personas" />

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {personas?.map((persona) => (
        <PersonaCard key={persona.id} persona={persona} />
      ))}
    </div>
  )
}

export default withQueryClient(PersonasLista)