import React from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        textDecoration: isActive ? 'underline' : 'none',
      })}
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { user, signOut, authStatus } = useAuthenticator(ctx => [ctx.user, ctx.authStatus])
  const navigate = useNavigate()
  const loc = useLocation()

  // Jangan render navbar saat Amplify masih konfigurasi
  if (authStatus === 'configuring') return null

  const authed = authStatus === 'authenticated'
  const tabs = [
    { to: '/home', label: 'Home' },
    { to: '/activities', label: 'Activities' },
    { to: '/achievement', label: 'Achievement' },
    { to: '/booking', label: 'Booking' },
    { to: '/chat', label: 'Chat' },
    { to: '/profile', label: 'Profile' },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } finally {
      // Protected Route akan redirect juga, ini hanya fallback agar URL bersih
      navigate('/sign-in', { replace: true, state: { from: loc } })
    }
  }

  return (
    <nav
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        borderBottom: '1px solid #ddd',
        alignItems: 'center',
      }}
    >
      <Link to="/" style={{ fontWeight: 700 }}>TrekSafe</Link>

      {authed && tabs.map(t => (
        <NavItem key={t.to} to={t.to}>{t.label}</NavItem>
      ))}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        {authed && (
          <span style={{ opacity: 0.75 }}>
            {user?.attributes?.email || user?.username}
          </span>
        )}
        {!authed ? (
          <Link to="/sign-in">Sign In</Link>
        ) : (
          <button onClick={handleSignOut}>Sign out</button>
        )}
      </div>
    </nav>
  )
}
