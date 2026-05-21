// frontend/src/middleware.ts
import { defineMiddleware } from 'astro:middleware'
import { getUserRoleFromToken } from './lib/jwt'

const protectedRoutes = ['/dashboard', '/perfil', '/admin']
const adminOnlyRoutes = ['/admin']

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context

  const isProtected = protectedRoutes.some((route) => url.pathname.startsWith(route))
  const token = cookies.get('auth_token')?.value

  if (isProtected) {
    if (!token) {
      return redirect('/login')
    }

    const isAdminRoute = adminOnlyRoutes.some((route) => url.pathname.startsWith(route))
    if (isAdminRoute) {
      const role = getUserRoleFromToken(token)
      if (role !== 'admin') {
        // Podrías devolver un 403 HTML aquí o redirigir
        return new Response('403 Forbidden', { status: 403 })
      }
    }
  }

  // Prevenir que un usuario ya logueado acceda a /login
  if (url.pathname.startsWith('/login') && token) {
    return redirect('/')
  }

  return next()
})
