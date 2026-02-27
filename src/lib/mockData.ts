// src/lib/mockData.ts
import type { Carrera, MallaCurricular, Noticia, Evento, Publicacion } from '@/types'

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
      'Aplicar IA en problemas reales de la industria',
      'Desarrollar sistemas de recomendación y análisis predictivo'
    ],
    campoLaboral: [
      'Empresas tech nacionales e internacionales',
      'Startups de IA y ML',
      'Departamentos de innovación',
      'Consultoría en IA',
      'Investigación y desarrollo',
      'Data Science y Analytics'
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
      'Implementar prácticas DevOps y CI/CD',
      'Garantizar calidad de software mediante testing'
    ],
    campoLaboral: [
      'Desarrollo de software empresarial',
      'Empresas de tecnología',
      'Consultoría IT',
      'Emprendimiento tecnológico',
      'Desarrollo freelance',
      'Arquitectura de soluciones'
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
      'Integrar hardware y software en soluciones IoT',
      'Crear prototipos de dispositivos mecatrónicos'
    ],
    campoLaboral: [
      'Industria automotriz',
      'Automatización industrial',
      'Robótica y drones',
      'Manufactura avanzada',
      'Investigación en robótica',
      'Sistemas de control'
    ]
  }
]

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Estudiantes de IA ganan hackathon nacional con proyecto de detección de enfermedades',
    contenido: '<p>Un equipo de estudiantes de Ingeniería en Inteligencia Artificial de la UCB conquistó el primer lugar en el Hackathon Nacional 2024 con un innovador sistema de detección temprana de enfermedades usando redes neuronales convolucionales.</p><p>El proyecto, denominado "MediAI", utiliza técnicas de deep learning para analizar radiografías y detectar patrones asociados a enfermedades pulmonares con una precisión del 92%.</p>',
    fecha: '2024-03-15',
    imagen: '/images/noticias/hackathon-ia.jpg',
    carreraSlug: 'inteligencia-artificial',
    carreraNombre: 'Ingeniería en Inteligencia Artificial'
  },
  {
    id: 2,
    titulo: 'Nueva alianza con Microsoft para certificaciones Azure',
    contenido: '<p>La carrera de Ingeniería en Software firma un importante convenio con Microsoft para ofrecer certificaciones Azure a estudiantes de forma gratuita.</p><p>Los alumnos podrán acceder a cursos de Azure Fundamentals, Developer Associate y Solutions Architect sin costo alguno.</p>',
    fecha: '2024-03-10',
    imagen: '/images/noticias/microsoft-azure.jpg',
    carreraSlug: 'software',
    carreraNombre: 'Ingeniería en Software'
  },
  {
    id: 3,
    titulo: 'Laboratorio de Robótica recibe nuevo equipamiento de última generación',
    contenido: '<p>El laboratorio de Mecatrónica se moderniza con la llegada de brazos robóticos industriales de 6 ejes, kits de Arduino avanzados y sistemas de visión artificial.</p><p>Esta inversión permitirá a los estudiantes realizar prácticas con tecnología de punta utilizada en la industria 4.0.</p>',
    fecha: '2024-03-05',
    imagen: '/images/noticias/lab-robotica.jpg',
    carreraSlug: 'mecatronica',
    carreraNombre: 'Ingeniería en Mecatrónica'
  },
  {
    id: 4,
    titulo: 'Bootcamp intensivo de React y Node.js para estudiantes de Software',
    contenido: '<p>Durante dos semanas, estudiantes de Ingeniería en Software participaron en un bootcamp intensivo de desarrollo full-stack con React y Node.js, impartido por desarrolladores senior de empresas tech.</p>',
    fecha: '2024-02-28',
    imagen: '/images/noticias/bootcamp-react.jpg',
    carreraSlug: 'software',
    carreraNombre: 'Ingeniería en Software'
  },
  {
    id: 5,
    titulo: 'Proyecto de IA para optimizar rutas de transporte público gana premio nacional',
    contenido: '<p>Un proyecto de tesis de Ingeniería en IA que utiliza algoritmos genéticos para optimizar rutas de transporte público fue galardonado con el Premio Nacional de Innovación Tecnológica 2024.</p>',
    fecha: '2024-02-20',
    imagen: '/images/noticias/transporte-ia.jpg',
    carreraSlug: 'inteligencia-artificial',
    carreraNombre: 'Ingeniería en Inteligencia Artificial'
  }
]

