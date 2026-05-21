// frontend/src/components/auth/RegisterForm.tsx

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRegister } from '@/hooks/useAuth'
import { withQueryClient } from '@/lib/queryClient'

const registerSchema = z.object({
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  email: z.string().email({ message: 'Debe ser un correo válido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
    .regex(/[a-z]/, { message: 'Debe contener al menos una minúscula' })
    .regex(/[^A-Za-z0-9]/, { message: 'Debe contener al menos un carácter especial' }),
  rol: z.enum(['estudiante', 'docente', 'admin']).optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      rol: 'estudiante',
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        // Después de registrar, lo enviamos al login
        window.location.href = '/login?registered=true'
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block">
          <span className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
            Nombre Completo
          </span>
          <input
            type="text"
            {...register('nombre')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Juan Pérez"
          />
        </label>
        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
      </div>

      <div>
        <label className="block">
          <span className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
            Correo Institucional
          </span>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="usuario@ucb.edu.bo"
          />
        </label>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block">
          <span className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
            Contraseña
          </span>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
          />
        </label>
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block">
          <span className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">
            Rol (Solo para desarrollo)
          </span>
          <select
            {...register('rol')}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        {errors.rol && <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>}
      </div>

      {registerMutation.isError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Error"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {registerMutation.error instanceof Error
            ? registerMutation.error.message
            : 'Error al registrar'}
        </div>
      )}

      {registerMutation.isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
          ¡Registro exitoso! Redirigiendo al login...
        </div>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {registerMutation.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  )
}

export default withQueryClient(RegisterForm)
