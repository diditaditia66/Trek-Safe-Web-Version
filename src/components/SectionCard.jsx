export default function SectionCard({ title, desc, onClick, href, children }) {
  const Comp = href ? 'a' : 'button'
  return (
    <Comp
      href={href}
      onClick={onClick}
      style={{
        textAlign:'left',
        padding: '18px 16px',
        borderRadius: 16,
        border: '1px solid #E6E9EE',
        background:'#fff',
        boxShadow:'0 1px 2px rgba(16,24,40,0.04)',
        transition:'transform .06s ease, box-shadow .2s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(16,24,40,.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 2px rgba(16,24,40,.04)'}
    >
      {title && <div style={{ fontWeight:700, fontSize:20, marginBottom:6 }}>{title}</div>}
      {desc && <div style={{ color:'#6B7280', fontSize:14 }}>{desc}</div>}
      {children}
    </Comp>
  )
}
