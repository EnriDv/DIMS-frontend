import { useEffect, useMemo, useState } from 'react'
import type { Carrera, Evento } from '@/types'
import { api } from '@/lib/api/client'
import { useCreateEvento, useDeleteEvento, useEventos, useUpdateEvento } from '@/hooks/useEventos'

type EventoFormState = {
  titulo: string
  descripcion: string
  fechaEvento: string
  lugar: string
  tipo: string
  carreraId: string
  capacidad: number
  imagenUrl: string
  publicado: boolean
}

const emptyEventoForm: EventoFormState = {
  titulo: '',
  descripcion: '',
  fechaEvento: '',
  lugar: '',
  tipo: 'conferencia',
  carreraId: '',
  capacidad: 50,
  imagenUrl: '',
  publicado: true,
}

const tiposEvento = ['conferencia', 'workshop', 'feria', 'charla', 'seminario'] as const

function normalizarTipoEvento(tipo?: string): string {
  const normalizado = (tipo || '').trim().toLowerCase()
  return tiposEvento.includes(normalizado as (typeof tiposEvento)[number]) ? normalizado : 'conferencia'
}

function normalizarCapacidad(capacidad: number): number {
  const valor = Number(capacidad)
  return Number.isFinite(valor) && valor > 0 ? valor : 1
}

function toDateTimeLocal(value?: string): string {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  const tzOffset = parsed.getTimezoneOffset() * 60000
  return new Date(parsed.getTime() - tzOffset).toISOString().slice(0, 16)
}

function toEventoForm(evento: Evento): EventoFormState {
  return {
    titulo: evento.titulo || '',
    descripcion: evento.descripcion || evento.descripcionCorta || '',
    fechaEvento: toDateTimeLocal(evento.fechaEvento || evento.fecha),
    lugar: evento.lugar || evento.ubicacion || '',
    tipo: normalizarTipoEvento(evento.tipo),
    carreraId: evento.carreraId ? String(evento.carreraId) : '',
    capacidad: evento.capacidad && evento.capacidad > 0 ? Number(evento.capacidad) : 50,
    imagenUrl: evento.imagenUrl || '',
    publicado: evento.publicado ?? true,
  }
}

