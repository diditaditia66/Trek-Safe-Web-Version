import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
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

function Protected({ children }) {
  const { authStatus } = useAuthenticator(ctx => [ctx.authStatus])
  const location = useLocation()

  // Tahan render saat Amplify masih konfigurasi
  if (authStatus === 'configuring') return null

  // Saat kembali dari Google/Cognito, URL punya ?code=...&state=...
  // Jangan redirect ke /sign-in di fase ini — biarkan Amplify memproses session.
  const qs = location.search || ''
  const hash = location.hash || ''
  const isOAuthCallback =
    /[?&](code|state)=/.test(qs) || /(code|state)=/.test(hash)
  if (isOAuthCallback) return null

  if (authStatus !== 'authenticated') {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }
  return children
}

// Layout private: Navbar + halaman isi, hanya untuk user yang sudah login
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
        {/* Public routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Protected routes (dengan Navbar) */}
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
