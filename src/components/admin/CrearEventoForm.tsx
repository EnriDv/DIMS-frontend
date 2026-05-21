// src/components/admin/CrearEventoForm.tsx
import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventosService } from '@/lib/api/eventos.service'
import { api } from '@/lib/api/client'
import type { Carrera } from '@/types'
import { withQueryClient } from '@/lib/queryClient' // <--- Importante

function CrearEventoForm() {
  const queryClient = useQueryClient()
  const [carreras, setCarreras] = useState<Carrera[]>([])
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaEvento: '',
    lugar: '',
    tipo: 'conferencia',
    carreraId: '',
    capacidad: 50
  })

  useEffect(() => {
    api.get<Carrera[]>('/Carreras').then(setCarreras).catch(console.error)
  }, [])

  const mutation = useMutation({
    mutationFn: (data: any) => eventosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
      alert('Evento creado!')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      ...formData,
      carreraId: formData.carreraId ? parseInt(formData.carreraId) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Nuevo_Evento</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Título</label>
           <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fecha</label>
           <input type="datetime-local" value={formData.fechaEvento} onChange={e => setFormData({...formData, fechaEvento: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
        </div>
        <div>
           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Lugar</label>
           <input type="text" value={formData.lugar} onChange={e => setFormData({...formData, lugar: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" required />
        </div>
      </div>

      <button type="submit" disabled={mutation.isPending} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
        {mutation.isPending ? 'REGISTRANDO...' : 'PUBLICAR_EVENTO'}
      </button>
    </form>
  )
}

// Envolvemos el componente antes de exportar
export default withQueryClient(CrearEventoForm)