import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(p){ super(p); this.state = { hasError: false, err: null } }
  static getDerivedStateFromError(err){ return { hasError: true, err } }
  componentDidCatch(err, info){ console.error('[ErrorBoundary]', err, info) }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{padding:16,fontFamily:'system-ui',color:'#111'}}>
          <h2>Terjadi error saat memuat aplikasi</h2>
          <p>Buka Console untuk detailnya.</p>
        </div>
      )
    }
    return this.props.children
  }
}
