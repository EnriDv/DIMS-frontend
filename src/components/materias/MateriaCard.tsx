// frontend/src/components/materias/MateriaCard.tsx
import type { Materia } from '@/types'

interface Props {
  materia: Materia
}

export default function MateriaCard({ materia }: Props) {
  const docentes = materia.docentes || []

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              {materia.sigla}
            </span>
            <span className="text-xs text-slate-500">
              {materia.creditos} {materia.creditos === 1 ? 'crédito' : 'créditos'}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{materia.nombre}</h3>
        </div>

        {/* Badge de tipo */}
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            materia.tipo === 'obligatoria'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}
        >
          {materia.tipo === 'obligatoria' ? 'Obligatoria' : 'Electiva'}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{materia.descripcion}</p>

      {/* Info adicional */}
      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        {materia.semestre && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
            <span>Semestre {materia.semestre}</span>
          </div>
        )}
        {materia.area && (
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
            </svg>
            <span>{materia.area}</span>
          </div>
        )}
      </div>

      {/* Docentes */}
      {docentes.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-700 mb-2">Equipo Docente:</p>
          <div className="flex flex-wrap gap-2">
            {docentes.map((docente) => (
              <div
                key={docente.id}
                className="bg-amber-50 border border-amber-200 rounded px-2 py-1 flex items-center gap-2"
              >
                {docente.fotoUrl && (
                  <img src={docente.fotoUrl} alt={docente.nombre} className="w-4 h-4 rounded-full" />
                )}
                <p className="text-xs font-semibold text-amber-900">{docente.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requisitos */}
      {materia.requisitos && materia.requisitos.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-700 mb-1">Requisitos:</p>
          <div className="flex flex-wrap gap-1">
            {materia.requisitos.map((req) => (
              <span
                key={req}
                className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Link */}
      <a     
        href={`/materias/${materia.id}`} 
        className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center gap-1 group"
      >
        Ver detalles
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  )
}