// frontend/src/stores/index.ts
// Auth
export {
  $currentUser,
  $accessToken,
  $refreshToken,
  $authLoading,
  $authError,
  login,
  logout,
  isAuthenticated,
  getAccessToken,
  setTokens,
  setAuthLoading,
  setAuthError,
} from './auth'

// Noticias
export {
  $noticiasCache,
  $noticiasLoading,
  $noticiasError,
  setNoticias,
  addNoticia,
  updateNoticia,
  removeNoticia,
  setNoticiasLoading,
  setNoticiasError,
  invalidateNoticiasCache,
  getNoticiasPorCarrera,
} from './noticias'

// Eventos
export {
  $eventosCache,
  $eventosLoading,
  $eventosError,
  $eventosProximos,
  setEventos,
  addEvento,
  updateEvento,
  removeEvento,
  setEventosLoading,
  setEventosError,
  invalidateEventosCache,
  getEventosPorCarrera,
} from './eventos'

// Filters
export {
  $carreraActiva,
  $searchQuery,
  setCarreraActiva,
  clearCarreraActiva,
  setSearchQuery,
  clearSearch,
} from './filters'

// UI
export {
  $mobileMenuOpen,
  $activeModal,
  $isLoading,
  $hasOverlay,
  toggleMobileMenu,
  closeMobileMenu,
  openModal,
  closeModal,
  setLoading,
} from './ui'

// Carreras
//export { $carreras, getCarreraBySlug, $carrerasActivas } from './carreras'