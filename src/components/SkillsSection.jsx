import { useEffect, useRef, useState } from 'react'

const SKILLS = [
  { name: 'React JS', cat: 'Frontend' },
  { name: 'React Native', cat: 'Frontend' },
  { name: 'JavaScript', cat: 'Frontend' },
  { name: 'PHP Laravel', cat: 'Backend' },
  { name: 'MySQL', cat: 'Backend' },
  { name: 'UI/UX Design', cat: 'Design' },
  { name: 'Figma', cat: 'Design' },
  { name: 'HTML/CSS', cat: 'Frontend' },
  { name: 'React Native', cat: 'Frontend' },
  { name: 'Basis Data', cat: 'Backend' },
]

const CAT_COLORS = {
  Frontend: '#7c3aed',
  Backend: '#34d399',
  Design: '#f59e0b',
}

export default function SkillsSection() {
  const canvasRef = useRef(null)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)
  const angleRef = useRef(0)
  const animRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight
    const cx = W / 2, cy = H / 2

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      angleRef.current += 0.008
      const angle = angleRef.current
      const N = SKILLS.length
      const helixR = 55
      const helixH = H * 0.75
      const startY = cy - helixH / 2

      for (let i = 0; i < N; i++) {
        const t = i / (N - 1)
        const y = startY + t * helixH
        const a1 = angle + t * Math.PI * 2.5
        const a2 = a1 + Math.PI
        const x1 = cx + Math.cos(a1) * helixR
        const x2 = cx + Math.cos(a2) * helixR
        const z1 = Math.sin(a1)
        const z2 = Math.sin(a2)
        const skill = SKILLS[i]
        const color = CAT_COLORS[skill.cat] || '#8b5cf6'

        // Connection line
        ctx.beginPath()
        ctx.moveTo(x1, y)
        ctx.lineTo(x2, y)
        ctx.strokeStyle = `rgba(139,92,246,0.15)`
        ctx.lineWidth = 1
        ctx.stroke()

        // Strand 1
        const r1 = 5 + (z1 + 1) * 4
        const alpha1 = (z1 + 1) / 2 * 0.8 + 0.2
        ctx.beginPath()
        ctx.arc(x1, y, r1, 0, Math.PI * 2)
        ctx.fillStyle = `${color}${Math.round(alpha1 * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
        if (z1 > 0) {
          ctx.shadowColor = color
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        }

        // Label on front
        if (z1 > 0.5) {
          ctx.fillStyle = '#fff'
          ctx.font = `bold ${8 + z1 * 4}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(skill.name, x1, y)
        }

        // Strand 2
        const r2 = 5 + (z2 + 1) * 4
        const alpha2 = (z2 + 1) / 2 * 0.8 + 0.2
        ctx.beginPath()
        ctx.arc(x2, y, r2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99,102,241,${alpha2 * 0.6})`
        ctx.fill()
      }

      // Backbone lines
      for (let i = 0; i < N - 1; i++) {
        const t0 = i / (N - 1), t1 = (i + 1) / (N - 1)
        const y0 = startY + t0 * helixH, y1 = startY + t1 * helixH
        const a0 = angle + t0 * Math.PI * 2.5
        const a1 = angle + t1 * Math.PI * 2.5
        const x0f = cx + Math.cos(a0) * helixR
        const x1f = cx + Math.cos(a1) * helixR

        ctx.beginPath()
        ctx.moveTo(x0f, y0)
        ctx.lineTo(x1f, y1)
        ctx.strokeStyle = 'rgba(139,92,246,0.25)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        const x0b = cx + Math.cos(a0 + Math.PI) * helixR
        const x1b = cx + Math.cos(a1 + Math.PI) * helixR
        ctx.beginPath()
        ctx.moveTo(x0b, y0)
        ctx.lineTo(x1b, y1)
        ctx.strokeStyle = 'rgba(99,102,241,0.2)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <section id="skills" ref={ref} style={{
      minHeight: '100vh', padding: '100px 5%', position: 'relative', zIndex: 10,
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      {/* Header */}
      <div style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
        textAlign: 'center',
        marginBottom: 60
      }}>
        <span style={{
          fontFamily: 'Space Mono, monospace', fontSize: 11,
          letterSpacing: '0.3em', color: '#34d399'
        }}>
          DNA of Skills
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, marginTop: 12,
          background: 'linear-gradient(135deg,#fff,#86efac)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Capabilities
        </h2>
      </div>

      <div style={{
        display: 'flex', gap: 60, alignItems: 'center',
        width: '100%', maxWidth: 900, flexWrap: 'wrap', justifyContent: 'center'
      }}>
        {/* DNA Canvas */}
        <canvas
          ref={canvasRef}
          style={{ width: 200, height: 460, borderRadius: 16, flexShrink: 0 }}
          width={200}
          height={460}
        />

        {/* Skills list */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {SKILLS.map((skill, i) => {
            const color = CAT_COLORS[skill.cat]
            return (
              <div key={skill.name} style={{
                marginBottom: 18,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(30px)',
                transition: `all 0.5s ease ${i * 0.05}s`
              }}>
                {/* Label */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', marginBottom: 6
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{skill.name}</span>
                  <span style={{
                    fontSize: 11, fontFamily: 'Space Mono, monospace', color
                  }}>
                    {skill.cat}
                  </span>
                </div>

                {/* Bar — always full width */}
                <div style={{
                  height: 4, background: 'rgba(255,255,255,0.06)',
                  borderRadius: 2, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 2,
                    width: inView ? '100%' : '0%',
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    boxShadow: `0 0 8px ${color}`,
                    transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08 + 0.3}s`
                  }} />
                </div>
              </div>
            )
          })}

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            {Object.entries(CAT_COLORS).map(([cat, color]) => (
              <div key={cat} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontFamily: 'Space Mono, monospace'
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: color, boxShadow: `0 0 8px ${color}`
                }} />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}