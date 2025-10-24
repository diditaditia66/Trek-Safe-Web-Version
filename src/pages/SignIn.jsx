import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { signInWithRedirect } from 'aws-amplify/auth'

function LoaderInline() {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'grid', placeItems: 'center',
      background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(2px)', zIndex: 50
    }}>
      <div>Loading…</div>
    </div>
  )
}

export default function SignIn() {
  const { authStatus } = useAuthenticator(ctx => [ctx.authStatus])
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = React.useState(false)

  React.useEffect(() => {
    if (authStatus === 'authenticated') {
      const to = (location.state && location.state.from) || { pathname: '/home' }
      navigate(to, { replace: true })
    }
  }, [authStatus, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  async function googleSignIn() {
    try {
      setBusy(true)
      await signInWithRedirect({ provider: 'Google' })
    } catch (e) {
      console.error('Google redirect failed:', e)
      alert('Google Sign-In gagal. Cek konfigurasi OAuth di Amplify.')
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/background.png)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}
      />
      {/* Overlay */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,.86)'
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24
      }}>
        <div style={{
          width: 420, maxWidth: '100%', background: '#fff',
          borderRadius: 12, border: '1px solid #E6E9EE',
          boxShadow: '0 8px 32px rgba(16,24,40,.10)', padding: 20
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>Trek Safe</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Welcome Back</div>
            <div style={{ marginTop: 6, color: '#667085', fontSize: 14 }}>
              Please choose a sign-in method
            </div>
          </div>

          <button
            onClick={() => navigate('/create-account')}
            style={primaryBtn}
          >
            Create Account
          </button>

          <div style={{ margin: '16px 0', textAlign: 'center', color: '#98A2B3' }}>or</div>

          <button
            onClick={googleSignIn}
            disabled={busy}
            style={{
              ...outlineBtn,
              width: '100%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <img src="/images/google_icon.png" width="20" height="20" alt="" />
            Continue with Google
          </button>
        </div>
      </div>

      {(authStatus === 'configuring' || busy) && <LoaderInline />}
    </div>
  )
}

/* Styles */
const primaryBtn = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
}
const outlineBtn = {
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  color: '#111',
  fontWeight: 700,
  cursor: 'pointer'
}
