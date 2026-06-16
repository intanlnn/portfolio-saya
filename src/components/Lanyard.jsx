import { useEffect, useRef } from 'react'

const GRAVITY = 0.38
const DAMPING = 0.87
const SEGMENTS = 14

// Card dimensions
const CW = 200
const CH = 300

function lerp(a, b, t) { return a + (b - a) * t }

export default function Lanyard({ onCardClick, photoSrc }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    points: [], velocities: [],
    dragging: false, dragIdx: null,
    mouse: { x: 0, y: 0 },
    cardAngle: 0, cardAngleTarget: 0,
    glow: 0, hovered: false,
  })
  const imgRef    = useRef(null)
  const imgReady  = useRef(false)

  useEffect(() => {
    if (!photoSrc) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => { imgRef.current = img; imgReady.current = true }
    img.onerror = () => { imgReady.current = false }
    img.src = photoSrc
  }, [photoSrc])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let W, H, animId
    const s = stateRef.current

    const initPoints = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      const ax = W / 2, ay = 16
      s.points = []; s.velocities = []
      for (let i = 0; i <= SEGMENTS; i++) {
        s.points.push({ x: ax, y: ay + i * (H * 0.44 / SEGMENTS) })
        s.velocities.push({ x: 0, y: 0 })
      }
    }
    initPoints()

    const cardTip  = () => s.points[SEGMENTS]
    const isOnCard = (mx, my) => {
      const p = cardTip()
      // hit area includes overflow photo region above card
      return mx > p.x - CW/2 && mx < p.x + CW/2
          && my > p.y - 60    && my < p.y + CH
    }

    // ── Events ────────────────────────────────────────────────
    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect()
      s.mouse = { x: e.clientX - r.left, y: e.clientY - r.top }
      s.hovered = isOnCard(s.mouse.x, s.mouse.y)
      canvas.style.cursor = s.hovered ? 'pointer' : 'default'
      if (s.dragging && s.dragIdx !== null) {
        s.points[s.dragIdx].x = s.mouse.x
        s.points[s.dragIdx].y = s.mouse.y
        s.velocities[s.dragIdx] = { x: 0, y: 0 }
      }
    }
    const onMouseDown = (e) => {
      const r  = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left, my = e.clientY - r.top
      for (let i = 2; i <= SEGMENTS; i++) {
        if (Math.hypot(mx - s.points[i].x, my - s.points[i].y) < 24) {
          s.dragging = true; s.dragIdx = i; return
        }
      }
      if (isOnCard(mx, my)) { s.dragging = true; s.dragIdx = SEGMENTS }
    }
    const onMouseUp   = () => { s.dragging = false; s.dragIdx = null }
    const onClick     = (e) => {
      const r  = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left, my = e.clientY - r.top
      if (isOnCard(mx, my) && !s.dragging && onCardClick) onCardClick()
    }
    const onTouchMove = (e) => {
      e.preventDefault()
      const r = canvas.getBoundingClientRect(), t = e.touches[0]
      s.mouse = { x: t.clientX - r.left, y: t.clientY - r.top }
      if (s.dragging && s.dragIdx !== null) {
        s.points[s.dragIdx].x = s.mouse.x
        s.points[s.dragIdx].y = s.mouse.y
      }
    }
    const onTouchStart = (e) => {
      const r = canvas.getBoundingClientRect(), t = e.touches[0]
      const mx = t.clientX - r.left, my = t.clientY - r.top
      if (isOnCard(mx, my)) { s.dragging = true; s.dragIdx = SEGMENTS }
    }
    const onTouchEnd = () => { s.dragging = false; s.dragIdx = null }

    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mousedown',  onMouseDown)
    canvas.addEventListener('mouseup',    onMouseUp)
    canvas.addEventListener('click',      onClick)
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchend',   onTouchEnd,   { passive: true })

    // ── Physics ───────────────────────────────────────────────
    const simulate = () => {
      const ax = W / 2, ay = 16
      s.points[0].x = ax; s.points[0].y = ay
      const rest = H * 0.44 / SEGMENTS
      const wind = (s.mouse.x - ax) * 0.0006
      for (let i = 1; i <= SEGMENTS; i++) {
        if (s.dragging && s.dragIdx === i) continue
        s.velocities[i].x += wind
        s.velocities[i].y += GRAVITY
        s.velocities[i].x *= DAMPING
        s.velocities[i].y *= DAMPING
        s.points[i].x += s.velocities[i].x
        s.points[i].y += s.velocities[i].y
      }
      for (let iter = 0; iter < 10; iter++) {
        for (let i = 1; i <= SEGMENTS; i++) {
          if (s.dragging && s.dragIdx === i) continue
          const a = s.points[i-1], b = s.points[i]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.hypot(dx, dy) || 0.001
          const diff = (dist - rest) / dist * 0.5
          if (i > 1) { a.x += dx*diff; a.y += dy*diff }
          b.x -= dx*diff; b.y -= dy*diff
        }
        s.points[0].x = ax; s.points[0].y = ay
      }
      s.cardAngleTarget = s.velocities[SEGMENTS].x * 0.09
      s.cardAngle  = lerp(s.cardAngle,  s.cardAngleTarget, 0.08)
      s.glow       = lerp(s.glow, s.hovered ? 1 : 0, 0.07)
    }

    // ── Helpers ───────────────────────────────────────────────
    const rr = (x, y, w, h, r) => {
      ctx.beginPath()
      ctx.moveTo(x+r,y)
      ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,    x+w,y+r,   r)
      ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h, x+w-r,y+h,r)
      ctx.lineTo(x+r,y+h); ctx.arcTo(x,  y+h,  x,  y+h-r, r)
      ctx.lineTo(x,y+r); ctx.arcTo(x,  y,    x+r,y,    r)
      ctx.closePath()
    }

    // ── Rope ──────────────────────────────────────────────────
    const drawRope = () => {
      ctx.beginPath()
      ctx.moveTo(s.points[0].x+2, s.points[0].y+3)
      for (let i=1;i<=SEGMENTS;i++) ctx.lineTo(s.points[i].x+2, s.points[i].y+3)
      ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=6
      ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke()

      for (let strand=0; strand<2; strand++) {
        const off = strand===0 ? -1.5 : 1.5
        ctx.beginPath()
        ctx.moveTo(s.points[0].x+off, s.points[0].y)
        for (let i=1;i<=SEGMENTS;i++) ctx.lineTo(s.points[i].x+off, s.points[i].y)
        const g = ctx.createLinearGradient(
          s.points[0].x, s.points[0].y,
          s.points[SEGMENTS].x, s.points[SEGMENTS].y
        )
        if (strand===0) {
          g.addColorStop(0,'#5b21b6'); g.addColorStop(0.5,'#7c3aed'); g.addColorStop(1,'#4f46e5')
        } else {
          g.addColorStop(0,'#3b0764'); g.addColorStop(0.5,'#6d28d9'); g.addColorStop(1,'#3730a3')
        }
        ctx.strokeStyle=g; ctx.lineWidth=strand===0?4:2.5; ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(s.points[0].x-1, s.points[0].y)
      for (let i=1;i<=Math.floor(SEGMENTS*0.55);i++)
        ctx.lineTo(s.points[i].x-1, s.points[i].y)
      ctx.strokeStyle='rgba(196,181,253,0.18)'; ctx.lineWidth=1; ctx.stroke()
    }

    // ── Card ──────────────────────────────────────────────────
    const drawCard = () => {
      const p   = cardTip()
      const now = Date.now()

      ctx.save()
      ctx.translate(p.x, p.y + CH/2)
      ctx.rotate(s.cardAngle)

      // Halo
      if (s.glow > 0.02) {
        const halo = ctx.createRadialGradient(0,0,0,0,0,180)
        halo.addColorStop(0, `rgba(139,92,246,${s.glow*0.22})`)
        halo.addColorStop(1,'transparent')
        ctx.fillStyle=halo; ctx.fillRect(-180,-180,360,360)
      }

      // ── LAYER 1: Card body + shadow (clipped) ───────────────
      ctx.shadowColor=`rgba(0,0,0,${0.6+s.glow*0.2})`
      ctx.shadowBlur=40+s.glow*20
      ctx.shadowOffsetX=s.cardAngle*10
      ctx.shadowOffsetY=16

      rr(-CW/2,-CH/2,CW,CH,14)
      const bg = ctx.createLinearGradient(-CW/2,-CH/2,CW/2,CH/2)
      bg.addColorStop(0,'#140a28'); bg.addColorStop(0.6,'#110820'); bg.addColorStop(1,'#0a0514')
      ctx.fillStyle=bg; ctx.fill()

      ctx.shadowBlur=0; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0

      // ── LAYER 2: Card inner contents (clipped to card) ──────
      ctx.save()
      rr(-CW/2,-CH/2,CW,CH,14); ctx.clip()

      // Header band
      const headerGrad = ctx.createLinearGradient(0,-CH/2,0,-CH/2+36)
      headerGrad.addColorStop(0,'rgba(109,40,217,0.9)')
      headerGrad.addColorStop(1,'rgba(109,40,217,0.0)')
      ctx.fillStyle=headerGrad; ctx.fillRect(-CW/2,-CH/2,CW,36)

      // Photo background zone — darker placeholder area
      const photoTop = -CH/2 + 40
      const photoH   = CH * 0.48
      const photoW   = CW - 20
      const pBg = ctx.createLinearGradient(0, photoTop, 0, photoTop+photoH)
      pBg.addColorStop(0,'#1e1048'); pBg.addColorStop(1,'#110820')
      ctx.fillStyle=pBg
      ctx.fillRect(-photoW/2, photoTop, photoW, photoH)

      // Vignette inside photo zone
      const vig = ctx.createRadialGradient(0, photoTop+photoH*0.5, photoH*0.1, 0, photoTop+photoH*0.5, photoH*0.7)
      vig.addColorStop(0,'transparent')
      vig.addColorStop(1,'rgba(0,0,0,0.45)')
      ctx.fillStyle=vig; ctx.fillRect(-photoW/2, photoTop, photoW, photoH)

      // Info section background
      const infoTop = photoTop + photoH + 8
      ctx.fillStyle='rgba(10,5,20,0.6)'
      ctx.fillRect(-CW/2, infoTop-4, CW, CH/2 - infoTop + 4)

      // Separator
      const sepG = ctx.createLinearGradient(-CW/2,0,CW/2,0)
      sepG.addColorStop(0,'transparent')
      sepG.addColorStop(0.3,'rgba(167,139,250,0.5)')
      sepG.addColorStop(0.7,'rgba(167,139,250,0.5)')
      sepG.addColorStop(1,'transparent')
      ctx.fillStyle=sepG; ctx.fillRect(-CW/2, infoTop-5, CW, 0.8)

      // Name
      ctx.fillStyle='#ffffff'
      ctx.font='bold 13.5px "Syne",sans-serif'
      ctx.textAlign='center'
      ctx.fillText('INTAN AL AINUN', 0, infoTop+13)

      // Role
      ctx.fillStyle='rgba(167,139,250,0.9)'
      ctx.font='9px "Space Mono",monospace'
      ctx.fillText('SISTEM INFORMASI', 0, infoTop+30)

      ctx.fillStyle='rgba(139,92,246,0.25)'
      ctx.fillRect(-CW/2+14, infoTop+39, CW-28, 0.6)

      // Tag
      const tag = 'UNIVERSITAS SRIWIJAYA'
      const tw  = tag.length*5.2+12
      ctx.beginPath()
      ctx.roundRect(-tw/2, infoTop+49, tw, 16, 5)
      ctx.fillStyle='rgba(99,102,241,0.18)'; ctx.fill()
      ctx.strokeStyle='rgba(139,92,246,0.45)'; ctx.lineWidth=0.7; ctx.stroke()
      ctx.fillStyle='rgba(196,181,253,0.9)'
      ctx.font='9px "Space Mono",monospace'; ctx.textAlign='center'
      ctx.fillText(tag, 0, infoTop+60)

      // Pulsing hint
      const alpha = (Math.sin(now*0.003)*0.5+0.5)*0.65
      ctx.fillStyle=`rgba(167,139,250,${alpha})`
      ctx.font='10px "Space Mono",monospace'
      ctx.fillText('click lanyard to explore', 0, CH/2-12)

      // Shimmer stripe on hover
      if (s.glow > 0.05) {
        const shimX = -CW/2 + ((now*0.04) % (CW+80)) - 40
        const shim  = ctx.createLinearGradient(shimX,0,shimX+40,0)
        shim.addColorStop(0,'transparent')
        shim.addColorStop(0.5,`rgba(255,255,255,${s.glow*0.07})`)
        shim.addColorStop(1,'transparent')
        ctx.fillStyle=shim; ctx.fillRect(-CW/2,-CH/2,CW,CH)
      }

      ctx.restore() // end card clip

      const OVERFLOW = 15 // sebelumnya 60
      const photoDrawW = CW - 20
      const photoDrawH = CH * 0.60 + OVERFLOW
      const photoDrawX = -photoDrawW / 2 + 12
      const photoDrawY = -CH/2 - OVERFLOW + 15

      // Photo shadow (gives depth / lift effect)
      ctx.save()
      ctx.shadowColor = `rgba(0,0,0,${0.65 + s.glow*0.2})`
      ctx.shadowBlur  = 24 + s.glow * 16
      ctx.shadowOffsetX = s.cardAngle * -6   // tilts with card swing
      ctx.shadowOffsetY = 8

      if (imgReady.current && imgRef.current) {
        const img = imgRef.current
        const iw  = img.naturalWidth, ih = img.naturalHeight

        // Save/restore for rounded photo clip
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(photoDrawX, photoDrawY, photoDrawW, photoDrawH, 8)
        ctx.clip()

        // cover-fit, shift crop upward so face is centered
        const scale = Math.max(photoDrawW/iw, photoDrawH/ih)
        const dw    = iw*scale, dh = ih*scale
        const dx    = photoDrawX + (photoDrawW-dw)/2
        const dy    = photoDrawY + (photoDrawH-dh)/2 
        ctx.drawImage(img, dx, dy, dw, dh)

        // Gradient fade at bottom so photo blends into card info section
        const fadeH = photoDrawH * 0.32
        const fade  = ctx.createLinearGradient(0, photoDrawY+photoDrawH-fadeH, 0, photoDrawY+photoDrawH)
        fade.addColorStop(0, 'transparent')
        fade.addColorStop(1, '#0a0514')
        ctx.fillStyle=fade
        ctx.fillRect(photoDrawX, photoDrawY+photoDrawH-fadeH, photoDrawW, fadeH)

        ctx.restore()
      } else {
        // Placeholder with silhouette
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(photoDrawX, photoDrawY, photoDrawW, photoDrawH, 8)
        ctx.clip()

        const ph = ctx.createLinearGradient(0,photoDrawY,0,photoDrawY+photoDrawH)
        ph.addColorStop(0,'#2e1065'); ph.addColorStop(1,'#1e1b4b')
        ctx.fillStyle=ph; ctx.fillRect(photoDrawX,photoDrawY,photoDrawW,photoDrawH)

        ctx.fillStyle='rgba(139,92,246,0.3)'
        ctx.beginPath(); ctx.arc(0, photoDrawY+photoDrawH*0.25, 22, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(0, photoDrawY+photoDrawH*0.62, 30, 38, 0, 0, Math.PI*2); ctx.fill()

        ctx.fillStyle='rgba(167,139,250,0.8)'
        ctx.font='bold 28px "Syne",sans-serif'
        ctx.textAlign='center'; ctx.textBaseline='middle'
        ctx.fillText('IA', 0, photoDrawY+photoDrawH*0.45)
        ctx.textBaseline='alphabetic'

        // Fade bottom
        const fadeH = photoDrawH * 0.3
        const fade  = ctx.createLinearGradient(0, photoDrawY+photoDrawH-fadeH, 0, photoDrawY+photoDrawH)
        fade.addColorStop(0,'transparent'); fade.addColorStop(1,'#0a0514')
        ctx.fillStyle=fade; ctx.fillRect(photoDrawX, photoDrawY+photoDrawH-fadeH, photoDrawW, fadeH)
        ctx.restore()
      }

      ctx.restore() // end photo shadow

      // ── LAYER 4: Card border & frame — on top of photo ──────
      // Re-drawing the border LAST makes photo look "in front of" card
      rr(-CW/2,-CH/2,CW,CH,14)
      const border = ctx.createLinearGradient(-CW/2,-CH/2,CW/2,CH/2)
      border.addColorStop(0, `rgba(167,139,250,${0.65+s.glow*0.35})`)
      border.addColorStop(0.5,`rgba(139,92,246,${0.35+s.glow*0.3})`)
      border.addColorStop(1, `rgba(99,102,241,${0.2+s.glow*0.2})`)
      ctx.strokeStyle=border; ctx.lineWidth=2; ctx.stroke()

      // Inner gold frame line
      rr(-CW/2+3,-CH/2+3,CW-6,CH-6,11)
      const goldBorder = ctx.createLinearGradient(-CW/2,-CH/2,CW/2,CH/2)
      goldBorder.addColorStop(0,  `rgba(251,191,36,${0.28+s.glow*0.2})`)
      goldBorder.addColorStop(0.5,`rgba(245,158,11,0.1)`)
      goldBorder.addColorStop(1,  `rgba(251,191,36,${0.28+s.glow*0.2})`)
      ctx.strokeStyle=goldBorder; ctx.lineWidth=0.8; ctx.stroke()

      // Header logo — also on top
      ctx.fillStyle='rgba(196,181,253,0.95)'
      ctx.font='bold 9px "Space Mono",monospace'
      ctx.textAlign='center'
      ctx.fillText('KARTU IDENTITAS', 0, -CH/2+16)

      // ── LAYER 5: Clip attachment ─────────────────────────────
      ctx.fillStyle='#0a0514'
      ctx.beginPath(); ctx.roundRect(-9,-CH/2-6,18,12,3); ctx.fill()
      ctx.strokeStyle='rgba(139,92,246,0.7)'; ctx.lineWidth=1; ctx.stroke()

      ctx.fillStyle='#4c1d95'
      ctx.beginPath(); ctx.arc(0,-CH/2-2,5,0,Math.PI*2); ctx.fill()
      ctx.strokeStyle='rgba(167,139,250,0.8)'; ctx.lineWidth=1.2; ctx.stroke()

      ctx.restore()
    }

    // ── Anchor ────────────────────────────────────────────────
    const drawAnchor = () => {
      const ax=W/2, ay=16
      ctx.save()
      ctx.fillStyle='#1e1b4b'
      ctx.beginPath(); ctx.roundRect(ax-50,ay-3,100,6,3); ctx.fill()
      ctx.strokeStyle='rgba(139,92,246,0.3)'; ctx.lineWidth=0.8; ctx.stroke()
      ctx.beginPath(); ctx.arc(ax,ay,7,0,Math.PI*2)
      ctx.fillStyle='#3b0764'; ctx.fill()
      ctx.strokeStyle='rgba(139,92,246,0.8)'; ctx.lineWidth=1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(ax,ay,3,0,Math.PI*2)
      ctx.fillStyle='#8b5cf6'; ctx.fill()
      ctx.restore()
    }

    // ── Render loop ───────────────────────────────────────────
    const render = () => {
      ctx.clearRect(0,0,W,H)
      simulate(); drawRope(); drawCard(); drawAnchor()
      animId = requestAnimationFrame(render)
    }
    render()

    const onResize = () => initPoints()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mousedown',  onMouseDown)
      canvas.removeEventListener('mouseup',    onMouseUp)
      canvas.removeEventListener('click',      onClick)
      canvas.removeEventListener('touchmove',  onTouchMove)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend',   onTouchEnd)
      window.removeEventListener('resize',     onResize)
    }
  }, [onCardClick])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}