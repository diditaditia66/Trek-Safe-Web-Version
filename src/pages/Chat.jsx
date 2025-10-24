// src/pages/Chat.jsx
import * as React from 'react'

export default function Chat() {
  // ✅ hooks di top-level
  const [msg, setMsg] = React.useState('')
  const [list, setList] = React.useState([
    { sender: 'Mr. Anton', text: "Mr. I just arrived on basecamp", me: false },
    { sender: 'You',       text: "Where are you?",                 me: true  },
    { sender: 'You',       text: "i'll arrive asap",               me: true  },
    { sender: 'You',       text: "Please wait for me",             me: true  },
    { sender: 'Mr. Anton', text: "Okayy Mr. i'll wait for you",    me: false },
    { sender: 'Mr. Anton', text: "Take care!",                     me: false },
  ])

  const scrollRef = React.useRef(null)
  React.useEffect(() => {
    // auto scroll ke bawah setiap ada pesan baru
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [list])

  const send = (e) => {
    e.preventDefault()
    const text = msg.trim()
    if (!text) return
    setList((l) => [...l, { sender: 'You', text, me: true }])
    setMsg('')
    // balasan dummy opsional
    setTimeout(() => {
      setList((l) => [...l, { sender: 'Mr. Anton', text: 'Noted. See you!', me: false }])
    }, 600)
  }

  return (
    <div style={{ height: 'calc(100vh - 80px)', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
      {/* AppBar ala Flutter */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #E6E9EE', background: '#fff' }}>
        <h1 style={{ fontSize: 18, margin: 0 }}>Chat</h1>
      </div>

      {/* Messages */}
      <div style={{ padding: 8, overflowY: 'auto', background: '#F8FAFC' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {list.map((m, i) => (
            <MessageBubble key={i} sender={m.sender} text={m.text} me={m.me} />
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={send} style={{ padding: 8, background: '#fff', borderTop: '1px solid #E6E9EE', display: 'flex', gap: 8 }}>
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message"
          style={inputStyle}
        />
        <button type="submit" style={sendBtnStyle} title="Send">
          ✈️
        </button>
      </form>
    </div>
  )
}

function MessageBubble({ sender, text, me }) {
  const bubbleStyle = me ? bubbleMe : bubbleOther
  const textColor = me ? '#fff' : '#111'
  const nameColor = me ? 'rgba(255,255,255,.9)' : '#111'
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ ...bubbleBase, ...bubbleStyle }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: nameColor }}>{sender}</div>
        <div style={{ whiteSpace: 'pre-wrap', color: textColor }}>{text}</div>
      </div>
    </div>
  )
}

/* styles */
const bubbleBase = {
  maxWidth: '78%',
  borderRadius: 12,
  padding: '10px 12px',
  boxShadow: '0 1px 2px rgba(16,24,40,.05)',
}
const bubbleMe = {
  background: '#2563EB', // biru (seperti Flutter)
  color: '#fff',
}
const bubbleOther = {
  background: '#E5E7EB',
  color: '#111',
}
const inputStyle = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #E6E9EE',
  outline: 'none',
  background: '#fff',
}
const sendBtnStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  fontWeight: 700,
  cursor: 'pointer',
}
