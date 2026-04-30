// src/components/carreras/CarreraSkeleton.tsx
export default function CarreraSkeleton() {
  return (
    <div className="glass-card relative block overflow-hidden p-6 lg:p-10 bg-white border border-slate-100 animate-pulse">
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
        {/* Icono Placeholder */}
        <div className="h-16 w-16 rounded-2xl bg-slate-200" />
        
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            {/* Titulo Placeholder */}
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            {/* Badge Placeholder */}
            <div className="h-5 w-20 bg-slate-100 rounded" />
          </div>
          {/* Descripcion Placeholder */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-2/3 bg-slate-100 rounded" />
          </div>
        </div>
        
        {/* Flecha Placeholder */}
        <div className="hidden md:block h-12 w-12 bg-slate-50 rounded-full" />
      </div>
    </div>
  )
}