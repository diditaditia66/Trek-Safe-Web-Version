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
  // ✅ hooks di TOP-LEVEL (jangan pernah taruh setelah "return")
  const { authStatus } = useAuthenticator(ctx => [ctx.authStatus])
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const emailValid = email.trim().length > 0

  // Selalu panggil useEffect; jangan early-return sebelum ini
  React.useEffect(() => {
    if (authStatus === 'authenticated') {
      const to = (location.state && location.state.from) || { pathname: '/home' }
      navigate(to, { replace: true })
    }
  }, [authStatus, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  async function googleSignIn() {
    try {
      setBusy(true)
      // Provider name harus sesuai konfigurasi Cognito (umumnya 'Google')
      await signInWithRedirect({ provider: 'Google' })
    } catch (e) {
      console.error('Google redirect failed:', e)
      alert('Google Sign-In gagal. Cek konfigurasi OAuth di Amplify.')
      setBusy(false)
    }
  }

  function continueWithEmail(e) {
    e.preventDefault()
    if (!emailValid) return
    // Sama seperti Flutter: lompat ke halaman Create Account (form sign up)
    navigate('/create-account', { state: { prefillEmail: email.trim() } })
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      {/* Background image */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/background.png)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }}
      />
      {/* Light overlay */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.86)' }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24
      }}>
        <form
          onSubmit={continueWithEmail}
          style={{
            width: 420, maxWidth: '100%', background: '#fff',
            borderRadius: 12, border: '1px solid #E6E9EE',
            boxShadow: '0 8px 32px rgba(16,24,40,.10)', padding: 20
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: .2 }}>Trek Safe</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Create an account</div>
            <div style={{ marginTop: 6, color: '#667085', fontSize: 14 }}>
              Enter your email to sign up for this app
            </div>
          </div>

          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#475467' }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@domain.com"
              autoComplete="email"
              required
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            disabled={!emailValid || busy}
            style={{
              ...primaryBtn,
              width: '100%',
              marginTop: 12,
              opacity: (!emailValid || busy) ? .6 : 1,
              pointerEvents: (!emailValid || busy) ? 'none' : 'auto'
            }}
          >
            Continue
          </button>

          <div style={{ margin: '16px 0', textAlign: 'center', color: '#98A2B3' }}>or</div>

          <button
            type="button"
            onClick={googleSignIn}
            disabled={busy}
            style={{
              ...outlineBtn,
              width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <img src="/images/google_icon.png" width="20" height="20" alt="" />
            Continue with Google
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: '#98A2B3', textAlign: 'center' }}>
            By clicking continue, you agree to our Terms of Service and Privacy Policy
          </div>
        </form>
      </div>

      {/* Overlay loader saat Amplify "configuring" atau proses redirect */}
      {(authStatus === 'configuring' || busy) && <LoaderInline />}
    </div>
  )
}

/* styles */
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  outline: 'none',
  background: '#fff'
}
const primaryBtn = {
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
