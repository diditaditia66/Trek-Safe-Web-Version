import * as React from 'react'

// Util kecil
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const API_BASE = import.meta.env.VITE_API_BASE || ''
const ENDPOINT_VISITORS = `${API_BASE}/data`
const ENDPOINT_CATEGORIES = `${API_BASE}/category`

export default function Activities() {
  // ✅ hooks di top-level (stabil)
  const [activeTab, setActiveTab] = React.useState('crowd') // 'crowd' | 'category'
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [visitorData, setVisitorData] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [errMsg, setErrMsg] = React.useState('')

  // Timer 5 detik ala Flutter → generate dummy & kirim ke server
  React.useEffect(() => {
    // initial fetch
    fetchData()

    const id = setInterval(() => {
      // console.debug('[Activities] Timer triggered')
      generateDummyData(true) // true = kirim ke server juga
    }, 5000)

    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Data fetchers & generators ---
  async function fetchData() {
    setErrMsg('')
    try {
      const [vRes, cRes] = await Promise.allSettled([
        fetch(ENDPOINT_VISITORS),
        fetch(ENDPOINT_CATEGORIES),
      ])

      let vData = []
      let cData = []

      if (vRes.status === 'fulfilled' && vRes.value.ok) {
        const json = await vRes.value.json()
        vData = Array.isArray(json) ? json : json?.data || []
      }
      if (cRes.status === 'fulfilled' && cRes.value.ok) {
        const json = await cRes.value.json()
        cData = Array.isArray(json) ? json : json?.data || []
      }

      if (!vData.length && !cData.length) {
        // fallback ke dummy kalau keduanya kosong
        generateDummyData(false)
        setErrMsg('Gagal memuat dari API; menampilkan data dummy.')
      } else {
        setVisitorData(vData)
        setCategories(cData)
      }
    } catch (e) {
      console.error('[Activities] fetch error:', e)
      setErrMsg('Gagal memuat dari API; menampilkan data dummy.')
      generateDummyData(false)
    }
  }

  function generateDummyData(alsoSend) {
    const batch = [
      { posID: 'POS001', rfid: 'E357C29',  username: 'Didit Aditia',     keramaian: 5 },
      { posID: 'POS002', rfid: 'D3BA4228', username: 'Rafi Kamil',       keramaian: 12 },
      { posID: 'POS001', rfid: '9FDBBC1F', username: 'Muhammad Aqshal',  keramaian: 7 },
      { posID: 'POS002', rfid: 'E357C29',  username: 'Didit Aditia',     keramaian: 8 },
    ]
    setVisitorData((prev) => {
      const next = [...prev, ...batch]
      if (alsoSend) sendDataToServer(next).catch(() => {})
      return next
    })

    // seed kategori dummy (sekali-kali)
    if (!categories.length) {
      setCategories([
        { title: 'Hiking', description: 'Trek ringan sampai berat' },
        { title: 'Camping', description: 'Kemping seru di alam' },
        { title: 'Snorkeling', description: 'Menikmati dunia bawah laut' },
      ])
    }
  }

  async function sendDataToServer(currentVisitorData) {
    try {
      const res = await fetch(ENDPOINT_VISITORS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: currentVisitorData || visitorData }),
      })
      if (!res.ok) {
        console.warn('[Activities] POST /data gagal:', res.status)
      }
    } catch (e) {
      console.warn('[Activities] POST /data error:', e)
    }
  }

  // --- handlers ---
  async function handleRefresh() {
    setIsRefreshing(true)
    await sleep(500) // biar ada rasa loading
    await fetchData()
    setIsRefreshing(false)
  }

  // --- UI ---
  return (
    <div style={{ padding: 16, maxWidth: 1024, margin: '0 auto' }}>
      {/* AppBar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h1 style={{ margin: 0 }}>Activities</h1>
        <button onClick={handleRefresh} disabled={isRefreshing} style={refreshBtn}>
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, borderBottom: '1px solid #E6E9EE' }}>
        <TabButton active={activeTab === 'crowd'} onClick={() => setActiveTab('crowd')}>
          Visitor Crowd
        </TabButton>
        <TabButton active={activeTab === 'category'} onClick={() => setActiveTab('category')}>
          Category
        </TabButton>
      </div>

      {errMsg && (
        <div role="alert" style={alertWarn} >
          {errMsg}
        </div>
      )}

      {/* Tab content */}
      <div style={{ marginTop: 16 }}>
        {activeTab === 'crowd' ? (
          <VisitorCrowd list={visitorData} />
        ) : (
          <CategoryList list={categories} isRefreshing={isRefreshing} />
        )}
      </div>
    </div>
  )
}

/* Sub-komponen */

function VisitorCrowd({ list }) {
  if (!list?.length) {
    return <EmptyState text="No visitor data available" />
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {list.map((v, idx) => (
        <div key={idx} style={visitorCard}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>POS ID: {v.posID || 'Unknown'}</div>
          <div>RFID: {v.rfid || 'Unknown'}</div>
          <div>Username: {v.username || 'Unknown'}</div>
          <div>Crowd: {String(v.keramaian ?? 'Unknown')} people</div>
        </div>
      ))}
    </div>
  )
}

function CategoryList({ list, isRefreshing }) {
  if (isRefreshing) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading…</div>
  }
  if (!list?.length) {
    return <EmptyState text="No categories available" />
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {list.map((c, i) => (
        <div key={`${c.title}-${i}`} style={categoryCard}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{c.title}</div>
          <div style={{ color: '#6B7280', marginTop: 6, fontSize: 14 }}>{c.description}</div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{
      padding: 24, textAlign: 'center', color: '#6B7280',
      border: '1px dashed #E6E9EE', borderRadius: 12
    }}>
      {text}
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
        color: active ? '#111' : '#6B7280',
        fontWeight: active ? 700 : 600
      }}
    >
      {children}
    </button>
  )
}

/* styles */
const refreshBtn = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600
}

const alertWarn = {
  marginTop: 12,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #FFE58F',
  background: '#FFFBE6',
  color: '#614700',
  fontSize: 14
}

const visitorCard = {
  padding: 16,
  borderRadius: 8,
  background: '#EFF6FF',
  border: '1px solid #DBEAFE'
}

const categoryCard = {
  padding: 16,
  borderRadius: 10,
  border: '1px solid #E6E9EE',
  background: '#fff'
}
