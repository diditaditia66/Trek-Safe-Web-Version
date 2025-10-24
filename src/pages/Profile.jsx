import React from 'react'
import { useAuthenticator } from '@aws-amplify/ui-react'
export default function Profile() {
  const { user } = useAuthenticator(context => [context.user])
  const attrs = user?.signInDetails?.loginId ? [{ key:'loginId', value:user.signInDetails.loginId }] : []
  return (
    <div style={{padding:24, display:'grid', gap:12}}>
      <h1>Profile</h1>
      <div style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
        <div><strong>Username:</strong> {user?.username}</div>
        {attrs.map(a => <div key={a.key}><strong>{a.key}:</strong> {a.value}</div>)}
      </div>
    </div>
  )
}
