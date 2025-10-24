import React, { useEffect } from 'react'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { useNavigate } from 'react-router-dom'

export default function SignIn() {
  const { authStatus } = useAuthenticator(ctx => [ctx.authStatus])
  const navigate = useNavigate()
  useEffect(() => {
    if (authStatus === 'authenticated') navigate('/home')
  }, [authStatus, navigate])

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'70vh'}}>
      <div>
        <h1 style={{textAlign:'center'}}>Sign in</h1>
        <Authenticator initialState="signIn" socialProviders={['google']} />
      </div>
    </div>
  )
}
