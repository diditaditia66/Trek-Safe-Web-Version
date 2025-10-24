import React from 'react'
import { Authenticator } from '@aws-amplify/ui-react'
export default function SignIn() {
  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'70vh'}}>
      <div>
        <h1 style={{textAlign:'center'}}>Sign in</h1>
        <Authenticator initialState="signIn" socialProviders={['google']} />
      </div>
    </div>
  )
}
