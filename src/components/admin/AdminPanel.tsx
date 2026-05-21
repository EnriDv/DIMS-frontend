// frontend/src/components/admin/AdminPanel.tsx
import { useState } from 'react'
import GestionNoticiasPanel from './GestionNoticiasPanel'
import GestionEventosPanel from './GestionEventosPanel'
import RoleProtected from '../auth/RoleProtected'
import { withQueryClient } from '@/lib/queryClient' // <--- Importamos el envoltorio para arreglar el console error

function AdminPanel() {
  // Estado local para gestionar la pestaña activa. Por defecto: noticias.
  const [activeTab, setActiveTab] = useState<'noticias' | 'eventos'>('noticias')

  return (
    <div>
      {/* Navegación del Panel. Gestión de estado completamente en React */}
      <div className="mb-8 flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('noticias')} 
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'noticias' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'
          }`}
        >
          GESTIÓN_NOTICIAS
        </button>
        <button 
          onClick={() => setActiveTab('eventos')} 
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'eventos' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'
          }`}
        >
          GESTIÓN_EVENTOS
        </button>
      </div>

      {/* Renderizado condicional basado en el estado activo */}
      <RoleProtected allowedRoles={['admin', 'docente']}>
        {activeTab === 'noticias' && (
          <div id="panel-noticias" className="block">
            <GestionNoticiasPanel />
          </div>
        )}
        {activeTab === 'eventos' && (
          <div id="panel-eventos" className="block">
            <GestionEventosPanel />
          </div>
        )}
      </RoleProtected>
    </div>
  )
}

// Exportamos envuelto para inyectar el QueryClient y arreglar el error de consola.
export default withQueryClient(AdminPanel)