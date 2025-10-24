import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Booking() {
  // ✅ hooks di top-level
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const placeFromQuery = params.get('place') // kalau buka dari Home "People's Choice"

  const [filter, setFilter] = React.useState('All') // All | Rating | Distance
  const [sort, setSort] = React.useState('Price Low to High') // Low→High | High→Low | Rating High to Low

  const [showFilter, setShowFilter] = React.useState(false)
  const [showSort, setShowSort] = React.useState(false)

  // data destinasi (contoh)
  const data = React.useMemo(
    () => [
      {
        key: 'gede',
        img: '/images/mount_gede.png',
        title: 'Mount Gede (2958 mdpl)',
        rating: 4.8,
        reviews: 479,
        distanceMiles: 1.2,
        price: 89000,
        placeName: 'Mount Gede',
      },
      {
        key: 'salak',
        img: '/images/mount_salak.png',
        title: 'Mount Salak (2211 mdpl)',
        rating: 4.7,
        reviews: 384,
        distanceMiles: 30.7,
        price: 78000,
        placeName: 'Mount Salak',
      },
    ],
    []
  )

  // terapkan filter + sort
  const results = React.useMemo(() => {
    let list = [...data]

    // Filter mirip pilihan Flutter
    if (filter === 'Rating') {
      list = list.filter((d) => d.rating >= 4.75)
    } else if (filter === 'Distance') {
      list = list.filter((d) => d.distanceMiles <= 10)
    }

    // Sort
    if (sort === 'Price Low to High') {
      list.sort((a, b) => a.price - b.price)
    } else if (sort === 'Price High to Low') {
      list.sort((a, b) => b.price - a.price)
    } else if (sort === 'Rating High to Low') {
      list.sort((a, b) => b.rating - a.rating)
    }

    return list
  }, [data, filter, sort])

  const onSelect = (placeName) => {
    // sama seperti Flutter: ke layar detail/step berikutnya
    navigate(`/booking-2?place=${encodeURIComponent(placeName)}`)
  }

  return (
    <div style={{ padding: 16, maxWidth: 960, margin: '0 auto' }}>
      {/* AppBar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{placeFromQuery ? placeFromQuery : 'Booking'}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowFilter(true)} style={chipBtn}>
            <span style={{ marginRight: 6 }}>⛛</span> Filter
          </button>
          <button onClick={() => setShowSort(true)} style={chipBtn}>
            <span style={{ marginRight: 6 }}>⇅</span> Sort
          </button>
        </div>
      </div>

      {/* Subheader */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ color: '#6B7280' }}>
          Filter: <strong>{filter}</strong> · Sort: <strong>{sort}</strong>
        </div>
        <div style={{ fontWeight: 600 }}>{results.length} results</div>
      </div>

      {/* List destinasi */}
      <div style={{ display: 'grid', gap: 16 }}>
        {results.map((d) => (
          <DestinationCard key={d.key} data={d} onSelect={() => onSelect(d.placeName)} />
        ))}
      </div>

      {/* Dialog Filter */}
      {showFilter && (
        <Dialog onClose={() => setShowFilter(false)}>
          <h3 style={{ margin: '0 0 10px' }}>Filter</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {['All', 'Rating', 'Distance'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setFilter(opt); setShowFilter(false) }}
                style={listBtn}
              >
                {opt}
              </button>
            ))}
          </div>
        </Dialog>
      )}

      {/* Dialog Sort */}
      {showSort && (
        <Dialog onClose={() => setShowSort(false)}>
          <h3 style={{ margin: '0 0 10px' }}>Sort</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {['Price Low to High', 'Price High to Low', 'Rating High to Low'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setSort(opt); setShowSort(false) }}
                style={listBtn}
              >
                {opt}
              </button>
            ))}
          </div>
        </Dialog>
      )}
    </div>
  )
}

/* Card destinasi */
function DestinationCard({ data, onSelect }) {
  const { img, title, rating, reviews, distanceMiles, price } = data
  return (
    <div style={{
      border: '1px solid #E6E9EE', borderRadius: 12, overflow: 'hidden',
      background: '#fff', boxShadow: '0 1px 2px rgba(16,24,40,.04)'
    }}>
      <div style={{ height: 180, overflow: 'hidden' }}>
        <img
          src={img}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.currentTarget.src = '/images/mount_gede.png' }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden>⭐</span>
            <span>{rating.toFixed(1)} ({reviews} reviews)</span>
          </div>
          <div>{distanceMiles.toFixed(1)} miles</div>
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, color: '#059669' }}>Rp{price.toLocaleString('id-ID')}</div>
          <button onClick={onSelect} style={ghostBtn}>Select</button>
        </div>
      </div>
    </div>
  )
}

/* Dialog sederhana */
function Dialog({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.36)',
        display: 'grid', placeItems: 'center', padding: 16, zIndex: 50
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420, maxWidth: '100%', background: '#fff',
          borderRadius: 12, border: '1px solid #E6E9EE',
          boxShadow: '0 8px 32px rgba(16,24,40,.14)', padding: 16
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* styles kecil */
const chipBtn = {
  padding: '8px 12px',
  borderRadius: 999,
  border: '1px solid #E6E9EE',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600
}
const listBtn = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  cursor: 'pointer',
  textAlign: 'left',
  fontWeight: 600
}
const ghostBtn = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600
}
