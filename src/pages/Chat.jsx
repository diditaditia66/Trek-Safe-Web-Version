import React, { useState } from 'react'

export default function Chat() {
  const [list, setList] = useState([{ from: 'bot', text: 'Hi! Ada yang bisa dibantu?' }])
  const [msg, setMsg] = useState('')

  function send(e) {
    e.preventDefault()
    if (!msg.trim()) return
    setList(l => [...l, { from: 'me', text: msg }])
    setMsg('')
    setTimeout(() => {
      setList(l => [...l, { from: 'bot', text: 'Terima kasih! Tim kami akan membalas.' }])
    }, 500)
  }

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateRows: '1fr auto', height: 'calc(100vh - 80px)' }}>
      <div style={{ overflowY: 'auto', display: 'grid', gap: 6 }}>
        {list.map((m, i) => (
          <div key={i} style={{ justifySelf: m.from === 'me' ? 'end' : 'start', background: '#f4f4f5', borderRadius: 12, padding: '8px 12px' }}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Tulis pesan..." />
        <button type="submit">Kirim</button>
      </form>
    </div>
  )
}
