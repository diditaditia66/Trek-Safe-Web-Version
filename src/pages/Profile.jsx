import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
// Amplify Auth v6
import { updatePassword } from 'aws-amplify/auth'

export default function Profile() {
  // ✅ hooks di top-level
  const navigate = useNavigate()
  const { user, signOut } = useAuthenticator((ctx) => [ctx.user, ctx.signOut])

  // data pengguna
  const username = user?.attributes?.name || user?.username || 'Didit Aditia'
  const greeting = `Hello, ${username}`

  // state dialog & form
  const [showChangePwd, setShowChangePwd] = React.useState(false)
  const [oldPwd, setOldPwd] = React.useState('')
  const [newPwd, setNewPwd] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState({ type: '', text: '' })

  // handlers
  const goAchievement = () => navigate('/achievement')

  const onLogout = async () => {
    const ok = window.confirm('Are you sure you want to logout?')
    if (!ok) return
    try {
      await signOut?.()
      navigate('/sign-in', { replace: true })
    } catch (e) {
      console.error('signOut error:', e)
      setMsg({ type: 'error', text: 'Failed to sign out. Please try again.' })
    }
  }

  const onChangePassword = async (e) => {
    e?.preventDefault?.()
    setBusy(true)
    setMsg({ type: '', text: '' })
    try {
      // Amplify Auth v6
      await updatePassword({ oldPassword: oldPwd, newPassword: newPwd })
      setMsg({ type: 'success', text: 'Password has been changed.' })
      setShowChangePwd(false)
      setOldPwd('')
      setNewPwd('')
    } catch (e) {
      console.error('updatePassword error:', e)
      let text = 'Failed to change password.'
      if (e?.name === 'AuthConfigurationException') {
        text = 'Auth backend belum aktif/terkonfigurasi.'
      } else if (e?.message) {
        text = e.message
      }
      setMsg({ type: 'error', text })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 720, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 100, height: 100, borderRadius: '50%',
            overflow: 'hidden', border: '1px solid #E6E9EE', background: '#fff'
          }}
        >
          <img
            src="/images/profile.png"
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100?text=%F0%9F%91%A5' }}
          />
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{username}</div>
          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>{greeting}</div>
        </div>
      </header>

      {msg.text && (
        <div
          role="alert"
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid',
            borderColor: msg.type === 'success' ? '#B7EB8F' : '#FFCCC7',
            background: msg.type === 'success' ? '#F6FFED' : '#FFF1F0',
            color: msg.type === 'success' ? '#135200' : '#A8071A'
          }}
        >
          {msg.text}
        </div>
      )}

      {/* tombol-tombol opsi profil */}
      <div style={{ display: 'grid', gap: 12 }}>
        <button
          onClick={goAchievement}
          style={btnStyle}
        >
          Achievement &amp; Goals
        </button>

        <button
          onClick={() => setShowChangePwd(true)}
          style={btnStyle}
        >
          Change Password
        </button>

        <button
          onClick={onLogout}
          style={{ ...btnStyle, background: '#111', color: '#fff' }}
        >
          Logout
        </button>
      </div>

      {/* Dialog Change Password */}
      {showChangePwd && (
        <div style={dialogBackdropStyle} onClick={() => !busy && setShowChangePwd(false)}>
          <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Change Password</h3>
            <form onSubmit={onChangePassword} style={{ display: 'grid', gap: 10 }}>
              <label style={labelStyle}>
                <span style={labelTextStyle}>Current password</span>
                <input
                  type="password"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  required
                  style={inputStyle}
                  autoFocus
                />
              </label>
              <label style={labelStyle}>
                <span style={labelTextStyle}>New password</span>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  style={inputStyle}
                />
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => setShowChangePwd(false)}
                  disabled={busy}
                  style={ghostBtnStyle}
                >
                  Cancel
                </button>
                <button type="submit" disabled={busy} style={primaryBtnStyle}>
                  {busy ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* styles */
const btnStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
  boxShadow: '0 1px 2px rgba(16,24,40,.04)'
}

const primaryBtnStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #1677ff',
  background: '#1677ff',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer'
}

const ghostBtnStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  color: '#111',
  fontWeight: 600,
  cursor: 'pointer'
}

const dialogBackdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.36)',
  display: 'grid',
  placeItems: 'center',
  padding: 16,
  zIndex: 50
}

const dialogStyle = {
  width: 420,
  maxWidth: '100%',
  background: '#fff',
  borderRadius: 12,
  border: '1px solid #E6E9EE',
  boxShadow: '0 8px 32px rgba(16,24,40,.14)',
  padding: 16
}

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
