// Detecta si el código está corriendo en el servidor (SSR)
export function isSSR() {
  return typeof window === 'undefined'
}
