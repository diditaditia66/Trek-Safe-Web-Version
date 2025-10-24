import * as React from 'react'

export default function Achievement() {
  const [tab, setTab] = React.useState('achievement') // 'achievement' | 'goals'
  return (
    <div style={{ padding: 16, maxWidth: 1024, margin: '0 auto' }}>
      {/* AppBar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h1 style={{ margin: 0 }}>Mr. Didit Aditia</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <TabButton active={tab === 'achievement'} onClick={() => setTab('achievement')}>Achievement</TabButton>
          <TabButton active={tab === 'goals'} onClick={() => setTab('goals')}>Goals</TabButton>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {tab === 'achievement' ? <AchievementTab /> : <GoalsTab />}
      </div>
    </div>
  )
}

/* -------------------- Achievement Tab -------------------- */

function AchievementTab() {
  // data untuk chart (meniru fl_chart: 7 titik: 0..6 -> 3,5,8,12,16,18,20)
  const points = React.useMemo(
    () => [3, 5, 8, 12, 16, 18, 20],
    []
  )
  const labels = ['01/12', '05/12', '10/12', '15/12', '20/12', '25/12', '30/12']

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <StatCard title="Mount" value="6 Mount" sub="+20% month over last month" />
        <StatCard title="Mdpl" value="16,398 Mdpl" sub="+33% month over last month" />
      </div>

      {/* Chart */}
      <div style={{ marginTop: 24, fontWeight: 700 }}>Total Mdpl on This Month</div>
      <div style={{
        marginTop: 12, border: '1px solid #E6E9EE', borderRadius: 12, background: '#fff',
        padding: 12, overflowX: 'auto'
      }}>
        <MiniLineChart points={points} labels={labels} height={220} />
      </div>

      {/* Recent Mount */}
      <div style={{ marginTop: 24, fontWeight: 700 }}>Your Recent Mount</div>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        <RecentMount name="Mount Rinjani" height="3726 mdpl" />
        <RecentMount name="Mount Salak" height="2211 mdpl" />
      </div>
    </div>
  )
}

function StatCard({ title, value, sub }) {
  return (
    <div style={{
      border: '1px solid #E6E9EE', borderRadius: 12, padding: 12, background: '#fff',
      boxShadow: '0 1px 2px rgba(16,24,40,.04)'
    }}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>{value}</div>
      <div style={{ color: '#6B7280', marginTop: 4, fontSize: 12 }}>{sub}</div>
    </div>
  )
}

function RecentMount({ name, height }) {
  return (
    <div style={{
      border: '1px solid #E6E9EE', borderRadius: 10, padding: 12, background: '#fff'
    }}>
      <div style={{ fontWeight: 700 }}>{name}</div>
      <div style={{ color: '#6B7280', marginTop: 4 }}>{height}</div>
    </div>
  )
}

/* Mini chart pakai inline SVG (tanpa dependency) */
function MiniLineChart({ points, labels, height = 220, padding = 28 }) {
  const width = 560 // kanvas dasar; bisa auto-lebar oleh container
  const maxY = Math.max(...points) || 1
  const minY = 0
  const n = points.length
  const xStep = (width - padding * 2) / (n - 1 || 1)

  // scale helpers
  const x = (i) => padding + i * xStep
  const y = (v) => {
    const h = height - padding * 2
    const t = (v - minY) / (maxY - minY || 1)
    return height - padding - h * t
  }

  // path garis
  let d = ''
  points.forEach((v, i) => {
    const cx = x(i)
    const cy = y(v)
    d += (i === 0 ? `M ${cx},${cy}` : ` L ${cx},${cy}`)
  })

  // area fill (opsional tipis)
  const areaD = `${d} L ${x(n - 1)},${y(minY)} L ${x(0)},${y(minY)} Z`

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Line chart">
      {/* grid Y sederhana */}
      {[0.25, 0.5, 0.75].map((t, i) => {
        const gy = padding + (height - padding * 2) * (1 - t)
        const labelVal = Math.round((minY + (maxY - minY) * t))
        return (
          <g key={i}>
            <line x1={padding} x2={width - padding} y1={gy} y2={gy} stroke="#F2F4F7" />
            <text x={6} y={gy + 4} fontSize="10" fill="#6B7280">{labelVal}k</text>
          </g>
        )
      })}

      {/* area & line */}
      <path d={areaD} fill="rgba(37,99,235,.08)" stroke="none" />
      <path d={d} fill="none" stroke="#2563EB" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

      {/* titik */}
      {points.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#2563EB" />
      ))}

      {/* axis X labels */}
      {labels.map((txt, i) => (
        <text
          key={txt}
          x={x(i)} y={height - 6}
          textAnchor="middle" fontSize="10" fill="#6B7280"
        >
          {txt}
        </text>
      ))}
      {/* border */}
      <rect x="0.5" y="0.5" width={width - 1} height={height - 1} fill="none" stroke="#E6E9EE" />
    </svg>
  )
}

/* -------------------- Goals Tab -------------------- */

function GoalsTab() {
  const [goals, setGoals] = React.useState([])
  const inputRef = React.useRef(null)

  const add = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const title = (fd.get('goal') || '').toString().trim()
    if (!title) return
    setGoals((g) => [...g, { id: Date.now(), title, done: false }])
    form.reset()
    inputRef.current?.focus()
  }

  const toggle = (id) => {
    setGoals((g) => g.map((it) => it.id === id ? { ...it, done: !it.done } : it))
  }

  return (
    <div>
      <div style={{ fontWeight: 700 }}>Add a New Goal</div>
      <form onSubmit={add} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          ref={inputRef}
          name="goal"
          placeholder="Goal Title"
          style={inputStyle}
        />
        <button type="submit" style={primaryBtn}>Add</button>
      </form>

      <div style={{ marginTop: 16, fontWeight: 700 }}>Your Goals</div>
      <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
        {goals.map((g) => (
          <label key={g.id} style={goalItem}>
            <input
              type="checkbox"
              checked={g.done}
              onChange={() => toggle(g.id)}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</span>
          </label>
        ))}
        {goals.length === 0 && (
          <div style={emptyState}>Belum ada goals. Tambahkan di atas.</div>
        )}
      </div>
    </div>
  )
}

/* -------------------- Styles -------------------- */

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid #E6E9EE',
        background: active ? '#2563EB' : '#fff',
        color: active ? '#fff' : '#111',
        cursor: 'pointer',
        fontWeight: 700
      }}
    >
      {children}
    </button>
  )
}

const inputStyle = {
  flex: 1,
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

const goalItem = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: 12,
  borderRadius: 8,
  border: '1px solid #93C5FD',
  background: '#EFF6FF'
}

const emptyState = {
  padding: 16,
  textAlign: 'center',
  border: '1px dashed #E6E9EE',
  borderRadius: 8,
  color: '#6B7280'
}
