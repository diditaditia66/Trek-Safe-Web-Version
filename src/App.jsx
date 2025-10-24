import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
  if (authStatus === 'configuring') return null
  if (authStatus !== 'authenticated') return <Navigate to="/sign-in" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/home" element={<Protected><Home /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/chat" element={<Protected><Chat /></Protected>} />
        <Route path="/activities" element={<Protected><Activities /></Protected>} />
        <Route path="/achievement" element={<Protected><Achievement /></Protected>} />
        <Route path="/booking" element={<Protected><Booking /></Protected>} />
        <Route path="/booking-2" element={<Protected><Booking2 /></Protected>} />
        <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
