// frontend/src/components/noticias/NoticiasSkeleton.tsx
export default function NoticiasSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-slate-200" />

          <div className="p-6">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-6 bg-slate-200 rounded w-full mb-4" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}