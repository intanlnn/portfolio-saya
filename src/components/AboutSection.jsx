import { useEffect, useRef, useState } from 'react'

const MILESTONES = [
  {
    year: 'Semester 1 (2024)',
    title: 'Belajar Dasar Web',
    desc: 'Mulai mengenal dunia pemrograman web dengan mempelajari HTML, CSS, dan dasar JavaScript.',
    icon: '⬡', color: '#7c3aed'
  },
  {
    year: 'Semester 2 (2025)',
    title: 'Ikut Lomba & Organisasi',
    desc: 'Mulai aktif mengikuti lomba, mengembangkan kemampuan teamwork, public speaking, dan problem solving. Pada semester ini saya join di organisasi HIMSI',
    icon: '⟡', color: '#6366f1'
  },
  {
    year: 'Semester 3 (2025)',
    title: 'Mendalami Web Development',
    desc: 'Belajar PHP, MySQL, Laravel, dan React untuk membangun website yang lebih modern dan interaktif.',
    icon: '◎', color: '#8b5cf6'
  },
  {
    year: 'Semester 4 (2026)',
    title: 'Masuk Dunia Mobile App',
    desc: 'Mulai mengembangkan aplikasi mobile dan mempelajari teknologi cross-platform untuk membuat aplikasi yang responsif.',
    icon: '◈', color: '#a855f7'
  },
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

export default function AboutSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [inView, setInView] = useState(false)
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

  return (
    <section id="about" ref={ref} style={{
      minHeight: '100vh',
      padding: isMobile ? '60px 4%' : '100px 5%',
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
        textAlign: 'center',
        marginBottom: isMobile ? 36 : 60
      }}>
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? 10 : 11,
          letterSpacing: '0.3em', color: '#7c3aed', textTransform: 'uppercase'
        }}>
          Origin Story
        </span>
        <h2 style={{
          fontSize: isMobile ? '1.8rem' : 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 800, marginTop: 12,
          background: 'linear-gradient(135deg,#fff,#a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          The Journey
        </h2>
      </div>

      <div style={{ width: '100%', maxWidth: 900, position: 'relative' }}>

        {/* ===== DESKTOP: timeline tengah ===== */}
        {!isMobile && (
          <>
            {/* Track line */}
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(to bottom, transparent, #7c3aed, #e879f9, transparent)',
              transform: 'translateX(-50%)',
              opacity: inView ? 1 : 0, transition: 'opacity 1s ease 0.3s'
            }}>
              <div style={{
                position: 'absolute', width: 10, height: 10, borderRadius: '50%',
                background: '#fff', boxShadow: '0 0 20px #a78bfa, 0 0 40px #a78bfa',
                left: '50%', transform: 'translateX(-50%)',
                top: `${(activeIdx / (MILESTONES.length - 1)) * 92}%`,
                transition: 'top 0.6s cubic-bezier(0.34,1.56,0.64,1)'
              }} />
            </div>

            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={i}
                  onClick={() => setActiveIdx(i)}
                  style={{
                    display: 'flex',
                    flexDirection: isLeft ? 'row' : 'row-reverse',
                    alignItems: 'center', marginBottom: 40,
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateX(0)' : `translateX(${isLeft ? -40 : 40}px)`,
                    transition: `all 0.7s ease ${i * 0.1 + 0.2}s`,
                    cursor: 'pointer',
                  }}>
                  <div style={{
                    width: '44%', padding: '20px 24px',
                    background: activeIdx === i ? 'rgba(124,58,237,0.15)' : 'rgba(10,5,20,0.7)',
                    border: `1px solid ${activeIdx === i ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.15)'}`,
                    borderRadius: 12, backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    boxShadow: activeIdx === i ? '0 0 30px rgba(124,58,237,0.2)' : 'none'
                  }}>
                    <div style={{ color: m.color, fontFamily: 'Space Mono, monospace', fontSize: 11, marginBottom: 6, letterSpacing: '0.1em' }}>
                      {m.year}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{m.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6, fontWeight: 400 }}>{m.desc}</div>
                  </div>

                  <div style={{ width: '12%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: activeIdx === i ? m.color : 'rgba(20,10,40,0.9)',
                      border: `2px solid ${m.color}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, boxShadow: activeIdx === i ? `0 0 20px ${m.color}` : 'none',
                      transition: 'all 0.3s ease', zIndex: 2
                    }}>
                      {m.icon}
                    </div>
                  </div>

                  <div style={{ width: '44%' }} />
                </div>
              )
            })}
          </>
        )}

        {/* ===== MOBILE: timeline kiri ===== */}
        {isMobile && (
          <div style={{ position: 'relative', paddingLeft: 48 }}>
            {/* Track line kiri */}
            <div style={{
              position: 'absolute', left: 16, top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(to bottom, transparent, #7c3aed, #e879f9, transparent)',
              opacity: inView ? 1 : 0, transition: 'opacity 1s ease 0.3s'
            }}>
              <div style={{
                position: 'absolute', width: 8, height: 8, borderRadius: '50%',
                background: '#fff', boxShadow: '0 0 16px #a78bfa',
                left: '50%', transform: 'translateX(-50%)',
                top: `${(activeIdx / (MILESTONES.length - 1)) * 92}%`,
                transition: 'top 0.6s cubic-bezier(0.34,1.56,0.64,1)'
              }} />
            </div>

            {MILESTONES.map((m, i) => (
              <div key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  display: 'flex', alignItems: 'flex-start',
                  gap: 16, marginBottom: 28,
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.7s ease ${i * 0.1 + 0.2}s`,
                  cursor: 'pointer', position: 'relative'
                }}>
                {/* Node */}
                <div style={{
                  position: 'absolute', left: -40,
                  width: 30, height: 30, borderRadius: '50%',
                  background: activeIdx === i ? m.color : 'rgba(20,10,40,0.9)',
                  border: `2px solid ${m.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0,
                  boxShadow: activeIdx === i ? `0 0 16px ${m.color}` : 'none',
                  transition: 'all 0.3s ease', zIndex: 2,
                  top: 14
                }}>
                  {m.icon}
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, padding: '16px 18px',
                  background: activeIdx === i ? 'rgba(124,58,237,0.15)' : 'rgba(10,5,20,0.7)',
                  border: `1px solid ${activeIdx === i ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.15)'}`,
                  borderRadius: 12, backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  boxShadow: activeIdx === i ? '0 0 24px rgba(124,58,237,0.2)' : 'none'
                }}>
                  <div style={{ color: m.color, fontFamily: 'Space Mono, monospace', fontSize: 10, marginBottom: 4, letterSpacing: '0.08em' }}>
                    {m.year}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{m.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.6, fontWeight: 400 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}