import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Checkout() {
  const nav = useNavigate()
  const { state } = useLocation()
  const addons = state?.addons ?? {}
  const base = 250000
  const total = base + (addons.guide ? 50000 : 0) + (addons.insurance ? 30000 : 0)

  function finish() {
    alert('Pembayaran berhasil (dummy).')
    nav('/home', { replace: true })
  }

  return (
    <div style={{ padding: 24, maxWidth: 540 }}>
      <h1>Checkout</h1>
      <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Harga dasar</div>
          <div>Rp {base.toLocaleString('id-ID')}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Guide</div>
          <div>{addons.guide ? 'Ya (Rp 50.000)' : '-'}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Asuransi</div>
          <div>{addons.insurance ? 'Ya (Rp 30.000)' : '-'}</div>
        </div>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <div>Total</div>
          <div>Rp {total.toLocaleString('id-ID')}</div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={finish}>Bayar (dummy)</button>
        </div>
      </div>
    </div>
  )
}
