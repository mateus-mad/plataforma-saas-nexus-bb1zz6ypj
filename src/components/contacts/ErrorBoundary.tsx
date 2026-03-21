import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-rose-50 rounded-xl border border-rose-200 w-full h-full min-h-[300px]">
            <h2 className="text-xl font-bold text-rose-800 mb-2">Ops! Algo deu errado.</h2>
            <p className="text-rose-600 text-sm">
              A interface encontrou um erro inesperado. Por favor, recarregue a página.
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
