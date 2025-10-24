// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureAmplify } from './amplifyClient'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

// tampilkan placeholder agar tidak polos saat inisialisasi
const rootEl = document.getElementById('root')
rootEl.textContent = 'Loading…'

;(async () => {
  await configureAmplify()
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </React.StrictMode>
  )
})()
