// frontend/src/lib/queryClient.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      gcTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// HOC (Higher-Order Component)
export function withQueryClient<T extends object>(Component: React.ComponentType<T>) {
  return function QueryWrappedComponent(props: T) {
    return (
      // Provide the client to your App
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    )
  }
}