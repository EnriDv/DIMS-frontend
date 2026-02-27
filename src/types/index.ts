// src/types/index.ts

export interface Carrera {
  slug: string
  nombre: string
  descripcion: string
  duracion: string
  modalidad: string
  imagen: string
  color: string
  icono: string
  perfilEgresado: string[]
  campoLaboral: string[]
}

export interface Materia {
  codigo: string
  nombre: string
  creditos: number
  requisitos: string[]
  tipo: 'obligatoria' | 'electiva'
  area: string
}

export interface MallaCurricular {
  semestre: number
  materias: Materia[]
}

export interface Noticia {
  id: number
  titulo: string
  contenido: string
  fecha: string
  imagen?: string
  carreraSlug: string
  carreraNombre: string
}

export interface Evento {
  id: number
  titulo: string
  descripcion: string
  fechaEvento: string
  lugar: string
  imagen?: string
  carreraSlug: string
  tipo: 'conferencia' | 'workshop' | 'feria' | 'charla'
}

export interface Publicacion {
  id: number
  titulo: string
  autor: string
  resumen: string
  archivo?: string
  fechaPublicacion: string
  carreraSlug: string
  tipo: 'investigacion' | 'proyecto' | 'tesis'
}