export const eventos: Evento[] = [
  {
    id: 1,
    titulo: 'Workshop: Introducción a TensorFlow y PyTorch',
    descripcion: 'Taller práctico sobre los frameworks más populares de deep learning. Aprende a construir tus primeras redes neuronales.',
    fechaEvento: '2024-04-15T14:00:00',
    lugar: 'Laboratorio de Computación - Edificio B',
    tipo: 'workshop',
    imagen: '/images/eventos/tensorflow-workshop.jpg',
    carreraSlug: 'inteligencia-artificial'
  },
  {
    id: 2,
    titulo: 'Charla: Arquitecturas de Microservicios con Docker y Kubernetes',
    descripcion: 'Experto en DevOps compartirá mejores prácticas para diseñar e implementar arquitecturas de microservicios escalables.',
    fechaEvento: '2024-04-20T18:00:00',
    lugar: 'Auditorio Principal',
    tipo: 'charla',
    imagen: '/images/eventos/microservicios.jpg',
    carreraSlug: 'software'
  },
  {
    id: 3,
    titulo: 'Competencia de Robots Seguidores de Línea',
    descripcion: 'Competencia anual donde estudiantes diseñan y programan robots autónomos para seguir trayectorias complejas.',
    fechaEvento: '2024-04-25T09:00:00',
    lugar: 'Patio Central',
    tipo: 'feria',
    imagen: '/images/eventos/robots-competencia.jpg',
    carreraSlug: 'mecatronica'
  },
  {
    id: 4,
    titulo: 'Conferencia: El futuro de la IA Generativa',
    descripcion: 'Análisis de las últimas tendencias en IA generativa, desde GPT-4 hasta modelos de difusión para imágenes.',
    fechaEvento: '2024-05-05T16:00:00',
    lugar: 'Virtual - Zoom',
    tipo: 'conferencia',
    imagen: '/images/eventos/ia-generativa.jpg',
    carreraSlug: 'inteligencia-artificial'
  },
  {
    id: 5,
    titulo: 'Hackathon UCB 2024',
    descripcion: 'Maratón de programación de 48 horas donde equipos multidisciplinarios desarrollan soluciones innovadoras a problemas reales.',
    fechaEvento: '2024-05-10T08:00:00',
    lugar: 'Campus UCB',
    tipo: 'feria',
    imagen: '/images/eventos/hackathon.jpg',
    carreraSlug: 'software'
  }
]

