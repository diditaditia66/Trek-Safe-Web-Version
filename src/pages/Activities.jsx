import React, { useMemo, useState } from 'react'

const MOCK = [
  { id: 1, name: 'Hiking Bukit Indigo', level: 'Medium', location: 'Bandung', price: 150000 },
  { id: 2, name: 'Camping Ranu Kumbolo', level: 'Hard', location: 'Malang', price: 450000 },
  { id: 3, name: 'City Walk Heritage', level: 'Easy', location: 'Yogyakarta', price: 75000 },
  { id: 4, name: 'Snorkeling Nusa Penida', level: 'Medium', location: 'Bali', price: 350000 },
]

export default function Activities() {
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('')
  const data = useMemo(() => {
    return MOCK.filter(x =>
      (level ? x.level === level : true) &&
      (q ? x.name.toLowerCase().includes(q.toLowerCase()) || x.location.toLowerCase().includes(q.toLowerCase()) : true)
    )
  }, [q, level])
  return (
    <div style={{padding:24}}>
      <h1>Activities</h1>
      <div style={{display:'flex', gap:12, margin:'12px 0'}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari nama/lokasi..." />
        <select value={level} onChange={e=>setLevel(e.target.value)}>
          <option value="">Semua Level</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <div style={{display:'grid', gap:12}}>
        {data.map(x => (
          <div key={x.id} style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <h3 style={{margin:'0 0 8px'}}>{x.name}</h3>
                <div style={{opacity:.7}}>{x.location} • {x.level}</div>
              </div>
              <div>Rp {x.price.toLocaleString('id-ID')}</div>
            </div>
            <div style={{marginTop:12}}>
              <a href="/booking">Pesan</a>
            </div>
          </div>
        ))}
        {data.length === 0 && <div>Tidak ada aktivitas yang cocok.</div>}
      </div>
    </div>
  )
}
