// src/lib/mockData.ts
import type { Carrera, MallaCurricular, Noticia, Evento } from '@/types'

export const carreras: Carrera[] = [
  {
    slug: 'inteligencia-artificial',
    nombre: 'Ingeniería en Inteligencia Artificial',
    descripcion: 'Forma profesionales capaces de diseñar, desarrollar e implementar sistemas inteligentes y soluciones basadas en IA',
    duracion: '5 años',
    modalidad: 'Presencial',
    imagen: '/images/carreras/ia.jpg',
    color: '#3B82F6', // Azul
    icono: '🤖',
    perfilEgresado: [
      'Diseñar y desarrollar sistemas de IA y Machine Learning',
      'Implementar soluciones de procesamiento de lenguaje natural',
      'Crear modelos de deep learning para visión computacional',
      'Aplicar IA en problemas reales de la industria'
    ],
    campoLaboral: [
      'Empresas tech nacionales e internacionales',
      'Startups de IA y ML',
      'Departamentos de innovación',
      'Consultoría en IA',
      'Investigación y desarrollo'
    ]
  },
  {
    slug: 'software',
    nombre: 'Ingeniería en Software',
    descripcion: 'Forma profesionales en el desarrollo de software de calidad, aplicando metodologías ágiles y arquitecturas modernas',
    duracion: '5 años',
    modalidad: 'Presencial',
    imagen: '/images/carreras/software.jpg',
    color: '#10B981', // Verde
    icono: '💻',
    perfilEgresado: [
      'Desarrollar aplicaciones web y móviles escalables',
      'Diseñar arquitecturas de software robustas',
      'Liderar equipos de desarrollo con metodologías ágiles',
      'Implementar prácticas DevOps y CI/CD'
    ],
    campoLaboral: [
      'Desarrollo de software empresarial',
      'Empresas de tecnología',
      'Consultoría IT',
      'Emprendimiento tecnológico',
      'Desarrollo freelance'
    ]
  },
  {
    slug: 'mecatronica',
    nombre: 'Ingeniería en Mecatrónica',
    descripcion: 'Integra conocimientos de mecánica, electrónica y computación para crear sistemas automatizados y robóticos',
    duracion: '5 años',
    modalidad: 'Presencial',
    imagen: '/images/carreras/mecatronica.jpg',
    color: '#F59E0B', // Naranja
    icono: '⚙️',
    perfilEgresado: [
      'Diseñar y construir sistemas robóticos',
      'Automatizar procesos industriales',
      'Desarrollar sistemas de control inteligente',
      'Integrar hardware y software en soluciones IoT'
    ],
    campoLaboral: [
      'Industria automotriz',
      'Automatización industrial',
      'Robótica y drones',
      'Manufactura avanzada',
      'Investigación en robótica'
    ]
  }
]

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Estudiantes de IA ganan hackathon nacional con proyecto de detección de enfermedades',
    contenido: 'Un equipo de estudiantes de Ingeniería en Inteligencia Artificial ganó el primer lugar en el Hackathon Nacional 2024 con un sistema de detección temprana de enfermedades usando redes neuronales.',
    fecha: '2024-03-15',
    imagen: '/images/noticias/hackathon-ia.jpg',
    carreraSlug: 'inteligencia-artificial',
    carreraNombre: 'Ingeniería en Inteligencia Artificial'
  },
  {
    id: 2,
    titulo: 'Nueva alianza con Microsoft para certificaciones Azure',
    contenido: 'La carrera de Ingeniería en Software firma convenio con Microsoft para ofrecer certificaciones Azure a estudiantes de forma gratuita.',
    fecha: '2024-03-10',
    imagen: '/images/noticias/microsoft-azure.jpg',
    carreraSlug: 'software',
    carreraNombre: 'Ingeniería en Software'
  },
  {
    id: 3,
    titulo: 'Laboratorio de Robótica recibe nuevo equipamiento',
    contenido: 'El laboratorio de Mecatrónica se equipa con brazos robóticos industriales y kits de Arduino avanzados para prácticas estudiantiles.',
    fecha: '2024-03-05',
    imagen: '/images/noticias/lab-robotica.jpg',
    carreraSlug: 'mecatronica',
    carreraNombre: 'Ingeniería en Mecatrónica'
  }
]

export const mallas: Record<string, MallaCurricular[]> = {
  'inteligencia-artificial': [
    {
      semestre: 1,
      materias: [
        { codigo: 'MAT101', nombre: 'Cálculo I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'FIS101', nombre: 'Física I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Física' },
        { codigo: 'IAI101', nombre: 'Introducción a la Programación', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'IAI102', nombre: 'Introducción a la IA', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'IA' }
      ]
    },
    {
      semestre: 2,
      materias: [
        { codigo: 'MAT102', nombre: 'Cálculo II', creditos: 8, requisitos: ['MAT101'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'IAI201', nombre: 'Estructuras de Datos', creditos: 8, requisitos: ['IAI101'], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'IAI202', nombre: 'Álgebra Lineal', creditos: 6, requisitos: ['MAT101'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'IAI203', nombre: 'Estadística', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' }
      ]
    }
    // ... más semestres
  ],
  'software': [
    {
      semestre: 1,
      materias: [
        { codigo: 'MAT101', nombre: 'Cálculo I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'SWE101', nombre: 'Introducción a la Programación', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'SWE102', nombre: 'Fundamentos de Ingeniería de Software', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Software' }
      ]
    }
    // ... más semestres
  ],
  'mecatronica': [
    {
      semestre: 1,
      materias: [
        { codigo: 'MAT101', nombre: 'Cálculo I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'FIS101', nombre: 'Física I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Física' },
        { codigo: 'MEC101', nombre: 'Dibujo Técnico', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Mecánica' },
        { codigo: 'MEC102', nombre: 'Introducción a la Mecatrónica', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'Mecatrónica' }
      ]
    }
    // ... más semestres
  ]
}