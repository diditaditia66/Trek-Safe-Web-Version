import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureAmplify } from './amplifyClient'
import { Authenticator } from '@aws-amplify/ui-react'  // ⬅️ tambah ini
import '@aws-amplify/ui-react/styles.css'

configureAmplify()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Authenticator.Provider>   {/* ⬅️ provider untuk useAuthenticator */}
      <App />
    </Authenticator.Provider>
  </React.StrictMode>
)
