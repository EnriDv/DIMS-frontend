// src/components/materias/MateriaDetalle.tsx
import { useMateria } from '@/hooks/useMaterias'
import ErrorMessage from '../ui/ErrorMessage'
import type { Paralelo } from '@/types'
import { withQueryClient } from '@/lib/queryClient'

interface Props {
  materiaId: number
}

function MateriaDetalle({ materiaId }: Props) {
  const { data: materia, isLoading, isError, error } = useMateria(materiaId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 animate-pulse">
        <div className="h-8 bg-slate-100 rounded w-1/4 mb-4" />
        <div className="h-12 bg-slate-100 rounded w-3/4 mb-8" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (isError) return <ErrorMessage message={error instanceof Error ? error.message : 'Error al cargar materia'} />
  if (!materia) return <div className="text-center py-20 text-slate-400">Materia no encontrada</div>

  return (
    <div className="space-y-8">
      {/* Header de Materia */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl shadow-sm">
                {materia.sigla}
              </span>
              <span className="text-sm font-black px-4 py-2 bg-slate-100 text-slate-600 rounded-xl uppercase tracking-widest border border-slate-200">
                {materia.tipo}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {materia.nombre}
            </h1>
          </div>

          <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 min-w-[140px] text-center">
            <div className="text-5xl font-black">{materia.creditos}</div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-80">Créditos_ECTS</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          {materia.semestre && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              SEMESTRE_{materia.semestre}
            </div>
          )}
          {materia.area && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-bold text-sm uppercase tracking-wider">
              {materia.area}
            </div>
          )}
        </div>

        <div className="prose prose-slate max-w-none">
          <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Descripción_Sintética</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            {materia.descripcion || 'No hay una descripción detallada para esta asignatura en el sistema central.'}
          </p>
        </div>
      </div>

      {/* Paralelos y Cupos */}
      {materia.paralelos && materia.paralelos.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
            Oferta_Académica_Actual
          </h2>
          <div className="grid gap-6">
            {materia.paralelos.map((p) => (
              <div key={p.id} className="border-2 border-slate-100 rounded-2xl p-6 hover:border-indigo-100 transition-colors flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black text-slate-900">Paralelo {p.codigo}</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${p.disponible ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                      {p.disponible ? 'Disponible' : 'Sin_Cupos'}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium">Docente: <span className="text-slate-900 font-bold">{p.docenteNombre}</span></p>
                  <p className="text-xs font-mono text-indigo-500 mt-2 font-bold tracking-widest uppercase">{p.horario}</p>
                </div>
                
                <div className="w-full md:w-48 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-3xl font-black text-slate-900">{p.inscritos}/{p.cupo}</div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Estudiantes_Inscritos</p>
                  <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${p.inscritos >= p.cupo ? 'bg-red-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${(p.inscritos / p.cupo) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-12 text-center shadow-sm">
           <p className="text-amber-800 font-bold">No hay paralelos habilitados para el presente periodo académico.</p>
        </div>
      )}
    </div>
  )
}

// Exportamos envuelto para inyectar el QueryClient
export default withQueryClient(MateriaDetalle)