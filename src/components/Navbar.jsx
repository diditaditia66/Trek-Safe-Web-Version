import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

export default function Navbar() {
  const { signOut, authStatus } = useAuthenticator(context => [context.user, context.authStatus])
  const loc = useLocation()
  const authed = authStatus === 'authenticated'
  const tabs = [
    { to: '/home', label: 'Home' },
    { to: '/activities', label: 'Activities' },
    { to: '/achievement', label: 'Achievement' },
    { to: '/booking', label: 'Booking' },
    { to: '/chat', label: 'Chat' },
    { to: '/profile', label: 'Profile' },
  ]
  return (
    <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #ddd', alignItems:'center'}}>
      <Link to="/" style={{fontWeight:700}}>TrekSafe</Link>
      {authed && tabs.map(t => (
        <Link key={t.to} to={t.to} style={{textDecoration: loc.pathname===t.to?'underline':'none'}}>{t.label}</Link>
      ))}
      <div style={{marginLeft:'auto'}}>
        {!authed ? (
          <Link to="/sign-in">Sign In</Link>
        ) : (
          <button onClick={signOut}>Sign out</button>
        )}
      </div>
    </nav>
  )
}
