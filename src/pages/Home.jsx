import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuthenticator((ctx) => [ctx.user])

  const userName =
    user?.attributes?.name ||
    user?.attributes?.given_name ||
    user?.username ||
    'Mr. Didit Aditia'

  const peoplesChoice = [
    { img: '/images/mount_gede.png',    title: 'Mount Gede',    price: 'Rp89.000' },
    { img: '/images/mount_rinjani.png', title: 'Mount Rinjani', price: 'Rp79.000' },
    { img: '/images/mount_bromo.png',   title: 'Mount Bromo',   price: 'Rp99.000' },
  ]

  const goBooking = (placeName) => {
    navigate(`/booking-2?place=${encodeURIComponent(placeName)}`)
  }

  return (
    <div style={{ position: 'relative', minHeight: '100dvh', background: '#fff' }}>
      {/* Background */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, padding: 16, maxWidth: 1100, margin: '0 auto' }}>
        {/* Search bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span
          aria-hidden
              style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, opacity: 0.6
              }}
            >🔍</span>
            <input
              type="search"
              placeholder="Search"
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                borderRadius: 10,
                border: '1px solid #E6E9EE',
                background: 'rgba(250,250,250,0.85)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Greetings */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 500 }}>Hello, {userName}</div>
          <div style={{
            fontSize: 36, fontWeight: 800, letterSpacing: 0.2, marginTop: 8,
            fontFamily: 'cursive, ui-serif, Georgia, serif', color: '#111'
          }}>Trek Safe</div>
        </div>

        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          margin: '8px 0 12px'
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>People&apos;s Choice</div>
          <div style={{ fontSize: 14, opacity: 0.7 }}>›</div>
        </div>

        {/* Horizontal scroller (PlaceCard) */}
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(160px, 180px)',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 8
          }}
        >
          {peoplesChoice.map((p) => (
            <button
              key={p.title}
              onClick={() => goBooking(p.title)}
              style={{
                textAlign: 'left',
                border: '1px solid #E6E9EE',
                borderRadius: 12,
                background: '#fff',
                padding: 0,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(16,24,40,.04)',
                transition: 'transform .06s ease, box-shadow .2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,24,40,.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(16,24,40,.04)')}
            >
              <div style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' }}>
                <img
                  src={p.img}
                  alt={p.title}
                  style={{ display: 'block', width: '100%', height: 120, objectFit: 'cover' }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{p.title}</div>
                <div style={{ color: '#6B7280', fontSize: 14 }}>{p.price}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick links ala grid (opsional, biar mirip versi web kamu sebelumnya) */}
        <div style={{ marginTop: 24, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {[
            { title: 'Activities', desc: 'Lihat & jelajahi aktivitas', to: '/activities' },
            { title: 'Booking', desc: 'Pesan perjalanan Anda', to: '/booking' },
            { title: 'Achievement', desc: 'Capaian & goals', to: '/achievement' },
            { title: 'Chat', desc: 'Chat dengan support/guide', to: '/chat' },
            { title: 'Profile', desc: 'Akun & preferensi', to: '/profile' }
          ].map((c) => (
            <Link
              key={c.to}
              to={c.to}
              style={{
                border: '1px solid #E6E9EE', padding: 16, borderRadius: 12,
                textDecoration: 'none', color: 'inherit', background: '#fff'
              }}
            >
              <h3 style={{ margin: '0 0 6px' }}>{c.title}</h3>
              <p style={{ margin: 0, opacity: 0.75 }}>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
