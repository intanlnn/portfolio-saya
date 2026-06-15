import { useState, useRef, useEffect } from 'react'

const PROJECTS = [
  {
    id: 1, title: 'Company Profile PT Satria Security', subtitle: 'React JS · Website',
    desc: 'Website company profile resmi PT Satria Security Nusantara Pertama, menampilkan layanan dan informasi perusahaan secara profesional.',
    tags: ['React JS', 'MySQL', 'Company Profile'],
    color: '#1D9E75', iconBg: '#E1F5EE', iconColor: '#0F6E56',
    image: '/satria.png'
  },
  {
    id: 2, title: 'Sistem Reservasi Photobooth', subtitle: 'PHP Laravel · Website',
    desc: 'Platform reservasi photobooth berbasis web dengan manajemen jadwal, input data pemesanan, dan konfirmasi otomatis.',
    tags: ['PHP', 'Laravel', 'MySQL'],
    color: '#7F77DD', iconBg: '#EEEDFE', iconColor: '#534AB7',
    image: '/booth.png'
  },
  {
    id: 3, title: 'Translate Bahasa Palembang', subtitle: 'React JS · Website',
    desc: 'Platform terjemahan dua arah Bahasa Indonesia dan Bahasa Palembang untuk pelestarian bahasa daerah Sumatera Selatan.',
    tags: ['React JS', 'Kamus Digital', 'Budaya Lokal'],
    color: '#BA7517', iconBg: '#FAEEDA', iconColor: '#854F0B',
    image: '/translate.png'
  },
  {
    id: 4, title: "Qurable – Al-Qur'an Digital", subtitle: 'React Native · Mobile',
    desc: "Aplikasi Al-Qur'an mobile inklusif untuk penyandang disabilitas, dengan fitur aksesibilitas dan audio tilawah.",
    tags: ['React Native', "Al-Qur'an Digital", 'Disabilitas'],
    color: '#378ADD', iconBg: '#E6F1FB', iconColor: '#185FA5',
    image: '/qurable.png'
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

export default function ProjectsSection() {
  const [hovered, setHovered] = useState(null)
  const [inView, setInView] = useState(false)
  const [preview, setPreview] = useState(null)
  const ref = useRef(null)
  const width = useWindowSize()

  const isMobile = width < 768
  const isTablet = width < 1024

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Lock scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = preview ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [preview])

  const p = preview

  return (
    <section id="projects" ref={ref} style={{
      minHeight: '70vh',
      padding: isMobile ? '60px 4%' : '100px 5%',
      position: 'relative', zIndex: 10
    }}>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      {/* ===== MODAL PREVIEW ===== */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.2s ease',
            padding: isMobile ? '16px' : '0',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : '90vw',
              maxHeight: '88vh',
              borderRadius: isMobile ? 14 : 20,
              overflow: 'hidden',
              border: `1px solid ${p.color}50`,
              boxShadow: `0 0 80px ${p.color}30`,
              animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(8,4,16,0.97)',
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: isMobile ? '12px 14px' : '14px 20px',
              borderBottom: `1px solid ${p.color}25`,
              background: `${p.color}10`,
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: isMobile ? 9 : 10,
                  color: p.color, letterSpacing: '0.12em', textTransform: 'uppercase',
                  marginBottom: 2
                }}>
                  {p.subtitle}
                </div>
                <div style={{ fontWeight: 700, fontSize: isMobile ? 13 : 15, color: '#fff' }}>
                  {p.title}
                </div>
              </div>
              <button
                onClick={() => setPreview(null)}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${p.color}40`,
                  color: '#fff', fontSize: 15, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = p.color
                  e.currentTarget.style.borderColor = p.color
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.borderColor = `${p.color}40`
                }}
              >
                ✕
              </button>
            </div>

            {/* Gambar */}
            <div style={{ overflow: 'auto', flexShrink: 1 }}>
              <img
                src={p.image}
                alt={`Preview ${p.title}`}
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  margin: '0 auto',
                }}
              />
            </div>

            <div style={{
              height: 3,
              background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
              flexShrink: 0,
            }} />
          </div>
        </div>
      )}

      {/* Section Header */}
      <div style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
        textAlign: 'center',
        marginBottom: isMobile ? 40 : 70
      }}>
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? 10 : 11,
          letterSpacing: '0.3em', color: '#06b6d4'
        }}>
          Project Museum
        </span>
        <h2 style={{
          fontSize: isMobile ? '1.8rem' : 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 800, marginTop: 12,
          background: 'linear-gradient(135deg,#fff,#67e8f9)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Digital Artifacts
        </h2>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? '1fr'
          : isTablet
          ? 'repeat(2, 1fr)'
          : 'repeat(4, 1fr)',
        gap: isMobile ? 12 : 16,
        maxWidth: 1200,
        margin: '0 auto',
        alignItems: 'stretch',
      }}>
        {PROJECTS.map((proj, i) => (
          <div
            key={proj.id}
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
              border: `1px solid ${hovered === i ? proj.color + '60' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 20,
              padding: isMobile ? '18px' : '22px',
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

              {hovered === i && (
                <div style={{
                  position: 'absolute', width: 160, height: 160,
                  borderRadius: '50%', top: -50, right: -50,
                  background: `radial-gradient(circle, ${proj.color}40 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{
                fontSize: isMobile ? 9 : 10,
                fontFamily: 'Space Mono, monospace',
                color: proj.color, letterSpacing: '0.12em', marginBottom: 6,
                textTransform: 'uppercase', textAlign: 'center',
              }}>
                {proj.subtitle}
              </div>

              <h3 style={{
                fontSize: isMobile ? 14 : 15, fontWeight: 700, marginBottom: 10,
                color: '#ffffff', lineHeight: 1.4, textAlign: 'center',
              }}>
                {proj.title}
              </h3>

              <p style={{
                fontSize: isMobile ? 12 : 12, color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7, marginBottom: 16, flex: 1,
                textAlign: isMobile ? 'left' : 'justify',
              }}>
                {proj.desc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                {proj.tags.map(tag => (
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

              <button
                onClick={() => setPreview(proj)}
                style={{
                  width: '100%', padding: '8px 0', borderRadius: 10,
                  background: `${proj.color}18`,
                  border: `1px solid ${proj.color}40`,
                  color: proj.color,
                  fontFamily: 'Space Mono, monospace', fontSize: 10,
                  letterSpacing: '0.1em', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: 600,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${proj.color}35`
                  e.currentTarget.style.boxShadow = `0 0 16px ${proj.color}30`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${proj.color}18`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                LIHAT PROJECT ↗
              </button>

              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${proj.color}, transparent)`,
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