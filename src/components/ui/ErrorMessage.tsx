// frontend/src/components/ui/ErrorMessage.tsx
interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Error icon"
        >
          <title>Error</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-1">Error</h3>
          <p className="text-red-700">{message}</p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}
