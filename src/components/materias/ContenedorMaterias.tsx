// frontend/src/components/materias/ContenedorMaterias.tsx
import QueryProvider from '@/components/providers/QueryProvider'
import MateriasLista from './MateriasLista'

export default function ContenedorMaterias() {
  return (
    <QueryProvider>
      <MateriasLista />
    </QueryProvider>
  )
}