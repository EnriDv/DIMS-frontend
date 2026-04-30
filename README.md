
# DIMS Core - Advanced Engineering Hub (UCB)

**DIMS Core** es una plataforma integral diseñada para centralizar la actividad académica, informativa y administrativa de las facultades de ingeniería de la Universidad Católica Boliviana. El sistema combina una experiencia de usuario rápida y optimizada para SEO con una robusta arquitectura empresarial en el backend.

## 🚀 Descripción del Proyecto
El proyecto sirve como el nodo central de información para carreras como **Ingeniería de Software, Inteligencia Artificial y Mecatrónica**. Permite a los estudiantes explorar mallas curriculares, mantenerse al tanto de noticias y eventos, y acceder a un repositorio de investigaciones, mientras brinda a los docentes y administradores herramientas seguras para gestionar el contenido en tiempo real.

## 🛠️ Tecnologías Usadas

### Frontend (Modern Web Stack)
* **Astro**: Framework principal para la generación de sitios estáticos (SSG) y renderizado en el servidor (SSR), priorizando el rendimiento.
* **React**: Utilizado para las "Islas de Interactividad" (formularios complejos, listas filtrables y estados dinámicos).
* **TanStack Query (React Query)**: Gestión de estado asíncrono, caché inteligente y sincronización con la API de .NET.
* **Tailwind CSS**: Diseño moderno orientado a **Modo Claro** (Light Mode) con tipografía técnica y estética limpia.
* **Nanostores**: Estado global ligero y persistencia en `localStorage` para la sesión del usuario.

### Backend (Enterprise Architecture)
* **C# .NET 10**: Núcleo del sistema utilizando **CQRS con MediatR** para una separación clara de responsabilidades.
* **PostgreSQL**: Base de datos relacional para el almacenamiento de registros académicos y de usuario.
* **Entity Framework Core**: ORM para la gestión de modelos y relaciones complejas entre carreras, materias y docentes.
* **JWT (JSON Web Tokens)**: Seguridad y autenticación basada en roles.

---

## 🌟 Funcionalidades Principales

### 👨‍🎓 Área Pública (Estudiantes y Visitantes)
* **Directorio de Carreras**: Visualización detallada de perfiles de egresado, campo laboral y duración.
* **Malla Curricular Dinámica**: Exploración de materias agrupadas por semestre con detalles de créditos, tipo (obligatoria/electiva) y docentes asignados.
* **Control de Paralelos**: Consulta en tiempo real de horarios, aulas y disponibilidad de cupos.
* **Hub de Noticias**: Noticias institucionales filtrables por carrera.
* **Calendario de Eventos**: Registro de conferencias, talleres y ferias académicas con fechas futuras.
* **Repositorio Académico**: Acceso a proyectos de grado, tesis e investigaciones/publicaciones.astro].

### 🔐 Área Administrativa (Docentes y Admins)
* **Gestión de Contenido (CMS)**: Formularios protegidos para la creación de noticias y eventos académicos.
* **Protección por Roles**: Interfaz adaptativa que oculta o muestra herramientas de edición según el rango del usuario (`admin`, `docente`, `estudiante`).
* **Sistema de Autenticación**: Inicio de sesión seguro con persistencia de sesión y manejo de errores de autorización.

---

## 📂 Estructura de Carpetas (Frontend)
```bash
src/
├── components/       # Componentes React e Islas de Astro
│   ├── admin/        # Formularios de gestión protegidos
│   ├── auth/         # Login y guardias de seguridad por rol
│   ├── layout/       # Header, Footer y Navegación
│   └── materias/     # Listas, Cards y Detalle de asignaturas
├── hooks/            # Hooks de TanStack Query para cada entidad
├── lib/              # Cliente API universal y configuración de QueryClient
├── pages/            # Rutas de Astro (Filesystem Routing)
├── stores/           # Estado global con Nanostores
└── types/            # Definición de interfaces TypeScript (DTOs)
```

---

## 🚀 Instrucciones de Ejecución

### 1. Requisitos Previos
* **Node.js** (v18 o superior).
* **SDK de .NET 10**.
* **PostgreSQL** ejecutándose localmente.

### 2. Configuración del Backend
1.  Navega a la carpeta del servidor.
2.  Actualiza la cadena de conexión en `appsettings.json` hacia tu base de datos PostgreSQL.
3.  Ejecuta las migraciones: `dotnet ef database update`.
4.  Inicia el servidor:
    ```bash
    dotnet run
    ```
    *El backend debe estar disponible en `http://localhost:5231`*.

### 3. Configuración del Frontend
1.  Navega a la carpeta `DIMS_Astro`.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el entorno de desarrollo:
    ```bash
    npm run dev
    ```
    *Accede a la plataforma en `http://localhost:4321`*.

---

## 🔑 Credenciales de Prueba (Admin Inicial)
* **Usuario:** `admin@ucb.edu.bo`
* **Contraseña:** `hash_simulado_123` (Definida en script de carga inicial).

---
**Desarrollado por:** Enrique Diaz
**Institución:** Universidad Católica Boliviana "San Pablo"