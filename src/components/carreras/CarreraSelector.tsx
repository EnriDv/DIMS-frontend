// frontend/src/components/carreras/CarreraSelector.tsx
import { useStore } from '@nanostores/react'
import { $carreraActiva, setCarreraActiva, clearCarreraActiva } from '@/stores/filters'
import { $carreras } from '@/stores/carreras'

export default function CarreraSelector() {
  const carreraActiva = useStore($carreraActiva)
  const carreras = useStore($carreras)

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => clearCarreraActiva()}
        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
          carreraActiva === null
            ? 'bg-slate-900 text-white scale-105'
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
        }`}
      >
        Todas
      </button>

      {carreras.map((carrera) => (
        <button
          key={carrera.slug}
          onClick={() => setCarreraActiva(carrera.slug)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm ${
            carreraActiva === carrera.slug
              ? 'text-white scale-105'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
          style={{
            backgroundColor: carreraActiva === carrera.slug ? (carrera.color || '#4f46e5') : undefined,
          }}
        >
          <span className="text-xl">{carrera.icono || '🎓'}</span>
          <span>{carrera.nombre.split(' ').pop()}</span>
        </button>
      ))}
    </div>
  )
}