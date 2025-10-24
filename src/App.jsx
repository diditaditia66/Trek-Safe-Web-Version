import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Activities from './pages/Activities'
import Achievement from './pages/Achievement'
import Booking from './pages/Booking'
import Booking2 from './pages/Booking2'
import Checkout from './pages/Checkout'
import CreateAccount from './pages/CreateAccount'
import SignIn from './pages/SignIn'

function Loader() {
  return <div style={{ padding: 24, textAlign: 'center' }}>Loading…</div>
}

function Protected({ children }) {
  const { authStatus } = useAuthenticator(ctx => [ctx.authStatus])
  const location = useLocation()
  const navigate = useNavigate()

  // Tahan render saat Amplify masih konfigurasi
  if (authStatus === 'configuring') return <Loader />

  // Deteksi callback OAuth (kembali dari Google/Cognito)
  const qs = location.search || ''
  const hash = location.hash || ''
  const isOAuthCallback = /[?&](code|state)=/.test(qs) || /(code|state)=/.test(hash)

  // Jika ini callback & belum authenticated → tunggu (tampilkan loader)
  if (isOAuthCallback && authStatus !== 'authenticated') return <Loader />

  // Jika sudah authenticated tetapi URL masih ada code/state → bersihkan & ke tujuan
  useEffect(() => {
    if (isOAuthCallback && authStatus === 'authenticated') {
      const to = (location.state && location.state.from) || { pathname: '/' }
      navigate(to, { replace: true }) // buang query callback dari address bar
    }
  }, [isOAuthCallback, authStatus, navigate]) // eslint-disable-line react-hooks/exhaustive-deps

  if (authStatus !== 'authenticated') {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }
  return children
}

// Layout privat: Navbar hanya muncul saat sudah login
function PrivateLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Protected (dengan Navbar) */}
        <Route
          element={
            <Protected>
              <PrivateLayout />
            </Protected>
          }
        >
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/achievement" element={<Achievement />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-2" element={<Booking2 />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
