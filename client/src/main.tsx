import { StrictMode, Component } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './styles/main.scss'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1 } },
})

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', background: '#fee2e2', minHeight: '100vh' }}>
          <h1 style={{ color: '#991b1b', marginBottom: 16 }}>🚨 Erreur React capturée</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#7f1d1d', fontSize: 14 }}>
            <strong>Message:</strong> {err.message}{'\n\n'}
            <strong>Stack:</strong>{'\n'}{err.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)

