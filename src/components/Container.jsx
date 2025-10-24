export default function Container({ children, size = 'lg' }) {
  const max = size === 'sm' ? 720 : size === 'lg' ? 1100 : 1280
  return (
    <div style={{
      maxWidth: max, margin: '0 auto', padding: '24px 20px'
    }}>
      {children}
    </div>
  )
}