export default function GestionEventosPanel() {
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [filtroCarreraId, setFiltroCarreraId] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [createForm, setCreateForm] = useState<EventoFormState>(emptyEventoForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<EventoFormState>(emptyEventoForm)

  const createEvento = useCreateEvento()
  const updateEvento = useUpdateEvento()
  const deleteEvento = useDeleteEvento()

  useEffect(() => {
    api.get<Carrera[]>('/Carreras').then(setCarreras).catch(console.error)
  }, [])

  const queryParams = useMemo(() => {
    if (filtroCarreraId) {
      return { admin: true, carreraId: Number(filtroCarreraId) }
    }

    return { admin: true }
  }, [filtroCarreraId])

  const { data: eventos = [], isLoading, isError, error } = useEventos(queryParams)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!createForm.titulo.trim() || !createForm.fechaEvento || !createForm.lugar.trim()) {
      alert('Título, fecha y lugar son obligatorios.')
      return
    }

    await createEvento.mutateAsync({
      titulo: createForm.titulo,
      descripcion: createForm.descripcion,
      fechaEvento: new Date(createForm.fechaEvento).toISOString(),
      lugar: createForm.lugar,
      tipo: normalizarTipoEvento(createForm.tipo),
      carreraId: createForm.carreraId ? Number(createForm.carreraId) : null,
      capacidad: normalizarCapacidad(createForm.capacidad),
      imagenUrl: createForm.imagenUrl || undefined,
    })

    setCreateForm(emptyEventoForm)
    setMostrarFormulario(false)
  }

  const startEdit = (evento: Evento) => {
    setEditingId(evento.id)
    setEditForm(toEventoForm(evento))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyEventoForm)
  }

  const saveEdit = async (id: number) => {
    if (!editForm.titulo.trim() || !editForm.fechaEvento || !editForm.lugar.trim()) {
      alert('Título, fecha y lugar son obligatorios.')
      return
    }

    await updateEvento.mutateAsync({
      id,
      data: {
        titulo: editForm.titulo,
        descripcion: editForm.descripcion,
        fechaEvento: new Date(editForm.fechaEvento).toISOString(),
        lugar: editForm.lugar,
        tipo: normalizarTipoEvento(editForm.tipo),
        carreraId: editForm.carreraId ? Number(editForm.carreraId) : null,
        capacidad: normalizarCapacidad(editForm.capacidad),
        imagenUrl: editForm.imagenUrl || undefined,
        publicado: editForm.publicado,
      },
    })

    cancelEdit()
  }

  const removeEvento = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este evento?')) {
      return
    }

    await deleteEvento.mutateAsync(id)

    if (editingId === id) {
      cancelEdit()
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <label htmlFor="filtro-carrera-eventos" className="text-xs font-black tracking-wider text-slate-500 uppercase">
            Filtrar por carrera
          </label>
          <select
            id="filtro-carrera-eventos"
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
          {mostrarFormulario ? 'Cancelar nuevo evento' : 'Crear nuevo evento'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleCreate} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Nuevo evento</h3>

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
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Descripción</label>
              <textarea
                value={createForm.descripcion}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Fecha y hora</label>
              <input
                type="datetime-local"
                value={createForm.fechaEvento}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, fechaEvento: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Lugar</label>
              <input
                type="text"
                value={createForm.lugar}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, lugar: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Tipo</label>
              <select
                value={createForm.tipo}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, tipo: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {tiposEvento.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
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
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Capacidad</label>
              <input
                type="number"
                min={1}
                value={createForm.capacidad}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, capacidad: Number(e.target.value) || 1 }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Imagen URL</label>
              <input
                type="url"
                value={createForm.imagenUrl}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, imagenUrl: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createEvento.isPending}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-black tracking-wide text-white uppercase hover:bg-indigo-700 disabled:opacity-60"
          >
            {createEvento.isPending ? 'Guardando...' : 'Guardar evento'}
          </button>
        </form>
      )}

      {isLoading && <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">Cargando eventos...</div>}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error instanceof Error ? error.message : 'Error al cargar eventos'}
        </div>
      )}

      {!isLoading && !isError && eventos.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">No hay eventos para los filtros actuales.</div>
      )}

      <div className="space-y-4">
        {eventos.map((evento) => (
          <article key={evento.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            {editingId === evento.id ? (
              <div className="space-y-4">
                <h4 className="text-sm font-black tracking-wider text-indigo-600 uppercase">Editando evento #{evento.id}</h4>

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
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Descripción</label>
                    <textarea
                      value={editForm.descripcion}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Fecha y hora</label>
                    <input
                      type="datetime-local"
                      value={editForm.fechaEvento}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, fechaEvento: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Lugar</label>
                    <input
                      type="text"
                      value={editForm.lugar}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, lugar: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Tipo</label>
                    <select
                      value={editForm.tipo}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, tipo: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {tiposEvento.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
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
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Capacidad</label>
                    <input
                      type="number"
                      min={1}
                      value={editForm.capacidad}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, capacidad: Number(e.target.value) || 1 }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">Imagen URL</label>
                    <input
                      type="url"
                      value={editForm.imagenUrl}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, imagenUrl: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editForm.publicado}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, publicado: e.target.checked }))}
                  />
                  Publicado
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => saveEdit(evento.id)}
                    disabled={updateEvento.isPending}
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
                  <h4 className="text-xl font-black tracking-tight text-slate-900">{evento.titulo}</h4>

                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${evento.publicado ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                    {evento.publicado ? 'Publicado' : 'Oculto'}
                  </span>
                </div>

                <p className="text-slate-700">{evento.descripcion || evento.descripcionCorta || 'Sin descripción'}</p>

                <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                  <p><span className="font-bold text-slate-800">ID:</span> {evento.id}</p>
                  <p><span className="font-bold text-slate-800">Carrera:</span> {evento.carreraNombre || 'General'}</p>
                  <p><span className="font-bold text-slate-800">Fecha:</span> {new Date(evento.fechaEvento || evento.fecha).toLocaleString('es-ES')}</p>
                  <p><span className="font-bold text-slate-800">Lugar:</span> {evento.lugar || evento.ubicacion || 'Sin lugar'}</p>
                  <p><span className="font-bold text-slate-800">Tipo:</span> {evento.tipo}</p>
                  <p><span className="font-bold text-slate-800">Capacidad:</span> {evento.inscritos}/{evento.capacidad}</p>
                  <p><span className="font-bold text-slate-800">Autor:</span> {evento.createdBy || 'Sin dato'}</p>
                  <p><span className="font-bold text-slate-800">Creado:</span> {evento.createdAt ? new Date(evento.createdAt).toLocaleString('es-ES') : 'Sin dato'}</p>
                  <p><span className="font-bold text-slate-800">Actualizado:</span> {evento.updatedAt ? new Date(evento.updatedAt).toLocaleString('es-ES') : 'Sin dato'}</p>
                </div>

                {evento.imagenUrl && (
                  <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">Imagen:</span> {evento.imagenUrl}</p>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => startEdit(evento)}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => removeEvento(evento.id)}
                    disabled={deleteEvento.isPending}
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
