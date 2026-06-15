// AchievementsSection.jsx
import { useRef, useEffect, useState } from 'react'

const ACHIEVEMENTS = [
  {
    title: 'Finalis Lomba UI/UX Design',
    event: 'SIFEST HIMSI 2024',
    organizer: 'Himpunan Mahasiswa Sistem Informasi – Universitas Sriwijaya',
    period: '2024',
    desc: 'Mencapai tahap final dalam kompetisi UI/UX Design tingkat mahasiswa. Merancang prototype aplikasi dengan pendekatan human-centered design yang inklusif dan fungsional.',
    tags: ['UI/UX Design', 'Figma', 'Prototyping'],
    color: '#7c3aed', badge: 'FINALIS', sertif: '/sifest.jpeg'
  },
  {
    title: 'Bronze Medal – LETIN',
    event: 'Lomba Essay Tingkat Nasional',
    organizer: 'Nusantara Muda',
    period: '2025',
    desc: 'Meraih medali perunggu dalam lomba esai tingkat nasional. Menulis esai ilmiah yang kompetitif dan berhasil diakui di antara peserta dari seluruh Indonesia.',
    tags: ['Essay Ilmiah', 'Penulisan', 'Nasional'],
    color: '#f59e0b', badge: 'BRONZE MEDAL', sertif: '/letin.jpeg'
  },
  {
    title: 'Finalis Desain Aplikasi',
    event: "Musabaqah Tilawatil Qur'an Mahasiswa Nasional (MTQMN)",
    organizer: 'Kementerian Pendidikan Tinggi, Sains, dan Teknologi',
    period: '2025',
    desc: 'Lolos sebagai finalis dalam MTQMN 2025 cabang lomba desain aplikasi. Bersaing di tingkat nasional antar mahasiswa dari berbagai universitas di Indonesia.',
    tags: ['App Design', 'UI/UX', 'Nasional'],
    color: '#06b6d4', badge: 'FINALIS', sertif: '/mtqmn.jpeg'
  },
  {
    title: '10 Besar – Desain Poster OHHFEST',
    event: 'OHHFEST Poster Design Competition',
    organizer: 'HM S1 K3 – FKM Universitas Hasanuddin',
    period: '2025',
    desc: 'Masuk 10 besar dalam kompetisi desain poster tingkat nasional antar mahasiswa. Menerapkan prinsip desain komunikasi visual yang efektif, kreatif, dan berdampak.',
    tags: ['Desain Poster', 'Visual Communication', 'Nasional'],
    color: '#34d399', badge: 'TOP 10', sertif: '/poster.png'
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

export default function AchievementsSection() {
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)
  const [showSertif, setShowSertif] = useState(false)
  const ref = useRef(null)
  const width = useWindowSize()
  const isMobile = width < 768

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setShowSertif(false) }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showSertif ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showSertif])

  const exp = ACHIEVEMENTS[active]

  return (
    <section id="achievements" ref={ref} style={{
      minHeight: '100vh',
      padding: isMobile ? '60px 4%' : '100px 5%',
      position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>

      {/* MODAL SERTIFIKAT */}
      {showSertif && (
        <div
          onClick={() => setShowSertif(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
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
              maxHeight: '85vh',
              borderRadius: isMobile ? 14 : 16,
              overflow: 'hidden',
              border: `1px solid ${exp.color}40`,
              boxShadow: `0 0 60px ${exp.color}30`,
              animation: 'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)'
            }}
          >
            <button
              onClick={() => setShowSertif(false)}
              aria-label="Tutup sertifikat"
              title="Tutup sertifikat"
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,0,0,0.7)',
                border: `1px solid ${exp.color}50`,
                color: '#fff', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = exp.color}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
            >
              ✕
            </button>

            <div style={{
              position: 'absolute', top: 12, left: 12,
              padding: '4px 12px', borderRadius: 20,
              background: `${exp.color}25`,
              border: `1px solid ${exp.color}50`,
              fontFamily: 'Space Mono, monospace', fontSize: 10,
              color: exp.color, letterSpacing: '0.1em',
              backdropFilter: 'blur(4px)', zIndex: 10
            }}>
              {exp.badge}
            </div>

            <img
              src={exp.sertif}
              alt={`Sertifikat ${exp.title}`}
              style={{
                display: 'block',
                width: '100%',
                maxHeight: '85vh',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
      `}</style>

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
          letterSpacing: '0.3em', color: '#f59e0b'
        }}>
          Hall of Fame
        </span>
        <h2 style={{
          fontSize: isMobile ? '1.8rem' : 'clamp(2rem,5vw,3.5rem)',
          fontWeight: 800, marginTop: 12,
          background: 'linear-gradient(135deg,#fff,#fde68a)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Achievements
        </h2>
      </div>

      <div style={{ width: '100%', maxWidth: 800 }}>
        {/* Tab selector */}
        <div style={{
          display: 'flex', gap: 4, marginBottom: isMobile ? 20 : 32,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 4,
          opacity: inView ? 1 : 0,
          transition: 'opacity 0.8s ease 0.2s',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          {ACHIEVEMENTS.map((a, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setShowSertif(false) }}
              aria-label={`Lihat pencapaian: ${a.title}`}
              aria-pressed={active === i}
              title={a.title}
              style={{
                flex: isMobile ? '1 1 calc(50% - 4px)' : 1,
                padding: isMobile ? '8px 6px' : '10px 8px',
                borderRadius: 8,
                background: active === i
                  ? `linear-gradient(135deg, ${a.color}30, ${a.color}10)`
                  : 'transparent',
                border: active === i
                  ? `1px solid ${a.color}40`
                  : '1px solid transparent',
                color: active === i ? '#fff' : 'rgba(255,255,255,0.4)',
                fontFamily: 'Space Mono, monospace',
                fontSize: isMobile ? 7 : 8,
                letterSpacing: '0.08em', cursor: 'pointer',
                transition: 'all 0.3s ease', textAlign: 'center', lineHeight: 1.4
              }}>
              {a.badge}
            </button>
          ))}
        </div>

        {/* Content card */}
        <div style={{ opacity: inView ? 1 : 0, transition: 'all 0.5s ease 0.3s' }}>
          <div style={{
            padding: isMobile ? '20px 16px' : 36,
            background: 'rgba(8,4,16,0.8)',
            border: `1px solid ${exp.color}25`,
            borderRadius: 20, backdropFilter: 'blur(16px)',
            boxShadow: `0 0 40px ${exp.color}15`
          }}>
            {/* Top row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap', gap: 12, marginBottom: 8
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: isMobile ? 17 : 22,
                  fontWeight: 800, marginBottom: 6, color: '#fff',
                  lineHeight: 1.3
                }}>
                  {exp.title}
                </h3>
                <div style={{
                  color: exp.color, fontFamily: 'Space Mono, monospace',
                  fontSize: isMobile ? 10 : 12, marginBottom: 4
                }}>
                  {exp.event}
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: isMobile ? 9 : 10
                }}>
                  {exp.organizer}
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'row' : 'column',
                alignItems: isMobile ? 'center' : 'flex-end',
                gap: 8, flexShrink: 0
              }}>
                <button
                  onClick={() => setShowSertif(true)}
                  aria-label={`Lihat sertifikat ${exp.title}`}
                  title={`Lihat sertifikat ${exp.title}`}
                  style={{
                    padding: isMobile ? '5px 12px' : '6px 16px',
                    borderRadius: 20,
                    background: `${exp.color}20`,
                    border: `1px solid ${exp.color}50`,
                    fontFamily: 'Space Mono, monospace',
                    fontSize: isMobile ? 9 : 10,
                    color: exp.color, letterSpacing: '0.1em',
                    fontWeight: 700, whiteSpace: 'nowrap',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${exp.color}40`
                    e.currentTarget.style.boxShadow = `0 0 16px ${exp.color}50`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${exp.color}20`
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  LIHAT
                </button>

                <div style={{
                  padding: isMobile ? '4px 10px' : '4px 12px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: isMobile ? 9 : 10,
                  color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap'
                }}>
                  {exp.period}
                </div>
              </div>
            </div>

            <div style={{
              height: 1,
              background: `linear-gradient(90deg, ${exp.color}40, transparent)`,
              margin: isMobile ? '14px 0' : '20px 0'
            }} />

            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: isMobile ? 13 : 14,
              lineHeight: 1.8, marginBottom: isMobile ? 16 : 24,
              fontWeight: 400
            }}>
              {exp.desc}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 6 : 8 }}>
              {exp.tags.map(tag => (
                <span key={tag} style={{
                  padding: isMobile ? '4px 10px' : '5px 12px',
                  borderRadius: 20,
                  background: `${exp.color}12`,
                  border: `1px solid ${exp.color}30`,
                  fontSize: isMobile ? 10 : 11,
                  fontFamily: 'Space Mono, monospace',
                  color: exp.color
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div
          role="tablist"
          aria-label="Navigasi pencapaian"
          style={{
            display: 'flex', justifyContent: 'center',
            gap: 8, marginTop: isMobile ? 16 : 24
          }}
        >
          {ACHIEVEMENTS.map((a, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setShowSertif(false) }}
              aria-label={`Tampilkan pencapaian ${i + 1}: ${a.title}`}
              aria-selected={active === i}
              role="tab"
              title={a.title}
              style={{
                width: active === i ? 24 : 8, height: 8, borderRadius: 4,
                background: active === i ? a.color : 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.3s ease',
                boxShadow: active === i ? `0 0 10px ${a.color}` : 'none'
              }} />
          ))}
        </div>
      </div>
    </section>
  )
}