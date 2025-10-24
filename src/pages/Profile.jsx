import React from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'

export default function Profile() {
  const { user } = useAuthenticator(ctx => [ctx.user])
  const loginId = user?.signInDetails?.loginId
  const email = user?.attributes?.email
  const username = user?.username

  return (
    <div style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>Profile</h1>
      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <div><strong>Username:</strong> {username || '—'}</div>
        {email && <div><strong>Email:</strong> {email}</div>}
        {loginId && <div><strong>Login ID:</strong> {loginId}</div>}
      </div>
    </div>
  )
}
