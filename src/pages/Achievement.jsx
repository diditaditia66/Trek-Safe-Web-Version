import React, { useState } from 'react'

export default function Achievement() {
  const [tab, setTab] = useState('achievements')
  return (
    <div style={{ padding: 24 }}>
      <h1>Achievement</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab('achievements')} disabled={tab === 'achievements'}>Capaian</button>
        <button onClick={() => setTab('goals')} disabled={tab === 'goals'}>Goals</button>
      </div>
      {tab === 'achievements' ? <AchievementsTab /> : <GoalsTab />}
    </div>
  )
}

function AchievementsTab() {
  const list = [
    { id: 1, title: '10km Hiking', date: '2025-03-10' },
    { id: 2, title: 'First Summit', date: '2025-05-03' },
  ]
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {list.map(x => (
        <div key={x.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
          <strong>{x.title}</strong>
          <div style={{ opacity: .7 }}>{x.date}</div>
        </div>
      ))}
    </div>
  )
}

function GoalsTab() {
  const [goals, setGoals] = React.useState([{ id: 1, text: 'Naik gunung 2x tahun ini', done: false }])

  function add(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = f.get('goal')
    if (!text) return
    setGoals(g => [...g, { id: Date.now(), text, done: false }])
    e.currentTarget.reset()
  }

  function toggle(id) { setGoals(g => g.map(x => x.id === id ? { ...x, done: !x.done } : x)) }

  return (
    <div>
      <form onSubmit={add} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input name="goal" placeholder="Tambah goal..." />
        <button type="submit">Tambah</button>
      </form>
      <div style={{ display: 'grid', gap: 8 }}>
        {goals.map(x => (
          <label key={x.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="checkbox" checked={x.done} onChange={() => toggle(x.id)} />
            <span style={{ textDecoration: x.done ? 'line-through' : 'none' }}>{x.text}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
