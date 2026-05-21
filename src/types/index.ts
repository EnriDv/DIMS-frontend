// frontend/src/types/index.ts

export interface Carrera {
  id: number
  slug: string
  nombre: string
  descripcion: string
  duracion?: string
  modalidad?: string
  imagenUrl?: string
  color?: string
  icono?: string
  activa?: boolean
  perfilEgresado?: string[]
  campoLaboral?: string[]
}

export interface Noticia {
  id: number
  titulo: string
  contenido: string
  fecha: string
  imagenUrl?: string
  carreraId?: number | null
  carreraSlug?: string
  carreraNombre?: string
  carreraColor?: string
  publicada?: boolean
  destacada?: boolean
  createdBy?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface Evento {
  id: number
  titulo: string
  descripcionCorta?: string
  descripcion?: string
  fecha: string
  fechaEvento: string // Para compatibilidad con algunos componentes
  lugar?: string
  ubicacion?: string
  imagenUrl?: string
  carreraId?: number | null
  carreraSlug?: string
  carreraNombre?: string
  tipo: 'conferencia' | 'workshop' | 'feria' | 'charla' | 'seminario' | string
  publicado?: boolean
  capacidad: number
  inscritos: number
  createdBy?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface Publicacion {
  id: number
  titulo: string
  autor?: string
  resumen?: string
  archivoUrl?: string
  fecha?: string
  fechaPublicacion?: string
  carreraSlug?: string
  carreraNombre: string
  tipo: 'investigacion' | 'proyecto' | 'tesis' | 'articulo' | string
  publicada?: boolean
}

export interface User {
  id: string
  email: string
  nombre: string
  rol: 'admin' | 'docente' | 'estudiante' | string
}

export interface MallaCurricular {
  semestre: number
  materias: Materia[]
}

// ============================================
// Personas (Docentes, Directores, etc.)
// ============================================

export interface Persona {
  id: number
  nombre: string
  email: string
  telefono?: string
  rol: 'docente' | 'director' | 'coordinador' | 'investigador' | string
  carreraSlug?: string
  carreraNombre?: string
  fotoUrl?: string
  bio?: string
  especialidad?: string
  gradoAcademico?: string
  publicaciones?: number
  linkedinUrl?: string
  googleScholarUrl?: string
  carreraBase?: string
  areas?: string[]
  materias?: MateriaDocenteDto[]
}

export interface MateriaDocenteDto {
  id: number
  sigla: string
  nombre: string
  area?: string
}

export interface DocenteResumen {
  id: number
  nombre: string
  fotoUrl?: string
}

// ============================================
// Materias y Paralelos
// ============================================

export interface Paralelo {
  id: number
  materiaId: number
  materiaSigla?: string
  materiaNombre?: string
  codigo: string 
  horario: string 
  aula?: string
  docenteId: number
  docenteNombre: string
  cupo: number
  inscritos: number
  disponible: boolean
}

export interface Materia {
  id: number
  sigla: string 
  nombre: string 
  descripcion?: string
  creditos: number
  carreraSlug?: string
  carreraNombre?: string
  semestre?: number 
  requisitos?: string[] 
  tipo: 'obligatoria' | 'electiva' | string
  area?: string 
  docentes?: DocenteResumen[] 
  paralelos?: Paralelo[]
}

export interface MateriaConParalelos extends Materia {
  paralelos: Paralelo[]
}