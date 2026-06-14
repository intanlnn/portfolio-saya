import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let mouse = { x: W / 2, y: H / 2 }
    let animId

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005
    }))

    const nebulas = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 200 + 100,
      hue: Math.floor(Math.random() * 3) === 0 ? '259,91%,65%' : Math.floor(Math.random() * 2) === 0 ? '199,89%,48%' : '280,85%,55%',
      opacity: Math.random() * 0.06 + 0.02
    }))

    const onMouseMove = (e) => { mouse = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#000008'
      ctx.fillRect(0, 0, W, H)

      // Nebulas
      nebulas.forEach(n => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r)
        grad.addColorStop(0, `hsla(${n.hue},${n.opacity})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Mouse glow
      const mg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250)
      mg.addColorStop(0, 'rgba(99,69,220,0.04)')
      mg.addColorStop(1, 'transparent')
      ctx.fillStyle = mg
      ctx.fillRect(0, 0, W, H)

      // Stars
      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed
        s.y -= s.speed
        if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W }
        const tw = (Math.sin(s.twinkle) * 0.4 + 0.6) * s.opacity
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${tw})`
        ctx.fill()
        if (s.r > 1) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,180,255,${tw * 0.15})`
          ctx.fill()
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none'
    }} />
  )
}
