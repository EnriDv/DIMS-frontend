// frontend/src/components/auth/RoleProtected.tsx
import { useStore } from '@nanostores/react'
import { $currentUser } from '@/stores/auth'
import { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'docente' | 'estudiante')[]
}

export default function RoleProtected({ children, allowedRoles = ['admin'] }: Props) {
  const user = useStore($currentUser)
  const [isMounted, setIsMounted] = useState(false)

  // Evitamos problemas de hidratación en SSR esperando a que monte el componente
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  if (!user) return null

  // El Admin siempre tiene acceso a todo por defecto, o validamos el rol específico
  const isAllowed = user.rol === 'admin' || allowedRoles.includes(user.rol as any)

  if (!isAllowed) return null

  return <>{children}</>
}