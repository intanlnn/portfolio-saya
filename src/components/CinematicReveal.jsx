import { useState, useEffect } from 'react'

export default function CinematicReveal({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 800)
    const t3 = setTimeout(() => setPhase(3), 1600)
    const t4 = setTimeout(() => { if (onComplete) onComplete() }, 2200)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [onComplete])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', pointerEvents: phase >= 3 ? 'none' : 'all'
    }}>
      {/* Black overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, #0a0020, #000)',
        opacity: phase >= 3 ? 0 : 1,
        transition: 'opacity 0.8s ease'
      }} />

      {/* Center burst */}
      {phase >= 1 && (
        <div style={{
          position: 'absolute',
          width: phase >= 2 ? 2000 : 0,
          height: phase >= 2 ? 2000 : 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          transition: 'all 0.8s ease',
          zIndex: 2
        }} />
      )}

      {/* Scan lines */}
      {phase >= 1 && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(124,58,237,0.03) 3px, rgba(124,58,237,0.03) 4px)',
          opacity: phase >= 2 ? 0 : 0.8,
          transition: 'opacity 0.5s ease'
        }} />
      )}

      {/* Center text */}
      <div style={{
        position: 'relative', zIndex: 4, textAlign: 'center',
        opacity: phase === 1 ? 1 : phase === 2 ? 1 : 0,
        transform: phase >= 2 ? 'scale(1.5)' : 'scale(1)',
        transition: 'all 0.8s ease'
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace', fontSize: 10,
          letterSpacing: '0.4em', color: '#7c3aed', marginBottom: 16,
          animation: 'blink 0.5s step-end infinite'
        }}>IDENTITY ORBIT</div>
        <div style={{
          fontSize: 'clamp(2rem,6vw,4rem)', fontWeight: 800,
          background: 'linear-gradient(135deg, #fff, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Entering Portfolio
        </div>
        <div style={{
          marginTop: 20, fontFamily: 'Space Mono, monospace',
          fontSize: 11, color: 'rgba(167,139,250,0.7)', letterSpacing: '0.2em'
        }}>
          LOADING UNIVERSE...
        </div>
        {/* Progress bar */}
        <div style={{
          marginTop: 20, width: 200, height: 2,
          background: 'rgba(139,92,246,0.2)', borderRadius: 1,
          margin: '20px auto 0', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', borderRadius: 1,
            background: 'linear-gradient(90deg, #7c3aed, #e879f9)',
            width: phase >= 2 ? '100%' : '30%',
            transition: 'width 0.8s ease',
            boxShadow: '0 0 10px #7c3aed'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}
