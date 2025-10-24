import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// helper format Rupiah
const rupiah = (n) => `Rp${(n || 0).toLocaleString('id-ID')}`

export default function Checkout() {
  // ✅ hooks di top-level
  const navigate = useNavigate()
  const { state } = useLocation()

  // Ambil data dari state (prioritas) atau dari query (fallback)
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const placeName = state?.placeName || search.get('place') || 'Unknown Place'
  // selectedTracks bisa datang dari state (array) atau dari query (?tracks=a,b,c)
  const selectedTracks =
    state?.selectedTracks ||
    (search.get('tracks') ? search.get('tracks').split(',').map(s => s.trim()).filter(Boolean) : [])

  // state form
  const [userName, setUserName] = React.useState('')
  const [userAddress, setUserAddress] = React.useState('')
  const [selectedDate, setSelectedDate] = React.useState(() => {
    // default today (yyyy-mm-dd)
    const d = new Date()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${d.getFullYear()}-${mm}-${dd}`
  })
  const [paymentMethod, setPaymentMethod] = React.useState('Transfer Bank BCA')
  const [promoCode, setPromoCode] = React.useState('')
  const [isGuideSelected, setIsGuideSelected] = React.useState(true)

  // dialog controls
  const [editField, setEditField] = React.useState(null) // 'NAME' | 'ADDRESS' | 'PROMOS' | null
  const [editValue, setEditValue] = React.useState('')
  const [showPayDialog, setShowPayDialog] = React.useState(false)
  const [showPlaced, setShowPlaced] = React.useState(false)

  // Harga (ikut Flutter)
  const pricePerTrack = 89000
  const guidePrice = 109000
  const trackCount = selectedTracks.length
  const subtotal = trackCount * pricePerTrack + (isGuideSelected ? guidePrice : 0)

  // mapping image (sederhana)
  const placeImg = (() => {
    const key = (placeName || '').toLowerCase()
    if (key.includes('gede')) return '/images/mount_gede.png'
    if (key.includes('rinjani')) return '/images/mount_rinjani.png'
    if (key.includes('bromo')) return '/images/mount_bromo.png'
    return '/images/mount_gede.png'
  })()

  // handlers
  const openEdit = (field, current) => {
    setEditField(field)
    setEditValue(current || '')
  }
  const saveEdit = () => {
    if (editField === 'NAME') setUserName(editValue.trim())
    if (editField === 'ADDRESS') setUserAddress(editValue.trim())
    if (editField === 'PROMOS') setPromoCode(editValue.trim())
    setEditField(null)
    setEditValue('')
  }

  const placeOrder = () => {
    // tampilkan dialog konfirmasi seperti AlertDialog di Flutter
    setShowPlaced(true)
  }
  const closePlaced = () => {
    setShowPlaced(false)
    // balik ke halaman sebelumnya atau ke home
    // di Flutter: Navigator.pop() dua kali. Di web: arahkan ke /home
    navigate('/home', { replace: true })
  }

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
      <header style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1, padding: '8px 0' }}>
        <h1 style={{ margin: '8px 0' }}>Checkout</h1>
      </header>

      {/* rows detail seperti Flutter */}
      <SectionDivider>
        <DetailRow
          title="NAME"
          value={userName || 'Add your name'}
          onClick={() => openEdit('NAME', userName)}
        />
        <Divider />
        <DetailRow
          title="ADDRESS"
          value={userAddress || 'Add your address'}
          onClick={() => openEdit('ADDRESS', userAddress)}
        />
        <Divider />
        <DetailRow
          title="DATE"
          value={formatIDDate(selectedDate)}
          onClick={() => {
            // gunakan input type="date" tersembunyi agar UX cepat
            const picker = document.getElementById('date-picker-hidden')
            if (picker) picker.showPicker?.() || picker.click()
          }}
        />
        {/* input date tersembunyi */}
        <input
          id="date-picker-hidden"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
        />
        <Divider />
        <DetailRow
          title="PAYMENT"
          value={paymentMethod}
          onClick={() => setShowPayDialog(true)}
        />
        <Divider />
        <DetailRow
          title="PROMOS"
          value={promoCode || 'Apply promo code'}
          onClick={() => openEdit('PROMOS', promoCode)}
        />
      </SectionDivider>

      {/* Include Guide */}
      <SectionDivider style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Include Guide</div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isGuideSelected}
              onChange={(e) => setIsGuideSelected(e.target.checked)}
            />
            <span style={{ fontSize: 13, color: '#667085' }}>{isGuideSelected ? 'Yes' : 'No'}</span>
          </label>
        </div>
      </SectionDivider>

      {/* Items */}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ margin: '0 0 8px' }}>ITEMS</h3>

        {/* tracks */}
        {(selectedTracks.length ? selectedTracks : ['Default Track']).map((track, idx) => (
          <ItemRow
            key={`${track}-${idx}`}
            img={placeImg}
            title={placeName}
            description={`Track: ${track}\nQuantity: 01`}
            price={rupiah(pricePerTrack)}
          />
        ))}

        {/* guide item */}
        {isGuideSelected && (
          <ItemRow
            img="/images/guide.png"
            title="Guide"
            description="Mr. Anton"
            price={rupiah(guidePrice)}
          />
        )}
      </div>

      <Divider style={{ marginTop: 16 }} />

      {/* totals */}
      <div style={{ marginTop: 16, display: 'grid', gap: 6 }}>
        <TotalRow title={`Subtotal (${trackCount} Tracks + Guide)`} value={rupiah(subtotal)} />
        <TotalRow title="Application Fee" value="Free" />
        <TotalRow title="Total" value={rupiah(subtotal)} bold black />
      </div>

      {/* Place Order */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={placeOrder}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: 10,
            border: '1px solid #111',
            background: '#111',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Place order
        </button>
      </div>

      {/* Dialog edit NAME / ADDRESS / PROMOS */}
      {editField && (
        <Dialog onClose={() => setEditField(null)}>
          <h3 style={{ margin: '0 0 10px' }}>Edit {editField}</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={`Enter ${editField}`}
              style={inputStyle}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setEditField(null)} style={ghostBtn}>Cancel</button>
              <button onClick={saveEdit} style={primaryBtn}>Save</button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Dialog payment method */}
      {showPayDialog && (
        <Dialog onClose={() => setShowPayDialog(false)}>
          <h3 style={{ margin: '0 0 10px' }}>Select Payment Method</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {['Bank BCA', 'Bank Mandiri'].map((opt) => (
              <button
                key={opt}
                onClick={() => { setPaymentMethod(opt); setShowPayDialog(false) }}
                style={listBtn}
              >
                {opt}
              </button>
            ))}
          </div>
        </Dialog>
      )}

      {/* Dialog Order Placed */}
      {showPlaced && (
        <Dialog onClose={closePlaced}>
          <h3 style={{ margin: '0 0 8px' }}>Order Placed</h3>
          <p style={{ marginTop: 0 }}>Your order has been successfully placed!</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={closePlaced} style={primaryBtn}>OK</button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

/* Sub-komponen presentasional */
function SectionDivider({ children, style }) {
  return (
    <div style={{ border: '1px solid #E6E9EE', borderRadius: 12, padding: 12, background: '#fff', ...style }}>
      {children}
    </div>
  )
}

function Divider({ style }) {
  return <div style={{ height: 1, background: '#F2F4F7', margin: '8px 0', ...style }} />
}

function DetailRow({ title, value, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: 'transparent',
        border: 'none',
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 500 }}>{title}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#667085' }}>
        <span style={{ fontSize: 14 }}>{value}</span>
        <span aria-hidden style={{ fontSize: 12 }}>›</span>
      </span>
    </button>
  )
}

function ItemRow({ img, title, description, price }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '10px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flex: '0 0 auto' }}>
        <img
          src={img}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.src = '/images/mount_gede.png' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ whiteSpace: 'pre-line', color: '#667085', fontSize: 12 }}>{description}</div>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{price}</div>
    </div>
  )
}

function TotalRow({ title, value, bold, black }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 14, fontWeight: bold ? 700 : 400, color: black ? '#111' : '#667085' }}>{title}</div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

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
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  outline: 'none',
  background: '#fff'
}
const primaryBtn = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer'
}
const ghostBtn = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  color: '#111',
  fontWeight: 600,
  cursor: 'pointer'
}

/* util format tanggal "dd MMMM yyyy" ala intl:DateFormat di Flutter */
function formatIDDate(yyyy_mm_dd) {
  if (!yyyy_mm_dd) return ''
  const [y, m, d] = yyyy_mm_dd.split('-').map(Number)
  const date = new Date(y, (m || 1) - 1, d || 1)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}
