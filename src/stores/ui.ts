// frontend/src/stores/ui.ts
import { atom, computed } from 'nanostores'

export const $mobileMenuOpen = atom<boolean>(false)
export const $activeModal = atom<string | null>(null)
export const $isLoading = atom<boolean>(false)

/**
 * Hay algún overlay activo (menu o modal)?
 */
export const $hasOverlay = computed(
  [$mobileMenuOpen, $activeModal],
  (menuOpen, modal) => menuOpen || modal !== null
)

// ============================================
// Actions
// ============================================

export function toggleMobileMenu() {
  $mobileMenuOpen.set(!$mobileMenuOpen.get())
}

export function closeMobileMenu() {
  $mobileMenuOpen.set(false)
}

export function openModal(modalId: string) {
  $activeModal.set(modalId)
}

export function closeModal() {
  $activeModal.set(null)
}

export function setLoading(loading: boolean) {
  $isLoading.set(loading)
}