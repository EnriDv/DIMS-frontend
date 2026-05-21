// src/components/noticias/NoticiasLista.tsx
import { useStore } from '@nanostores/react'
import { $carreraActiva } from '@/stores/filters'
import { useNoticias } from '@/hooks/useNoticias'
import NoticiaCard from './NoticiaCard'
import NoticiasSkeleton from './NoticiasSkeleton'
import ErrorMessage from '../ui/ErrorMessage'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api/client'
import type { Carrera } from '@/types'
import { withQueryClient } from '@/lib/queryClient'

function NoticiasLista() {
  const carreraActivaSlug = useStore($carreraActiva)
  const [carreraId, setCarreraId] = useState<number | null>(null)

  // Sincronizar el slug de la URL con el ID de la base de datos
  useEffect(() => {
    if (!carreraActivaSlug) {
      setCarreraId(null)
      return
    }
    api.get<Carrera[]>('/Carreras').then(carreras => {
      const encontrada = carreras.find(c => c.slug === carreraActivaSlug)
      if (encontrada) setCarreraId(encontrada.id)
    }).catch(console.error)
  }, [carreraActivaSlug])

  // Pedir noticias filtradas por ID o todas si carreraId es null
  const { data: noticias, isLoading, isError, error } = useNoticias(
    carreraId ? { carreraId } : undefined
  )

  if (isLoading || (carreraActivaSlug && !carreraId)) {
    return <NoticiasSkeleton count={6} />
  }

  if (isError) {
    return <ErrorMessage message={error instanceof Error ? error.message : 'Error al cargar noticias'} />
  }

  if (!noticias || noticias.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <p className="text-slate-500 text-lg font-medium">No hay noticias publicadas para esta sección.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {noticias.map((noticia) => (
        <NoticiaCard key={noticia.id} noticia={noticia} />
      ))}
    </div>
  )
}

export default withQueryClient(NoticiasLista)