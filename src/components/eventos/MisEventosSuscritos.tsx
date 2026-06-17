import { useEventosSuscritos } from '@/hooks/useEventos'
import { isAuthenticated } from '@/stores/auth'
import { withQueryClient } from '@/lib/queryClient'

function MisEventosSuscritos() {
  if (!isAuthenticated()) return null

  const { data: eventos, isLoading, isError } = useEventosSuscritos()

  if (isLoading) {
    return (
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container-custom">
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-40 animate-pulse rounded-2xl bg-white border border-slate-200"></div>
            <div className="h-40 animate-pulse rounded-2xl bg-white border border-slate-200"></div>
          </div>
        </div>
      </section>
    )
  }

  if (isError || !eventos || eventos.length === 0) return null

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="container-custom">
        <div className="mb-8">
          <h2 className="mb-2 font-mono text-xs font-bold tracking-[0.3em] text-indigo-600 uppercase">MIS_INSCRIPCIONES</h2>
          <h3 className="text-3xl font-bold text-slate-900 lg:text-4xl">
            Eventos activos a los que <span className="text-indigo-600 italic">estás suscrito</span>
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => {
            const dateObj = new Date(evento.fechaEvento || evento.fecha)
            const day = dateObj.getDate().toString().padStart(2, '0')
            const month = dateObj.toLocaleString('es-ES', { month: 'short' }).toUpperCase()
            
            return (
              <a
                href={`/eventos/${evento.id}`}
                key={evento.id}
                className="group flex flex-col justify-between bg-white border border-slate-200 rounded-3xl p-6 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-indigo-200"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block rounded-md bg-cyan-100 text-cyan-800 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                      {evento.tipo}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">
                      <span className="text-sm">{day}</span>
                      <span>{month}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {evento.titulo}
                  </h4>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {evento.descripcionCorta || evento.descripcion}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold border-t border-slate-100 pt-4 mt-auto">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{evento.lugar}</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default withQueryClient(MisEventosSuscritos)
