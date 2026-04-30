// frontend/src/components/noticias/NoticiaCard.tsx
import type { Noticia } from '@/types'

interface Props {
  noticia: Noticia
}

export default function NoticiaCard({ noticia }: Props) {
  const fechaFormateada = new Date(noticia.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const extractText = (html: string, maxLength: number = 150): string => {
    const text = html.replace(/<[^>]*>/g, '')
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Imagen */}
      {noticia.imagenUrl ? (
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img
            src={noticia.imagenUrl}
            alt={noticia.titulo}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          {noticia.destacada && (
            <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
              ★ DESTACADA
            </div>
          )}
        </div>
      ) : (
        <div className="h-2 bg-indigo-600 w-full"></div>
      )}

      {/* Contenido */}
      <div className="p-6 flex-1 flex flex-col">
        {noticia.carreraNombre && (
          <div className="mb-3">
            <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 uppercase tracking-wider">
              {noticia.carreraNombre}
            </span>
          </div>
        )}

        <time className="text-xs font-mono font-medium text-slate-400 mb-3">{fechaFormateada}</time>

        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight">
          {noticia.titulo}
        </h3>

        <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
          {extractText(noticia.contenido)}
        </p>

        <a
          href={`/noticias/${noticia.id}`}
          className="text-indigo-600 font-bold hover:text-indigo-800 inline-flex items-center gap-2 group transition-colors text-sm"
        >
          Leer artículo
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </article>
  )
}