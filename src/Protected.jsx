import * as React from 'react'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'

export default function Protected({ children }) {
  // ✅ panggil hook di top-level, tidak di dalam if
  const { route } = useAuthenticator((ctx) => [ctx.route])
  const isAuthed = route === 'authenticated'

  // contoh effect aman (opsional)
  React.useEffect(() => {
    if (!isAuthed) return
    // jalankan efek hanya jika sudah login
  }, [isAuthed])

  // ✅ render bersyarat di JSX (tidak mengubah jumlah hook)
  return isAuthed ? children : <Authenticator />
}
