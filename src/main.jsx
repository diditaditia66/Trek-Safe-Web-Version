import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureAmplify } from './amplifyClient'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

// ⬇️ TUNGGU konfigurasi selesai sebelum render
;(async () => {
  await configureAmplify()
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </React.StrictMode>
  )
})()
