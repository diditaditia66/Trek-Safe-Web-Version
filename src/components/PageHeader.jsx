export default function PageHeader({ title, subtitle, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:16, margin:'8px 0 24px', justifyContent:'space-between' }}>
      <div>
        <h1 style={{ fontSize:40, lineHeight:1.1, margin:0 }}>{title}</h1>
        {subtitle && <p style={{ margin:'8px 0 0', color:'#5b616a' }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
