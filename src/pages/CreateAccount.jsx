// src/pages/CreateAccount.jsx
import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp, confirmSignUp, signInWithRedirect } from 'aws-amplify/auth'

export default function CreateAccount() {
  // ✅ hooks top-level
  const navigate = useNavigate()

  // form state
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [agree, setAgree] = React.useState(false)

  // OTP step
  const [phase, setPhase] = React.useState('form') // 'form' | 'verify'
  const [otp, setOtp] = React.useState('')
  const [verifyUser, setVerifyUser] = React.useState('') // email yang akan diverifikasi
  const [delivery, setDelivery] = React.useState('') // info pengiriman kode

  // ui state
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState({ type: '', text: '' })

  const formValid =
    name.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(email) &&
    password.length > 0 &&
    password === confirm &&
    agree

  async function handleSignUp(e) {
    e?.preventDefault?.()
    if (!formValid || busy) return
    setBusy(true)
    setMsg({ type: '', text: '' })
    try {
      // username = email (login pakai email)
      const res = await signUp({
        username: email.trim().toLowerCase(),
        password,
        options: { userAttributes: { email: email.trim(), name: name.trim() } }
      })

      // Amplify v6: cek nextStep
      const step = res?.nextStep?.signUpStep
      const deliv = res?.nextStep?.codeDeliveryDetails
      if (step === 'CONFIRM_SIGN_UP' || !res?.isSignUpComplete) {
        setVerifyUser(email.trim().toLowerCase())
        setDelivery(deliv?.deliveryMedium ? `${deliv.deliveryMedium} ${deliv.destination ?? ''}` : 'email')
        setPhase('verify')
        setMsg({ type: 'success', text: 'Kode verifikasi telah dikirim. Periksa email Anda.' })
      } else {
        // (jarang) auto-confirm
        setMsg({ type: 'success', text: 'Akun berhasil dibuat. Silakan sign in.' })
        setTimeout(() => navigate('/sign-in', { replace: true }), 800)
      }
    } catch (e) {
      console.error('signUp error:', e)
      let text = 'Gagal membuat akun.'
      if (e?.name === 'UsernameExistsException') {
        text = 'Email sudah terdaftar. Silakan Sign in atau gunakan email lain.'
      } else if (e?.name === 'InvalidPasswordException') {
        text = 'Password tidak memenuhi kebijakan server.'
      } else if (e?.message) {
        text = e.message
      }
      setMsg({ type: 'error', text })
    } finally {
      setBusy(false)
    }
  }

  async function handleConfirm(e) {
    e?.preventDefault?.()
    if (!otp.trim() || busy) return
    setBusy(true)
    setMsg({ type: '', text: '' })
    try {
      await confirmSignUp({ username: verifyUser, confirmationCode: otp.trim() })
      setMsg({ type: 'success', text: 'Verifikasi berhasil. Silakan Sign in.' })
      setTimeout(() => navigate('/sign-in', { replace: true }), 800)
    } catch (e) {
      console.error('confirmSignUp error:', e)
      setMsg({ type: 'error', text: e?.message || 'Kode OTP salah atau kedaluwarsa.' })
    } finally {
      setBusy(false)
    }
  }

  async function googleSignUp() {
    if (!agree) {
      setMsg({ type: 'error', text: 'Harap setujui Syarat & Ketentuan terlebih dahulu.' })
      return
    }
    try {
      setBusy(true)
      await signInWithRedirect({ provider: 'Google' })
      // akan redirect; tidak ada kode lanjutan di sini
    } catch (e) {
      console.error('google redirect error:', e)
      setBusy(false)
      setMsg({ type: 'error', text: 'Google Sign-In gagal. Cek konfigurasi OAuth di Amplify.' })
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      {/* Background */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/images/background.png)', backgroundSize: 'cover', backgroundPosition: 'center'
      }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,.85)' }} />

      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 24
      }}>
        <div style={{
          width: 420, maxWidth: '100%', background: '#fff',
          borderRadius: 12, border: '1px solid #E6E9EE',
          boxShadow: '0 8px 32px rgba(16,24,40,.10)', padding: 20
        }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: .2 }}>Trek Safe</div>
            <div style={{ marginTop: 8, fontWeight: 600 }}>{phase === 'verify' ? 'Enter verification code' : 'Create an account'}</div>
          </div>

          {msg.text && (
            <div role="alert" style={{
              padding: '10px 12px', borderRadius: 10, marginBottom: 12,
              border: '1px solid', background: msg.type === 'success' ? '#F6FFED' : '#FFF1F0',
              borderColor: msg.type === 'success' ? '#B7EB8F' : '#FFCCC7',
              color: msg.type === 'success' ? '#135200' : '#A8071A'
            }}>
              {msg.text}
            </div>
          )}

          {phase === 'form' ? (
            <form onSubmit={handleSignUp} style={{ display: 'grid', gap: 12 }}>
              <label style={labelStyle}>
                <span style={labelTextStyle}>Nama Lengkap</span>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nama lengkap" autoComplete="name" style={inputStyle} required
                />
              </label>

              <label style={labelStyle}>
                <span style={labelTextStyle}>Email</span>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@domain.com" autoComplete="email" style={inputStyle} required
                />
              </label>

              <label style={labelStyle}>
                <span style={labelTextStyle}>Password</span>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimal sesuai kebijakan server" autoComplete="new-password" style={inputStyle} required
                />
              </label>

              <label style={labelStyle}>
                <span style={labelTextStyle}>Confirm password</span>
                <input
                  type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Ulangi password" autoComplete="new-password" style={inputStyle} required
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                <span>Saya setuju dengan <a href="#" onClick={e => e.preventDefault()}>Syarat & Ketentuan</a></span>
              </label>

              <button
                type="submit"
                disabled={!formValid || busy}
                style={{ ...primaryBtn, opacity: (!formValid || busy) ? .6 : 1, pointerEvents: (!formValid || busy) ? 'none' : 'auto' }}
              >
                {busy ? 'Creating…' : 'Create Account'}
              </button>

              <div style={{ textAlign: 'center', color: '#98A2B3' }}>atau</div>

              <button
                type="button"
                onClick={googleSignUp}
                disabled={busy}
                style={{ ...outlineBtn, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <img src="/images/google_icon.png" width="20" height="20" alt="" />
                Continue with Google
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} style={{ display: 'grid', gap: 12 }}>
              <div style={{ fontSize: 14, color: '#475467' }}>
                Masukkan 6-digit kode yang dikirim ke <strong>{verifyUser}</strong> ({delivery || 'email'}).
              </div>
              <input
                inputMode="numeric" pattern="[0-9]*" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value)}
                placeholder="Kode OTP" style={inputStyle} required
              />
              <button type="submit" disabled={busy || !otp.trim()} style={{ ...primaryBtn, opacity: (busy || !otp.trim()) ? .6 : 1 }}>
                {busy ? 'Verifying…' : 'Verify'}
              </button>
              <button type="button" onClick={() => setPhase('form')} style={linkBtn}>← Ganti email</button>
            </form>
          )}

          <div style={{ marginTop: 12, fontSize: 14, textAlign: 'center' }}>
            Already have an account? <Link to="/sign-in">Sign in</Link>
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
  width: '100%', padding: '10px 12px',
  borderRadius: 8, border: '1px solid #E6E9EE',
  outline: 'none', background: '#fff'
}
const primaryBtn = {
  width: '100%', padding: '12px 14px',
  borderRadius: 8, border: '1px solid #1677ff',
  background: '#1677ff', color: '#fff', fontWeight: 700, cursor: 'pointer'
}
const outlineBtn = {
  width: '100%', padding: '12px 14px',
  borderRadius: 8, border: '1px solid #E6E9EE',
  background: '#fff', color: '#111', fontWeight: 700, cursor: 'pointer'
}
const linkBtn = {
  background: 'transparent', border: 'none', color: '#1677ff',
  cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: 600
}
