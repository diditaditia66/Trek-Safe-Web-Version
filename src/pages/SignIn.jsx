import React, { useEffect } from 'react'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { useLocation, useNavigate } from 'react-router-dom'

function Loader() {
  return <div style={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>Loading…</div>
}

export default function SignIn() {
  const { authStatus } = useAuthenticator(ctx => [ctx.authStatus])
  const navigate = useNavigate()
  const location = useLocation()

  // Saat Amplify masih konfigurasi, tampilkan loader (hindari flicker)
  if (authStatus === 'configuring') return <Loader />

  // Jika sudah login, arahkan ke halaman tujuan (atau /home)
  useEffect(() => {
    if (authStatus === 'authenticated') {
      const to = (location.state && location.state.from) || { pathname: '/home' }
      navigate(to, { replace: true })
    }
  }, [authStatus, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div>
        <h1 style={{ textAlign: 'center' }}>Sign in</h1>
        <Authenticator
          initialState="signIn"
          socialProviders={['google']}
        />
      </div>
    </div>
  )
}
