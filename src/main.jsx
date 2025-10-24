// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureAmplify } from './amplifyClient'
import { AmplifyProvider, Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import ErrorBoundary from './ErrorBoundary'
import { trekTheme } from './ui/theme' // pastikan file ini ada (lihat tema yang kuberikan)

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root tidak ditemukan')
const root = ReactDOM.createRoot(rootEl)

// placeholder awal agar tidak polos
root.render(<div style={{ padding: 24, textAlign: 'center' }}>Loading…</div>)

;(async () => {
  try {
    await configureAmplify()

    root.render(
      <React.StrictMode>
        <AmplifyProvider theme={trekTheme}>
          <ErrorBoundary>
            <Authenticator.Provider>
              <App />
            </Authenticator.Provider>
          </ErrorBoundary>
        </AmplifyProvider>
      </React.StrictMode>
    )
  } catch (e) {
    console.error('[boot] gagal render', e)
    root.render(
      <div style={{ padding: 24, textAlign: 'center' }}>
        Gagal memuat aplikasi. Cek console.
      </div>
    )
  }
})()
