// src/components/personas/PersonaDetalle.tsx
import { usePersona } from '@/hooks/usePersonas'
import ErrorMessage from '../ui/ErrorMessage'
import { withQueryClient } from '@/lib/queryClient'

interface Props {
  personaId: number
}

function PersonaDetalle({ personaId }: Props) {
  const { data: persona, isLoading, isError, error } = usePersona(personaId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-pulse p-10">
        <div className="h-40 bg-slate-100 rounded-2xl mb-6" />
        <div className="h-8 bg-slate-100 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    )
  }

  if (isError) return <ErrorMessage message="Error al cargar el perfil" />
  if (!persona) return <div className="text-center py-20 text-slate-400">Persona no encontrada</div>

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 bg-slate-100 border-r border-slate-200">
          {persona.fotoUrl ? (
            <img src={persona.fotoUrl} alt={persona.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center text-8xl">👨‍🏫</div>
          )}
        </div>
        <div className="md:w-2/3 p-8 md:p-12">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-widest rounded-lg mb-4">
            {persona.rol}
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{persona.nombre}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Especialidad</p>
              <p className="font-bold text-slate-700">{persona.especialidad || 'General'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grado Académico</p>
              <p className="font-bold text-slate-700">{persona.gradoAcademico || 'Licenciatura'}</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase mb-4">Contacto Directo</h3>
            <a href={`mailto:${persona.email}`} className="flex items-center gap-3 text-indigo-600 font-bold hover:underline">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               {persona.email}
            </a>
          </div>
        </div>
      </div>
      
      {persona.bio && (
        <div className="p-8 md:p-12 border-t border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Biografía_Trayectoria</h2>
          <p className="text-slate-600 leading-relaxed text-lg">{persona.bio}</p>
        </div>
      )}
    </div>
  )
}

export default withQueryClient(PersonaDetalle)