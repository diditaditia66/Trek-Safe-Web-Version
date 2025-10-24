import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function Booking() {
  const nav = useNavigate()
  function handleNext(e) {
    e.preventDefault()
    nav('/booking-2')
  }
  return (
    <div style={{padding:24}}>
      <h1>Booking - Step 1</h1>
      <form onSubmit={handleNext} style={{display:'grid', gap:12, maxWidth:420}}>
        <label>Nama
          <input required name="name" />
        </label>
        <label>Tanggal
          <input required name="date" type="date" />
        </label>
        <label>Jumlah Orang
          <input required name="pax" type="number" min="1" defaultValue={1} />
        </label>
        <button type="submit">Lanjut</button>
      </form>
    </div>
  )
}
