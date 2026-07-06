'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const FALLBACK = 'https://blog.lisi.menu/wp-content/uploads/2023/08/Food-Banner.jpg'

export default function BannerSliderModal({ open, onClose, images = [], title = '' }) {
  const slides = images.length > 0 ? images : [FALLBACK]
  const total  = slides.length

  const [active,   setActive]   = useState(0)
  const [dragX,    setDragX]    = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)

  const goTo = useCallback((i) => {
    setActive((i + total) % total)
    setDragX(0)
  }, [total])

  /* Reset slide on open */
  useEffect(() => { if (open) setActive(0) }, [open])

  /* Auto-slide only when multiple images */
  useEffect(() => {
    if (!open || total <= 1) return
    const t = setInterval(() => setActive(prev => (prev + 1) % total), 3500)
    return () => clearInterval(t)
  }, [open, total])

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* Keyboard */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowRight')  goTo(active + 1)
      if (e.key === 'ArrowLeft')   goTo(active - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, active, onClose, goTo])

  /* Touch */
  const onTouchStart = (e) => { dragStart.current = e.touches[0].clientX; setDragging(true) }
  const onTouchMove  = (e) => { if (dragStart.current === null) return; setDragX(e.touches[0].clientX - dragStart.current) }
  const onTouchEnd   = () => {
    setDragging(false)
    if (dragX < -60) goTo(active + 1)
    else if (dragX > 60) goTo(active - 1)
    setDragX(0); dragStart.current = null
  }

  /* Mouse */
  const onMouseDown = (e) => { dragStart.current = e.clientX; setDragging(true) }
  const onMouseMove = (e) => { if (!dragging) return; setDragX(e.clientX - dragStart.current) }
  const onMouseUp   = () => {
    if (!dragging) return
    setDragging(false)
    if (dragX < -60) goTo(active + 1)
    else if (dragX > 60) goTo(active - 1)
    setDragX(0); dragStart.current = null
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(10,8,5,0.78)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.38s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 401,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
        pointerEvents: open ? 'all' : 'none',
      }}>
        <div style={{
          position: 'relative', width: '100%', maxWidth: 820,
          background: '#fff', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
          transition: 'opacity 0.42s cubic-bezier(0.4,0,0.2,1), transform 0.42s cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* Close */}
          <button onClick={onClose} aria-label="Close" style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            width: 36, height: 36, background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(201,169,110,0.4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--gold)', fontSize: 18,
          }}>✕</button>

          {/* Title bar */}
          {title && (
            <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: '0.72rem', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'var(--gold)', margin: 0,
              }}>{title}</p>
            </div>
          )}

          {/* Slider track */}
          <div
            style={{ position: 'relative', width: '100%', overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove}
            onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          >
            <div style={{
              display: 'flex',
              transition: dragging ? 'none' : 'transform 0.55s cubic-bezier(0.77,0,0.175,1)',
              transform: `translateX(calc(-${active * 100}% + ${dragX}px))`,
              willChange: 'transform',
            }}>
              {slides.map((src, i) => (
                <div key={i} style={{ flexShrink: 0, width: '100%', aspectRatio: '16/7', overflow: 'hidden', position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${title} ${i + 1}`} draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  {/* Slide counter badge */}
                  {total > 1 && (
                    <span style={{
                      position: 'absolute', bottom: 10, right: 12,
                      background: 'rgba(0,0,0,0.5)', color: '#fff',
                      fontSize: '0.68rem', padding: '3px 8px', letterSpacing: '0.08em',
                    }}>{i + 1} / {total}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div style={{ padding: '14px 20px 0', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.92rem' }}>
              <span style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--gold)', marginRight: 8,
              }}>Note —</span>
              This is only a sample menu. Your menu will be customized by our Chef.
            </p>
          </div>

          {/* Bottom: dots + arrows */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: '#fff',
            borderTop: '1px solid rgba(201,169,110,0.2)',
          }}>
            {/* Dots */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {slides.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{
                  width: i === active ? 28 : 8, height: 2,
                  background: i === active ? 'var(--gold)' : 'rgba(201,169,110,0.35)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }} />
              ))}
            </div>

            {/* Arrows — only when multiple slides */}
            {total > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ label: '←', dir: -1 }, { label: '→', dir: 1 }].map(({ label, dir }) => (
                  <button key={dir} onClick={() => goTo(active + dir)}
                    aria-label={dir === -1 ? 'Previous' : 'Next'}
                    style={{
                      width: 36, height: 36, border: '1px solid rgba(201,169,110,0.45)',
                      background: 'transparent', color: 'var(--gold)',
                      fontSize: 16, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.22s, color 0.22s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--gold)' }}
                  >{label}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
