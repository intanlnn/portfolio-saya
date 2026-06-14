import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const curr = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }
    window.addEventListener('mousemove', move)
    let raf
    const lerp = () => {
      curr.current.x += (pos.current.x - curr.current.x) * 0.12
      curr.current.y += (pos.current.y - curr.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${curr.current.x - 20}px, ${curr.current.y - 20}px)`
      }
      raf = requestAnimationFrame(lerp)
    }
    raf = requestAnimationFrame(lerp)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed', width: 40, height: 40, border: '1px solid rgba(139,92,246,0.6)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, top: 0, left: 0,
        backdropFilter: 'blur(2px)', transition: 'border-color 0.2s', mixBlendMode: 'difference'
      }} />
      <div ref={dotRef} style={{
        position: 'fixed', width: 8, height: 8, background: '#8b5cf6',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 9999, top: 0, left: 0,
        boxShadow: '0 0 10px #8b5cf6'
      }} />
    </>
  )
}
