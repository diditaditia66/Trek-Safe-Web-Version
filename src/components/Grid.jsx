export function Grid({ children, min = 260, gap = 16 }) {
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:`repeat(auto-fill, minmax(${min}px, 1fr))`,
      gap
    }}>
      {children}
    </div>
  )
}
