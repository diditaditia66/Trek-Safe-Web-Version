import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Booking2() {
  const nav = useNavigate()
  const [addons, setAddons] = useState({ guide: true, insurance: false })

  function toggle(k) { setAddons(p => ({ ...p, [k]: !p[k] })) }

  function goCheckout(e) {
    e.preventDefault()
    nav('/checkout', { state: { addons } })
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Booking - Step 2</h1>
      <form onSubmit={goCheckout} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>
          <input type="checkbox" checked={addons.guide} onChange={() => toggle('guide')} />
          &nbsp;Guide
        </label>
        <label>
          <input type="checkbox" checked={addons.insurance} onChange={() => toggle('insurance')} />
          &nbsp;Asuransi Perjalanan
        </label>
        <button type="submit">Ke Checkout</button>
      </form>
    </div>
  )
}
