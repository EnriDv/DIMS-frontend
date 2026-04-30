// frontend/src/components/personas/PersonaCard.tsx
import type { Persona } from '@/types'
import RoleProtected from '../auth/RoleProtected'

interface Props {
  persona: Persona
}

export default function PersonaCard({ persona }: Props) {
  const rolLabels: Record<string, string> = {
    docente: 'Docente',
    director: 'Director de Carrera',
    coordinador: 'Coordinador Académico',
    investigador: 'Investigador',
  }

  const label = rolLabels[persona.rol] || persona.rol

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative group">
      
      {/* Botones de Admin (Solo visibles si es Admin) */}
      <RoleProtected allowedRoles={['admin']}>
        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white text-indigo-600 p-2 rounded-full shadow-md hover:bg-indigo-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
        </div>
      </RoleProtected>

      {/* Foto */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {persona.fotoUrl ? (
          <img
            src={persona.fotoUrl}
            alt={persona.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <span className="text-6xl text-slate-300">👨‍🏫</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-black text-slate-900 mb-1">{persona.nombre}</h3>
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3">{label}</p>

        {persona.gradoAcademico && (
          <p className="text-sm font-medium text-slate-700 mb-2">{persona.gradoAcademico}</p>
        )}

        {persona.especialidad && (
          <p className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">{persona.especialidad}</p>
        )}

        {/* Contacto */}
        <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
          <a
            href={`mailto:${persona.email}`}
            className="text-sm text-slate-600 hover:text-indigo-600 flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span className="truncate">{persona.email}</span>
          </a>
        </div>

        <a href={`/personas/${persona.id}`} className="block w-full text-center bg-slate-50 hover:bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl transition-colors border border-slate-200 hover:border-indigo-200">
          Ver Perfil Completo
        </a>
      </div>
    </article>
  )
}