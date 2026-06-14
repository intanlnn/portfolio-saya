import { useState } from 'react'

const ITEMS = [
  { label: 'About', icon: '◈', angle: -90 },
  { label: 'Projects', icon: '⬡', angle: -18 },
  { label: 'Skills', icon: '⟡', angle: 54 },
  { label: 'Experience', icon: '◎', angle: 126 },
  { label: 'Contact', icon: '⊕', angle: 198 },
]

export default function OrbitNav({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const R = 80

  return (
    <div style={{
      position: 'fixed', bottom: 40, right: 40, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Orbit items */}
      {ITEMS.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180
        const x = Math.cos(rad) * R
        const y = Math.sin(rad) * R
        return (
          <div
            key={item.label}
            onClick={() => { onNavigate(item.label.toLowerCase()); setOpen(false) }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
              transform: open
                ? `translate(${x}px, ${y}px) scale(1)`
                : `translate(0px, 0px) scale(0)`,
              opacity: open ? 1 : 0,
              transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.06}s`,
              cursor: 'pointer',
              zIndex: 2,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: hovered === i
                ? 'linear-gradient(135deg,#7c3aed,#6366f1)'
                : 'rgba(20,10,40,0.9)',
              border: '1px solid rgba(139,92,246,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
              boxShadow: hovered === i ? '0 0 20px rgba(139,92,246,0.6)' : '0 0 10px rgba(139,92,246,0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
              fontSize: 14
            }}>
              <span style={{ lineHeight: 1 }}>{item.icon}</span>
            </div>
            <span style={{
              position: 'absolute',
              top: '110%',
              fontSize: 9,
              fontFamily: 'Space Mono, monospace',
              color: '#a78bfa',
              whiteSpace: 'nowrap',
              letterSpacing: '0.1em',
              opacity: hovered === i ? 1 : 0,
              transition: 'opacity 0.2s'
            }}>{item.label.toUpperCase()}</span>
          </div>
        )
      })}

      {/* Orbit ring */}
      {open && (
        <div style={{
          position: 'absolute',
          width: R * 2 + 44, height: R * 2 + 44,
          borderRadius: '50%',
          border: '1px solid rgba(139,92,246,0.12)',
          animation: 'spin 12s linear infinite',
          pointerEvents: 'none'
        }} />
      )}

      {/* Center button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 54, height: 54, borderRadius: '50%',
          background: open
            ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
            : 'rgba(15,5,30,0.95)',
          border: '1px solid rgba(139,92,246,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 3,
          boxShadow: '0 0 25px rgba(139,92,246,0.4)',
          backdropFilter: 'blur(12px)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          fontSize: 20,
          userSelect: 'none'
        }}
      >
        {open ? '✕' : '✦'}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
