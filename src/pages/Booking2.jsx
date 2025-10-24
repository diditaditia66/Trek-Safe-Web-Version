import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Booking2() {
  // ✅ hooks top-level
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const placeName = params.get('place') || 'Mount Gede'

  // description & image mapping
  const meta = getPlaceMeta(placeName)

  // single-select track
  const [selectedTrack, setSelectedTrack] = React.useState(null)
  const tracks = [
    { title: 'Cibodas (10 km)',        details: '7-8 hours · Easy-moderate' },
    { title: 'Gunung Putri (12 km)',   details: '6-7 hours · Moderate' },
    { title: 'Selabintana (14 km)',    details: '9-10 hours · Hard' }
  ]

  // dialog simple
  const [showAlert, setShowAlert] = React.useState(false)

  const addToCart = () => {
    if (!selectedTrack) {
      setShowAlert(true)
      return
    }
    navigate('/checkout', {
      state: {
        placeName,
        selectedTracks: [selectedTrack]
      }
    })
  }

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>
      {/* AppBar ala Flutter */}
      <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1, padding: '8px 0' }}>
        <h1 style={{ margin: 0 }}>{placeName || 'Booking'}</h1>
      </div>

      {/* Search (placeholder) */}
      <div style={{ marginTop: 12 }}>
        <div style={{ position: 'relative' }}>
          <span aria-hidden style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input
            type="search"
            placeholder="Search"
            style={inputSearch}
          />
        </div>
      </div>

      {/* Title */}
      <div style={{ marginTop: 16, fontSize: 24, fontWeight: 800 }}>{placeName}</div>

      {/* Image */}
      <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid #E6E9EE' }}>
        <img
          src={meta.img}
          alt={placeName}
          style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.currentTarget.src = '/images/mount_gede.png' }}
        />
      </div>

      {/* Description */}
      <p style={{ marginTop: 12, color: '#374151', lineHeight: 1.55, fontSize: 14 }}>
        {meta.desc}
      </p>

      {/* Choose Track */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Choose Track</div>
        <div style={{ marginTop: 10 }}>
          {tracks.map((t) => (
            <TrackOption
              key={t.title}
              title={t.title}
              details={t.details}
              isSelected={selectedTrack === t.title}
              onChange={(checked) => setSelectedTrack(checked ? t.title : null)}
            />
          ))}
        </div>
      </div>

      {/* Footer price + Add to cart */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          Rp89.000 / person
          <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Include Registration + SIMAKSI Fee</div>
        </div>
        <button onClick={addToCart} style={primaryBtn}>Add to cart</button>
      </div>

      {/* Alert "No Track Selected" */}
      {showAlert && (
        <Dialog onClose={() => setShowAlert(false)}>
          <h3 style={{ margin: '0 0 8px' }}>No Track Selected</h3>
          <p style={{ marginTop: 0 }}>Please select a track to add to cart.</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => setShowAlert(false)} style={primaryBtn}>OK</button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

/* sub-komponen */
function TrackOption({ title, details, isSelected, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>{details}</div>
      </div>
      {/* checkbox single-select (mirip Flutter) */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18 }}
      />
    </div>
  )
}

function Dialog({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,.36)',
        display: 'grid', placeItems: 'center',
        padding: 16, zIndex: 50
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420, maxWidth: '100%',
          background: '#fff',
          borderRadius: 12, border: '1px solid #E6E9EE',
          boxShadow: '0 8px 32px rgba(16,24,40,.14)', padding: 16
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* util & styles */
function getPlaceMeta(place) {
  const key = (place || '').toLowerCase()
  if (key.includes('rinjani')) {
    return {
      img: '/images/mount_rinjani.png',
      desc:
        'At 3,726 meters, Mount Rinjani is the second highest volcano in Indonesia, famous for its Segara Anak crater lake and challenging trekking routes.'
    }
  }
  if (key.includes('bromo')) {
    return {
      img: '/images/mount_bromo.png',
      desc:
        'Mount Bromo, located in East Java, is a popular destination known for its picturesque sunrise views and its active caldera.'
    }
  }
  // default: Gede
  return {
    img: '/images/mount_gede.png',
    desc:
      'Standing at 2,958 meters in West Java, Indonesia, an active stratovolcano known for its stunning crater lake, rich biodiversity, and popular hiking trails.'
  }
}

const inputSearch = {
  width: '100%',
  padding: '10px 12px 10px 34px',
  borderRadius: 10,
  border: '1px solid #E6E9EE',
  background: '#fff',
  outline: 'none'
}

const primaryBtn = {
  padding: '12px 16px',
  borderRadius: 10,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
}
