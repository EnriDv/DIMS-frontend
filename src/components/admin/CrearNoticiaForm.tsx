// src/components/admin/CrearNoticiaForm.tsx
import { useState, useEffect, useRef } from 'react'
import { useCreateNoticia } from '@/hooks/useNoticias'
import { api } from '@/lib/api/client'
import type { Carrera } from '@/types'
import { withQueryClient } from '@/lib/queryClient'

const IMAGE_UPLOAD_URL = import.meta.env.PUBLIC_IMAGE_UPLOAD_URL

async function uploadImageToLambda(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const response = await fetch(`${IMAGE_UPLOAD_URL}?folder=noticias`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: arrayBuffer,
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error ?? `Error al subir imagen (${response.status})`)
  }
  const data = await response.json()
  return data.url as string
}

function CrearNoticiaForm() {
  const createNoticia = useCreateNoticia()
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    carreraId: '',
    imagenUrl: '',
    destacada: false,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Carrera[]>('/Carreras').then(setCarreras).catch(console.error)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setFormData(prev => ({ ...prev, imagenUrl: '' }))
    setUploadState('idle')
    setUploadError(null)
  }

  const handleUpload = async () => {
    if (!imageFile) return
    setUploadState('uploading')
    setUploadError(null)
    try {
      const url = await uploadImageToLambda(imageFile)
      setFormData(prev => ({ ...prev, imagenUrl: url }))
      setUploadState('done')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error desconocido')
      setUploadState('error')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      alert('El título y el contenido son obligatorios.')
      return
    }

    if (imageFile && uploadState !== 'done') {
      alert('Debes subir la imagen antes de publicar.')
      return
    }

    createNoticia.mutate({
      titulo: formData.titulo,
      contenido: formData.contenido,
      imagenUrl: formData.imagenUrl || undefined,
      carreraId: formData.carreraId ? parseInt(formData.carreraId) : null,
      destacada: formData.destacada,
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

          {/* Imagen: file picker + subida a Lambda */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Imagen</label>

            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-300 transition-colors text-left truncate"
                >
                  {imageFile ? imageFile.name : 'Seleccionar archivo...'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imageFile && uploadState !== 'done' && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadState === 'uploading'}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploadState === 'uploading' ? 'Subiendo...' : 'Subir'}
                  </button>
                )}
              </div>

              {/* Preview */}
              {imagePreview && (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {uploadState === 'done' && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                      ✓ Subida
                    </div>
                  )}
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-bold text-red-500">{uploadError}</p>
              )}

              {/* URL resultante (solo lectura, para referencia) */}
              {formData.imagenUrl && (
                <p className="text-[10px] font-mono text-slate-400 break-all">{formData.imagenUrl}</p>
              )}
            </div>
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
        disabled={createNoticia.isPending || uploadState === 'uploading'}
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
