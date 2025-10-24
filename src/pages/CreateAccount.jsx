import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
// Amplify Auth v6
import { signUp } from 'aws-amplify/auth'

export default function CreateAccount() {
  // ✅ hooks di top-level (stabil)
  const navigate = useNavigate()
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState({ type: '', text: '' })

  const isValid =
    name.trim().length > 0 &&
    password.length > 0 &&
    password === confirm

  const onSubmit = async (e) => {
    e?.preventDefault?.()
    if (!isValid || busy) return
    setBusy(true)
    setMsg({ type: '', text: '' })
    try {
      // ⚠️ Default: pakai "name" sebagai username (tanpa email), sesuai apps Flutter-mu
      const res = await signUp({
        username: name.trim(),
        password
        // Jika nanti butuh atribut tambahan:
        // options: { userAttributes: { email: '...' } }
      })

      // Jika pool-mu require confirm code, res.isSignUpComplete bisa false
      if (res?.isSignUpComplete) {
        navigate('/home', { replace: true })
      } else {
        // fallback aman: arahkan ke sign-in; bisa ganti ke halaman confirm code jika ada
        setMsg({ type: 'success', text: 'Account created. Please sign in.' })
        setTimeout(() => navigate('/sign-in', { replace: true }), 800)
      }
    } catch (e) {
      console.error('signUp error:', e)
      let text = 'Failed to create account.'
      if (e?.name === 'AuthConfigurationException') {
        text = 'Auth backend belum aktif/terkonfigurasi di Amplify.'
      } else if (e?.message) {
        text = e.message
      }
      setMsg({ type: 'error', text })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1)',
        }}
      />
      {/* Overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,.85)'
        }}
      />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px'
      }}>
        <div style={{
          width: 420, maxWidth: '100%',
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E6E9EE',
          boxShadow: '0 8px 32px rgba(16,24,40,.10)',
          padding: 20
        }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 0.2 }}>Trek Safe</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>Create an account</div>
          </div>

          {msg.text && (
            <div
              role="alert"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: msg.type === 'success' ? '#B7EB8F' : '#FFCCC7',
                background: msg.type === 'success' ? '#F6FFED' : '#FFF1F0',
                color: msg.type === 'success' ? '#135200' : '#A8071A',
                marginBottom: 12
              }}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <label style={labelStyle}>
              <span style={labelTextStyle}>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="username"
                style={inputStyle}
                required
              />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
                style={inputStyle}
                required
              />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle}>Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                style={inputStyle}
                required
              />
            </label>

            <button
              type="submit"
              disabled={!isValid || busy}
              style={{
                ...primaryBtnStyle,
                opacity: !isValid || busy ? 0.6 : 1,
                pointerEvents: !isValid || busy ? 'none' : 'auto'
              }}
            >
              {busy ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 12, fontSize: 14, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/sign-in">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* styles */
const labelStyle = { display: 'grid', gap: 6 }
const labelTextStyle = { fontSize: 13, color: '#475467' }
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  outline: 'none',
  background: '#fff'
}
const primaryBtnStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 8,
  border: '1px solid #1677ff',
  background: '#1677ff',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: 8
}
