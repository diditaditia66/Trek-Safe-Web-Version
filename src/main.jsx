import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureAmplify } from './amplifyClient'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import ErrorBoundary from './ErrorBoundary'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root tidak ditemukan')
rootEl.textContent = 'Loading…'

;(async () => {
  try {
    await configureAmplify()
    const root = ReactDOM.createRoot(rootEl)
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <Authenticator.Provider>
            <App />
          </Authenticator.Provider>
        </ErrorBoundary>
      </React.StrictMode>
    )
  } catch (e) {
    console.error('[boot] gagal render', e)
    rootEl.textContent = 'Gagal memuat aplikasi. Cek console.'
  }
})()
