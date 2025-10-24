import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const cards = [
    { title: 'Activities', desc: 'Lihat & jelajahi aktivitas', to: '/activities' },
    { title: 'Booking', desc: 'Pesan perjalanan Anda', to: '/booking' },
    { title: 'Achievement', desc: 'Capaian & goals', to: '/achievement' },
    { title: 'Chat', desc: 'Chat dengan support/guide', to: '/chat' },
    { title: 'Profile', desc: 'Akun & preferensi', to: '/profile' },
  ]
  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>Selamat datang di TrekSafe Web!</p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', marginTop: 16 }}>
        {cards.map(c => (
          <Link key={c.to} to={c.to} style={{ border: '1px solid #e5e5e5', padding: 16, borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ margin: '0 0 8px' }}>{c.title}</h3>
            <p style={{ margin: 0, opacity: .75 }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
