// frontend/src/components/auth/LoginForm.tsx
import { useState } from 'react'
import { useLogin } from '@/hooks/useAuth'
import { withQueryClient } from '@/lib/queryClient'

function LoginForm() {
  const loginMutation = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          window.location.href = '/'
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
          Correo Institucional
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="usuario@ucb.edu.bo"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          placeholder="••••••••"
          required
        />
      </div>

      {loginMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {loginMutation.error instanceof Error ? loginMutation.error.message : 'Credenciales inválidas'}
        </div>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {loginMutation.isPending ? 'Verificando credenciales...' : 'Ingresar al Sistema'}
      </button>
    </form>
  )
}

export default withQueryClient(LoginForm)