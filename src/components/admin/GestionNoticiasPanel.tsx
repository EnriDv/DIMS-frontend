import { useEffect, useMemo, useRef, useState } from 'react'
import type { Carrera, Noticia } from '@/types'
import { api } from '@/lib/api/client'
import { useCreateNoticia, useDeleteNoticia, useNoticias, useUpdateNoticia } from '@/hooks/useNoticias'

type NoticiaFormState = {
  titulo: string
  contenido: string
  imagenUrl: string
  carreraId: string
  destacada: boolean
  publicada: boolean
}

const emptyNoticiaForm: NoticiaFormState = {
  titulo: '',
  contenido: '',
  imagenUrl: '',
  carreraId: '',
  destacada: false,
  publicada: true,
}

function toNoticiaForm(noticia: Noticia): NoticiaFormState {
  return {
    titulo: noticia.titulo || '',
    contenido: noticia.contenido || '',
    imagenUrl: noticia.imagenUrl || '',
    carreraId: noticia.carreraId ? String(noticia.carreraId) : '',
    destacada: noticia.destacada ?? false,
    publicada: noticia.publicada ?? true,
  }
}

const IMAGE_UPLOAD_URL = import.meta.env.PUBLIC_IMAGE_UPLOAD_URL

async function uploadImage(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const res = await fetch(`${IMAGE_UPLOAD_URL}?folder=noticias`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: buffer,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Error al subir imagen (${res.status})`)
  }
  const data = await res.json()
  return data.url as string
}

export default function GestionNoticiasPanel() {
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [filtroCarreraId, setFiltroCarreraId] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [createForm, setCreateForm] = useState<NoticiaFormState>(emptyNoticiaForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<NoticiaFormState>(emptyNoticiaForm)

  const createNoticia = useCreateNoticia()
  const updateNoticia = useUpdateNoticia()
  const deleteNoticia = useDeleteNoticia()

  const createFileRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)
  const [createUpload, setCreateUpload] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [editUpload, setEditUpload] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [createFileName, setCreateFileName] = useState<string | null>(null)
  const [editFileName, setEditFileName] = useState<string | null>(null)

  const handleImageFile = async (
    file: File,
    setForm: React.Dispatch<React.SetStateAction<NoticiaFormState>>,
    setUpload: React.Dispatch<React.SetStateAction<'idle' | 'uploading' | 'done' | 'error'>>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setFileName(file.name)
    setUpload('uploading')
    try {
      const url = await uploadImage(file)
      setForm(prev => ({ ...prev, imagenUrl: url }))
      setUpload('done')
    } catch {
      setUpload('error')
    }
  }

  useEffect(() => {
    api.get<Carrera[]>('/Carreras').then(setCarreras).catch(console.error)
  }, [])

  const queryParams = useMemo(() => {
    if (filtroCarreraId) {
      return { admin: true, carreraId: Number(filtroCarreraId) }
    }

    return { admin: true }
  }, [filtroCarreraId])

  const { data: noticias = [], isLoading, isError, error } = useNoticias(queryParams)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!createForm.titulo.trim() || !createForm.contenido.trim()) {
      alert('El título y el contenido son obligatorios.')
      return
    }

    await createNoticia.mutateAsync({
      titulo: createForm.titulo,
      contenido: createForm.contenido,
      imagenUrl: createForm.imagenUrl || undefined,
      carreraId: createForm.carreraId ? Number(createForm.carreraId) : null,
      destacada: createForm.destacada,
      publicada: createForm.publicada,
    })

    setCreateForm(emptyNoticiaForm)
    setCreateFileName(null)
    setCreateUpload('idle')
    setMostrarFormulario(false)
  }

  const startEdit = (noticia: Noticia) => {
    setEditingId(noticia.id)
    setEditForm(toNoticiaForm(noticia))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyNoticiaForm)
    setEditFileName(null)
    setEditUpload('idle')
  }

  const saveEdit = async (id: number) => {
    if (!editForm.titulo.trim() || !editForm.contenido.trim()) {
      alert('El título y el contenido son obligatorios.')
      return
    }

    await updateNoticia.mutateAsync({
      id,
      data: {
        titulo: editForm.titulo,
        contenido: editForm.contenido,
        imagenUrl: editForm.imagenUrl || undefined,
        carreraId: editForm.carreraId ? Number(editForm.carreraId) : null,
        destacada: editForm.destacada,
        publicada: editForm.publicada,
      },
    })

    cancelEdit()
  }

  const removeNoticia = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta noticia?')) {
      return
    }

    await deleteNoticia.mutateAsync(id)

    if (editingId === id) {
      cancelEdit()
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <label htmlFor="filtro-carrera-noticias" className="text-xs font-black tracking-wider text-slate-500 uppercase">
            Filtrar por carrera
          </label>
          <select
            id="filtro-carrera-noticias"
            value={filtroCarreraId}
            onChange={(e) => setFiltroCarreraId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <option value="">Todas</option>
            {carreras.map((carrera) => (
              <option key={carrera.id} value={carrera.id}>
                {carrera.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-black tracking-wide text-white uppercase hover:bg-indigo-700"
        >
          {mostrarFormulario ? 'Cancelar nueva noticia' : 'Crear nueva noticia'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Nueva noticia</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Título</label>
              <input
                type="text"
                value={createForm.titulo}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, titulo: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Contenido</label>
              <textarea
                value={createForm.contenido}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, contenido: e.target.value }))}
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Carrera</label>
              <select
                value={createForm.carreraId}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, carreraId: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <option value="">General</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Imagen</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => createFileRef.current?.click()}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-500 truncate hover:border-indigo-300 transition-colors"
                >
                  {createFileName ?? 'Seleccionar archivo...'}
                </button>
                <input
                  ref={createFileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageFile(file, setCreateForm, setCreateUpload, setCreateFileName)
                  }}
                />
              </div>
              {createUpload === 'uploading' && <p className="mt-1 text-xs text-indigo-500">Subiendo imagen...</p>}
              {createUpload === 'done' && <p className="mt-1 text-xs text-emerald-600">✓ Imagen subida</p>}
              {createUpload === 'error' && <p className="mt-1 text-xs text-red-500">Error al subir la imagen</p>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={createForm.publicada}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, publicada: e.target.checked }))}
              />
              Publicada
            </label>

            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={createForm.destacada}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, destacada: e.target.checked }))}
              />
              Destacada
            </label>
          </div>

          <button
            type="submit"
            disabled={createNoticia.isPending}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black tracking-wide text-white uppercase hover:bg-indigo-700 disabled:opacity-60"
          >
            {createNoticia.isPending ? 'Guardando...' : 'Guardar noticia'}
          </button>
        </form>
      )}

      {isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Cargando noticias...</div>}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error instanceof Error ? error.message : 'Error al cargar noticias'}
        </div>
      )}

      {!isLoading && !isError && noticias.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">No hay noticias para los filtros actuales.</div>
      )}

      <div className="space-y-4">
        {noticias.map((noticia) => (
          <article key={noticia.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            {editingId === noticia.id ? (
              <div className="space-y-4">
                <h4 className="text-sm font-black tracking-wider text-indigo-600 uppercase">Editando noticia #{noticia.id}</h4>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Título</label>
                    <input
                      type="text"
                      value={editForm.titulo}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, titulo: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Contenido</label>
                    <textarea
                      value={editForm.contenido}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, contenido: e.target.value }))}
                      rows={6}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Carrera</label>
                    <select
                      value={editForm.carreraId}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, carreraId: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <option value="">General</option>
                      {carreras.map((carrera) => (
                        <option key={carrera.id} value={carrera.id}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Imagen</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editFileRef.current?.click()}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-500 truncate hover:border-indigo-300 transition-colors"
                      >
                        {editFileName ?? (editForm.imagenUrl ? 'Cambiar imagen...' : 'Seleccionar archivo...')}
                      </button>
                      <input
                        ref={editFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageFile(file, setEditForm, setEditUpload, setEditFileName)
                        }}
                      />
                    </div>
                    {editUpload === 'uploading' && <p className="mt-1 text-xs text-indigo-500">Subiendo imagen...</p>}
                    {editUpload === 'done' && <p className="mt-1 text-xs text-emerald-600">✓ Imagen subida</p>}
                    {editUpload === 'error' && <p className="mt-1 text-xs text-red-500">Error al subir la imagen</p>}
                    {editForm.imagenUrl && editUpload !== 'done' && (
                      <p className="mt-1 text-[10px] font-mono text-slate-400 truncate">{editForm.imagenUrl}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editForm.publicada}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, publicada: e.target.checked }))}
                    />
                    Publicada
                  </label>

                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editForm.destacada}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, destacada: e.target.checked }))}
                    />
                    Destacada
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => saveEdit(noticia.id)}
                    disabled={updateNoticia.isPending}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    Guardar cambios
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-xl font-black tracking-tight text-slate-900">{noticia.titulo}</h4>

                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${noticia.publicada ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                      {noticia.publicada ? 'Publicada' : 'Oculta'}
                    </span>
                    {noticia.destacada && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700 uppercase">Destacada</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p><span className="font-bold text-slate-800">ID:</span> {noticia.id}</p>
                  <p><span className="font-bold text-slate-800">Carrera:</span> {noticia.carreraNombre || 'General'}</p>
                  <p><span className="font-bold text-slate-800">Fecha:</span> {new Date(noticia.fecha).toLocaleString('es-ES')}</p>
                  <p><span className="font-bold text-slate-800">Autor:</span> {noticia.createdBy || 'Sin dato'}</p>
                  <p><span className="font-bold text-slate-800">Creada:</span> {noticia.createdAt ? new Date(noticia.createdAt).toLocaleString('es-ES') : 'Sin dato'}</p>
                  <p><span className="font-bold text-slate-800">Actualizada:</span> {noticia.updatedAt ? new Date(noticia.updatedAt).toLocaleString('es-ES') : 'Sin dato'}</p>
                </div>

                {noticia.imagenUrl && (
                  <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Imagen:</span> {noticia.imagenUrl}</p>
                )}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-black tracking-wider text-slate-500 uppercase">Contenido</p>
                  <div
                    className="prose prose-sm max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{ __html: noticia.contenido }}
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => startEdit(noticia)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => removeNoticia(noticia.id)}
                    disabled={deleteNoticia.isPending}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
