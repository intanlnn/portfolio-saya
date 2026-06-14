import { useEffect, useRef, useState } from 'react'
import Lanyard from './Lanyard.jsx'

const FLOATING_ITEMS = [
  { label: 'React', type: 'skill', x: '12%', y: '25%', size: 15, delay: 0 },
  { label: 'HTML', type: 'skill', x: '18%', y: '55%', size: 15, delay: 0.5 },
  { label: 'UI/UX', type: 'skill', x: '8%', y: '70%', size: 12, delay: 1 },
  { label: 'CSS', type: 'skill', x: '78%', y: '30%', size: 15, delay: 0.3 },
  { label: 'TypeScript', type: 'skill', x: '82%', y: '60%', size: 15, delay: 0.8 },
  { label: 'Laravel', type: 'skill', x: '75%', y: '72%', size: 15, delay: 1.2 },
  { label: 'Portfolio Intan', type: 'project', x: '22%', y: '38%', size: 15, delay: 0.2 },
  { label: 'MySQL', type: 'project', x: '73%', y: '45%', size: 15, delay: 0.7 },
  { label: 'Website', type: 'achievement', x: '15%', y: '82%', size: 15, delay: 0.4 },
  { label: 'Mobile App', type: 'achievement', x: '79%', y: '82%', size: 15, delay: 0.9 },
]

const typeStyle = {
  skill: { color: '#a78bfa', border: 'rgba(139,92,246,0.4)', bg: 'rgba(139,92,246,0.08)' },
  project: { color: '#34d399', border: 'rgba(52,211,153,0.4)', bg: 'rgba(52,211,153,0.08)' },
  achievement: { color: '#fbbf24', border: 'rgba(251,191,36,0.4)', bg: 'rgba(251,191,36,0.08)' },
}

export default function HeroSection({ onCardClick, photoSrc }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 300) }, [])

  return (
    <section id="hero" style={{
      position: 'relative', width: '100%', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Floating items */}
      {FLOATING_ITEMS.map((item, i) => {
        const ts = typeStyle[item.type]
        return (
          <div key={i} style={{
            position: 'absolute',
            left: item.x, top: item.y,
            opacity: visible ? 0.85 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.8s ease ${item.delay}s`,
            animation: `float${i % 3} ${4 + i * 0.3}s ease-in-out infinite ${item.delay}s`,
            zIndex: 5,
            pointerEvents: 'none'
          }}>
            <div style={{
              padding: '5px 10px',
              border: `1px solid ${ts.border}`,
              borderRadius: 20,
              background: ts.bg,
              backdropFilter: 'blur(8px)',
              color: ts.color,
              fontSize: item.size,
              fontFamily: 'Space Mono, monospace',
              whiteSpace: 'nowrap',
              boxShadow: `0 0 15px ${ts.border}`,
              letterSpacing: '0.05em'
            }}>
              {item.type === 'project' ? '⬡ ' : item.type === 'achievement' ? '✦ ' : '· '}{item.label}
            </div>
          </div>
        )
      })}

      {/* Lanyard canvas */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', height: '100%',
        maxWidth: 600,
      }}>
        <Lanyard onCardClick={onCardClick} photoSrc={photoSrc} />
      </div>

      <style>{`
        @keyframes float0 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes float2 { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(8px)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes scrollDot { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(12px)} }
      `}</style>
    </section>
  )
}
