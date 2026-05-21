// frontend/src/components/materias/ContenedorMaterias.tsx
import { withQueryClient } from '@/lib/queryClient'
import MateriasLista from './MateriasLista'

function ContenedorMaterias() {
  return <MateriasLista />
}

export default withQueryClient(ContenedorMaterias)