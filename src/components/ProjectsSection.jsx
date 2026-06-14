import { useState, useRef, useEffect } from 'react'

const PROJECTS = [
  {
    id: 1, title: 'Company Profile PT Satria Security', subtitle: 'React JS · Website',
    desc: 'Website company profile resmi PT Satria Security Nusantara Pertama, menampilkan layanan dan informasi perusahaan secara profesional. ',
    tags: ['React JS', 'MySQL', 'Company Profile'],
    color: '#1D9E75', iconBg: '#E1F5EE', iconColor: '#0F6E56'
  },
  {
    id: 2, title: 'Sistem Reservasi Photobooth', subtitle: 'PHP Laravel · Website',
    desc: 'Platform reservasi photobooth berbasis web dengan manajemen jadwal, input data pemesanan, dan konfirmasi otomatis.',
    tags: ['PHP', 'Laravel', 'MySQL'],
    color: '#7F77DD', iconBg: '#EEEDFE', iconColor: '#534AB7'
  },
  {
    id: 3, title: 'Translate Bahasa Palembang', subtitle: 'React JS · Website',
    desc: 'Platform terjemahan dua arah Bahasa Indonesia dan Bahasa Palembang untuk pelestarian bahasa daerah Sumatera Selatan.',
    tags: ['React JS', 'Kamus Digital', 'Budaya Lokal'],
    color: '#BA7517', iconBg: '#FAEEDA', iconColor: '#854F0B'
  },
  {
    id: 4, title: "Qurable – Al-Qur'an Digital", subtitle: 'React Native · Mobile',
    desc: "Aplikasi Al-Qur'an mobile inklusif untuk penyandang disabilitas, dengan fitur aksesibilitas dan audio tilawah.",
    tags: ['React Native', 'Al-Qur\'an Digital', 'Disabilitas'],
    color: '#378ADD', iconBg: '#E6F1FB', iconColor: '#185FA5'
  },
]

export default function ProjectsSection() {
  const [hovered, setHovered] = useState(null)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="projects" ref={ref} style={{
      minHeight: '70vh', padding: '100px 5%', position: 'relative', zIndex: 10
    }}>
      {/* Section Header */}
      <div style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
        textAlign: 'center',
        marginBottom: 70
      }}>
        <span style={{
          fontFamily: 'Space Mono, monospace', fontSize: 11,
          letterSpacing: '0.3em', color: '#06b6d4'
        }}>
          Project Museum
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, marginTop: 12,
          background: 'linear-gradient(135deg,#fff,#67e8f9)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Digital Artifacts
        </h2>
      </div>

      {/* Grid — 4 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        maxWidth: 1200,
        margin: '0 auto',
        alignItems: 'stretch',
      }}>
        {PROJECTS.map((p, i) => (
          <div
            key={p.id}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView
                ? hovered === i ? 'translateY(-6px)' : 'translateY(0)'
                : 'translateY(40px)',
              transition: `all 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.1}s`,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <div style={{
              background: hovered === i
                ? 'linear-gradient(135deg, rgba(10,5,20,0.95), rgba(20,10,35,0.9))'
                : 'rgba(8,4,16,0.8)',
              border: `1px solid ${hovered === i ? p.color + '60' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 20,
              padding: '22px',
              backdropFilter: 'blur(20px)',
              boxShadow: hovered === i
                ? `0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`
                : '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}>

              {/* Glow orb */}
              {hovered === i && (
                <div style={{
                  position: 'absolute', width: 160, height: 160,
                  borderRadius: '50%', top: -50, right: -50,
                  background: `radial-gradient(circle, ${p.color}40 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              )}

              {/* Subtitle */}
              <div style={{
                fontSize: 10, fontFamily: 'Space Mono, monospace',
                color: p.color, letterSpacing: '0.12em', marginBottom: 6,
                textTransform: 'uppercase', textAlign: 'center',
              }}>
                {p.subtitle}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: 15, fontWeight: 700, marginBottom: 10,
                color: '#ffffff', lineHeight: 1.4, textAlign: 'center',
              }}>
                {p.title}
              </h3>

              {/* Desc — flex: 1 makes all cards equal height */}
              <p style={{
                fontSize: 12, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7, marginBottom: 16, flex: 1, textAlign: 'justify',
              }}>
                {p.desc}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '3px 9px', borderRadius: 20, fontSize: 10,
                    fontFamily: 'Space Mono, monospace',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.45)',
                    letterSpacing: '0.04em',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom accent bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                opacity: hovered === i ? 1 : 0,
                transition: 'opacity 0.3s',
              }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}