// frontend/src/components/auth/LoginButton.tsx
import { useStore } from '@nanostores/react'
import { $currentUser, logout } from '@/stores/auth'
import { useEffect, useState } from 'react'

export default function LoginButton() {
  const user = useStore($currentUser)
  const [mounted, setMounted] = useState(false)

  // Evitamos el error de hidratación en SSR esperando a que el componente se monte en el cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-28 h-10 animate-pulse bg-slate-200 rounded-lg"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-700 hidden lg:block">
          Hola, <span className="text-indigo-600">{user.nombre.split(' ')[0]}</span>
        </span>
        
        <a
          href="/admin"
          className="hidden lg:block text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          Panel
        </a>

        <button
          onClick={() => {
            logout()
            window.location.href = '/'
          }}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-mono text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white shadow-sm"
        >
          SALIR
        </button>
      </div>
    )
  }

  return (
    <a
      href="/login"
      className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-mono text-xs font-bold text-indigo-700 transition-all hover:bg-indigo-600 hover:text-white shadow-sm"
    >
      INICIAR SESIÓN
    </a>
  )
}