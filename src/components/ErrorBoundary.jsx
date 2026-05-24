import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#220000', color: '#ffaaaa', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2>FATAL REACT CRASH</h2>
          <p>{this.state.error?.toString()}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', opacity: 0.8 }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: 10, background: '#ffaaaa', color: '#220000', border: 'none', cursor: 'pointer' }}>RELOAD PAGE</button>
        </div>
      )
    }
    return this.props.children
  }
}