export const publicaciones: Publicacion[] = [
  {
    id: 1,
    titulo: 'Sistema de reconocimiento facial usando redes neuronales convolucionales',
    autor: 'Juan Pérez, María García',
    resumen: 'Implementación de un sistema de reconocimiento facial en tiempo real utilizando CNNs y OpenCV.',
    archivo: '/publicaciones/reconocimiento-facial.pdf',
    fechaPublicacion: '2024-01-15',
    carreraSlug: 'inteligencia-artificial',
    tipo: 'proyecto'
  },
  {
    id: 2,
    titulo: 'Aplicación web de gestión de inventarios con arquitectura hexagonal',
    autor: 'Carlos Rodríguez',
    resumen: 'Desarrollo de una aplicación empresarial siguiendo principios de Clean Architecture y Domain-Driven Design.',
    archivo: '/publicaciones/gestion-inventarios.pdf',
    fechaPublicacion: '2024-02-10',
    carreraSlug: 'software',
    tipo: 'tesis'
  },
  {
    id: 3,
    titulo: 'Diseño y construcción de brazo robótico de 5 DOF controlado por visión artificial',
    autor: 'Ana Martínez, Luis Fernández',
    resumen: 'Prototipo de brazo robótico capaz de identificar y manipular objetos mediante procesamiento de imágenes.',
    archivo: '/publicaciones/brazo-robotico.pdf',
    fechaPublicacion: '2023-12-20',
    carreraSlug: 'mecatronica',
    tipo: 'proyecto'
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
        { codigo: 'IAI102', nombre: 'Introducción a la IA', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'IA' },
        { codigo: 'HUM101', nombre: 'Comunicación', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'Humanidades' }
      ]
    },
    {
      semestre: 2,
      materias: [
        { codigo: 'MAT102', nombre: 'Cálculo II', creditos: 8, requisitos: ['MAT101'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'IAI201', nombre: 'Estructuras de Datos', creditos: 8, requisitos: ['IAI101'], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'IAI202', nombre: 'Álgebra Lineal', creditos: 6, requisitos: ['MAT101'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'IAI203', nombre: 'Estadística I', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'FIS102', nombre: 'Física II', creditos: 8, requisitos: ['FIS101'], tipo: 'obligatoria', area: 'Física' }
      ]
    },
    {
      semestre: 3,
      materias: [
        { codigo: 'MAT201', nombre: 'Cálculo III', creditos: 8, requisitos: ['MAT102'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'IAI301', nombre: 'Algoritmos y Complejidad', creditos: 8, requisitos: ['IAI201'], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'IAI302', nombre: 'Probabilidad', creditos: 6, requisitos: ['IAI203'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'IAI303', nombre: 'Bases de Datos', creditos: 6, requisitos: ['IAI201'], tipo: 'obligatoria', area: 'Programación' }
      ]
    }
  ],
  'software': [
    {
      semestre: 1,
      materias: [
        { codigo: 'MAT101', nombre: 'Cálculo I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'SWE101', nombre: 'Introducción a la Programación', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'SWE102', nombre: 'Fundamentos de Ingeniería de Software', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Software' },
        { codigo: 'HUM101', nombre: 'Comunicación', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'Humanidades' }
      ]
    },
    {
      semestre: 2,
      materias: [
        { codigo: 'MAT102', nombre: 'Cálculo II', creditos: 8, requisitos: ['MAT101'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'SWE201', nombre: 'Programación Orientada a Objetos', creditos: 8, requisitos: ['SWE101'], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'SWE202', nombre: 'Estructuras de Datos', creditos: 8, requisitos: ['SWE101'], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'SWE203', nombre: 'Bases de Datos I', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Datos' }
      ]
    },
    {
      semestre: 3,
      materias: [
        { codigo: 'SWE301', nombre: 'Desarrollo Web', creditos: 8, requisitos: ['SWE201'], tipo: 'obligatoria', area: 'Desarrollo' },
        { codigo: 'SWE302', nombre: 'Algoritmos', creditos: 8, requisitos: ['SWE202'], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'SWE303', nombre: 'Arquitectura de Software', creditos: 6, requisitos: ['SWE201'], tipo: 'obligatoria', area: 'Software' },
        { codigo: 'SWE304', nombre: 'Bases de Datos II', creditos: 6, requisitos: ['SWE203'], tipo: 'obligatoria', area: 'Datos' }
      ]
    }
  ],
  'mecatronica': [
    {
      semestre: 1,
      materias: [
        { codigo: 'MAT101', nombre: 'Cálculo I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'FIS101', nombre: 'Física I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Física' },
        { codigo: 'MEC101', nombre: 'Dibujo Técnico', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Mecánica' },
        { codigo: 'MEC102', nombre: 'Introducción a la Mecatrónica', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'Mecatrónica' },
        { codigo: 'HUM101', nombre: 'Comunicación', creditos: 4, requisitos: [], tipo: 'obligatoria', area: 'Humanidades' }
      ]
    },
    {
      semestre: 2,
      materias: [
        { codigo: 'MAT102', nombre: 'Cálculo II', creditos: 8, requisitos: ['MAT101'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'FIS102', nombre: 'Física II', creditos: 8, requisitos: ['FIS101'], tipo: 'obligatoria', area: 'Física' },
        { codigo: 'MEC201', nombre: 'Programación I', creditos: 8, requisitos: [], tipo: 'obligatoria', area: 'Programación' },
        { codigo: 'MEC202', nombre: 'Circuitos Eléctricos', creditos: 6, requisitos: [], tipo: 'obligatoria', area: 'Electrónica' }
      ]
    },
    {
      semestre: 3,
      materias: [
        { codigo: 'MAT201', nombre: 'Ecuaciones Diferenciales', creditos: 8, requisitos: ['MAT102'], tipo: 'obligatoria', area: 'Matemáticas' },
        { codigo: 'MEC301', nombre: 'Mecánica de Materiales', creditos: 8, requisitos: ['FIS102'], tipo: 'obligatoria', area: 'Mecánica' },
        { codigo: 'MEC302', nombre: 'Electrónica Analógica', creditos: 6, requisitos: ['MEC202'], tipo: 'obligatoria', area: 'Electrónica' },
        { codigo: 'MEC303', nombre: 'Sistemas Digitales', creditos: 6, requisitos: ['MEC201'], tipo: 'obligatoria', area: 'Electrónica' }
      ]
    }
  ]
}