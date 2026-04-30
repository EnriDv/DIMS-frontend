// src/components/admin/CrearNoticiaForm.tsx
import { useState, useEffect } from 'react'
import { useCreateNoticia } from '@/hooks/useNoticias'
import { api } from '@/lib/api/client'
import type { Carrera } from '@/types'
import { withQueryClient } from '@/lib/queryClient'

function CrearNoticiaForm() {
  const createNoticia = useCreateNoticia()
  const [carreras, setCarreras] = useState<Carrera[]>([])

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    carreraId: '', 
    imagenUrl: '',
    destacada: false,
  })

  useEffect(() => {
    api.get<Carrera[]>('/Carreras').then(setCarreras).catch(console.error)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // VALIDACIÓN PREVIA: No enviar si están vacíos
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      alert("El título y el contenido son obligatorios.")
      return
    }

    createNoticia.mutate({
      titulo: formData.titulo,
      contenido: formData.contenido,
      imagenUrl: formData.imagenUrl || undefined,
      carreraId: formData.carreraId ? parseInt(formData.carreraId) : null,
      destacada: formData.destacada
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Publicar_Noticia</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título del Comunicado</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
            placeholder="Escribe un título impactante..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cuerpo de la Noticia (HTML compatible)</label>
          <textarea
            value={formData.contenido}
            onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
            rows={5}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            placeholder="Detalla la información aquí..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Carrera Relacionada</label>
            <select
              value={formData.carreraId}
              onChange={(e) => setFormData({ ...formData, carreraId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
            >
              <option value="">Facultad (General)</option>
              {carreras.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL de Imagen</label>
            <input
              type="url"
              value={formData.imagenUrl}
              onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
          <input
            type="checkbox"
            checked={formData.destacada}
            onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">Marcar como noticia destacada</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={createNoticia.isPending}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg disabled:opacity-50"
      >
        {createNoticia.isPending ? 'TRANSMITIENDO_DATOS...' : 'PUBLICAR_LOG_DE_NOTICIA'}
      </button>

      {createNoticia.isError && (
        <p className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
          ERROR_SISTEMA: {createNoticia.error instanceof Error ? createNoticia.error.message : 'Fallo en la respuesta del servidor'}
        </p>
      )}
    </form>
  )
}

export default withQueryClient(CrearNoticiaForm)