// ContactSection.jsx
import { useState, useRef, useEffect } from 'react'
import { Mail } from 'lucide-react'
import { FaLinkedin, FaInstagram } from 'react-icons/fa'

const CONTACTS = [
  { label: 'Email', icon: Mail, handle: 'intanalainun189@gmail.com', href: 'mailto:intanalainun189@gmail.com', color: '#7c3aed' },
  { label: 'LinkedIn', icon: FaLinkedin, handle: "Intan Al' Ainun", href: 'https://www.linkedin.com/in/intan-al-ainun-a54857315?utm_source=share_via&utm_content=profile&utm_medium=member_android', color: '#06b6d4' },
  { label: 'Instagram', icon: FaInstagram, handle: '@intanlnn', href: 'https://www.instagram.com/intanlnn?igsh=dTRyenkyMWRkb3g=', color: '#e879f9' },
]

function useWindowSize() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return width
}

export default function ContactSection() {
  const [hovered, setHovered] = useState(null)
  const [inView, setInView] = useState(false)
  const [scanLine, setScanLine] = useState(0)
  const ref = useRef(null)
  const width = useWindowSize()
  const isMobile = width < 768

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(p => (p + 1) % 100)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="contact" ref={ref} style={{
      minHeight: '100vh',
      padding: isMobile ? '60px 4%' : '100px 5%',
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Header */}
      <div style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
        textAlign: 'center',
        marginBottom: isMobile ? 36 : 70
      }}>
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? 10 : 11,
          letterSpacing: '0.3em', color: '#e879f9'
        }}>
          Control Room
        </span>
        <h2 style={{
          fontSize: isMobile ? '1.8rem' : 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 800, marginTop: 12,
          background: 'linear-gradient(135deg,#fff,#f0abfc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Contact
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: isMobile ? 13 : 15,
          maxWidth: 420, lineHeight: 1.7, fontWeight: 400,
          margin: '16px auto 0', textAlign: 'center',
          padding: isMobile ? '0 8px' : '0'
        }}>
          Have a project in mind? Want to collaborate? Transmit a signal and I'll respond in the speed of light.
        </p>
      </div>

      {/* Hologram panel */}
      <div style={{
        width: '100%', maxWidth: 700,
        background: 'rgba(5,2,15,0.85)',
        border: '1px solid rgba(232,121,249,0.2)',
        borderRadius: isMobile ? 16 : 24,
        padding: isMobile ? '24px 16px' : '40px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 60px rgba(232,121,249,0.1), inset 0 1px 0 rgba(255,255,255,0.04)',
        position: 'relative', overflow: 'hidden',
        opacity: inView ? 1 : 0,
        transition: 'all 0.8s ease 0.3s'
      }}>
        {/* Scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          top: `${scanLine}%`,
          background: 'linear-gradient(90deg, transparent, rgba(232,121,249,0.15), transparent)',
          pointerEvents: 'none'
        }} />

        {/* Corner decorations */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => {
          const [v, h] = pos.split('-')
          return (
            <div key={pos} style={{
              position: 'absolute',
              [v]: 12, [h]: 12,
              width: 20, height: 20,
              borderTop: v === 'top' ? '1px solid rgba(232,121,249,0.5)' : 'none',
              borderBottom: v === 'bottom' ? '1px solid rgba(232,121,249,0.5)' : 'none',
              borderLeft: h === 'left' ? '1px solid rgba(232,121,249,0.5)' : 'none',
              borderRight: h === 'right' ? '1px solid rgba(232,121,249,0.5)' : 'none',
            }} />
          )
        })}

        {/* Contact cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 10 : 16
        }}>
          {CONTACTS.map((c, i) => {
            const IconComponent = c.icon
            return (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textDecoration: 'none', color: 'inherit',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1 + 0.5}s`
                }}>
                <div style={{
                  padding: isMobile ? '14px 16px' : '20px 16px',
                  background: hovered === i ? `linear-gradient(135deg, ${c.color}18, ${c.color}08)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${hovered === i ? c.color + '50' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14,
                  textAlign: isMobile ? 'left' : 'center',
                  display: isMobile ? 'flex' : 'block',
                  alignItems: isMobile ? 'center' : 'unset',
                  gap: isMobile ? 14 : 0,
                  transform: hovered === i ? 'translateY(-4px) scale(1.02)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: hovered === i ? `0 10px 30px ${c.color}30` : 'none',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    marginBottom: isMobile ? 0 : 10,
                    filter: hovered === i ? `drop-shadow(0 0 10px ${c.color})` : 'none',
                    transition: 'filter 0.3s', color: c.color,
                    flexShrink: 0
                  }}>
                    <IconComponent size={isMobile ? 26 : 32} />
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700,
                      fontSize: isMobile ? 13 : 14,
                      marginBottom: 4
                    }}>
                      {c.label}
                    </div>
                    <div style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: isMobile ? 9 : 9,
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.03em',
                      wordBreak: 'break-all'
                    }}>
                      {c.handle}
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: isMobile ? 36 : 60,
        textAlign: 'center',
        fontFamily: 'Space Mono, monospace',
        fontSize: isMobile ? 9 : 10,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.15em',
        padding: isMobile ? '0 16px' : '0'
      }}>
        DESIGNED & BUILT BY INTAN AL' AINUN · {new Date().getFullYear()} ·
      </div>
    </section>
  )
}