import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'

export default function CreateAccount() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div>
        <h1 style={{ textAlign: 'center' }}>Create Account</h1>
        <Authenticator initialState="signUp" socialProviders={['google']} />
      </div>
    </div>
  )
}
