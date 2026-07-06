'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface Testimonial {
  _id:      string
  text:     string
  name:     string
  role:     string
  duration: string
  rating:   number
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    _id: 'default1',
    name: 'Ananya Sharma',
    role: 'Nutritionist & Wellness Coach',
    text: 'Food Genie is a game-changer! The meals are fresh, extremely nutritious, and portion-controlled perfectly. The culinary experience is outstanding, bringing chef-crafted quality to daily meals.',
    duration: '6 Months Subscriber',
    rating: 5
  },
  {
    _id: 'default2',
    name: 'Vikram Seth',
    role: 'Tech Lead at Google',
    text: 'Outstanding service and taste. As a busy professional, I struggled with meal prep. Food Genie completely solved it with balanced, delicious food delivered hot and fresh everyday.',
    duration: '3 Months Subscriber',
    rating: 5
  },
  {
    _id: 'default3',
    name: 'Meera Rajput',
    role: 'Homemaker & Yoga Practitioner',
    text: 'Highly recommended for families! Every dish has clean, fresh preparations and high-quality ingredients. It saves so much kitchen hassle while keeping my family healthy.',
    duration: '1 Year Subscriber',
    rating: 5
  }
]

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [active, setActive]   = useState(0)
  const [visible, setVisible] = useState(true)
  const transitioning         = useRef(false)
  const autoRef               = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(res.data)
        } else {
          setTestimonials(DEFAULT_TESTIMONIALS)
        }
      })
      .catch(() => {
        setTestimonials(DEFAULT_TESTIMONIALS)
      })
  }, [])

  const total = testimonials.length

  const goTo = useCallback((idx: number) => {
    if (transitioning.current || total === 0) return
    transitioning.current = true
    setVisible(false)
    setTimeout(() => {
      setActive(((idx % total) + total) % total)
      setVisible(true)
      transitioning.current = false
    }, 420)
  }, [total])

  const prev = () => { if (autoRef.current) clearInterval(autoRef.current); goTo(active - 1) }
  const next = () => { if (autoRef.current) clearInterval(autoRef.current); goTo(active + 1) }

  useEffect(() => {
    if (total === 0) return
    autoRef.current = setInterval(() => goTo(active + 1), 5000)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [active, goTo, total])

  if (total === 0) return null

  const t = testimonials[active]

  return (
    <section
      id="testimonials"
      style={{
        background:  '#fff',
        padding:     'clamp(72px,10vw,120px) clamp(24px,8vw,96px)',
        position:    'relative',
        overflow:    'hidden',
      }}
    >
      {/* Corner ornaments */}
      <span style={{ position:'absolute', top:36, left:36, width:48, height:48,
        borderTop:'1px solid rgba(201,169,110,0.35)', borderLeft:'1px solid rgba(201,169,110,0.35)' }} />
      <span style={{ position:'absolute', top:36, right:36, width:48, height:48,
        borderTop:'1px solid rgba(201,169,110,0.35)', borderRight:'1px solid rgba(201,169,110,0.35)' }} />
      <span style={{ position:'absolute', bottom:36, left:36, width:48, height:48,
        borderBottom:'1px solid rgba(201,169,110,0.35)', borderLeft:'1px solid rgba(201,169,110,0.35)' }} />
      <span style={{ position:'absolute', bottom:36, right:36, width:48, height:48,
        borderBottom:'1px solid rgba(201,169,110,0.35)', borderRight:'1px solid rgba(201,169,110,0.35)' }} />

      {/* Section label */}
      <div style={{ textAlign:'center', marginBottom:'clamp(40px,6vw,64px)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:18 }}>
          <span style={{ height:1, width:56, background:'rgba(201,169,110,0.4)', flexShrink:0 }} />
          <span style={{
            fontFamily:    'var(--font-cinzel), serif',
            fontSize:      '0.68rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
          }}>
            Guest Voices
          </span>
          <span style={{ height:1, width:56, background:'rgba(201,169,110,0.4)', flexShrink:0 }} />
        </div>

        <h2 style={{
          fontFamily:    'var(--font-cinzel), serif',
          fontSize:      'clamp(1.6rem,3.5vw,2.8rem)',
          fontWeight:    400,
          color:         'var(--green)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          lineHeight:    1.2,
          margin:        0,
        }}>
          Voices of Delight
        </h2>
      </div>

      {/* Testimonial card */}
      <div
        style={{
          maxWidth:  760,
          margin:    '0 auto',
          textAlign: 'center',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition:'opacity 0.42s ease, transform 0.42s ease',
        }}
      >
        <div style={{
          fontFamily:    'var(--font-cormorant), Georgia, serif',
          fontSize:      'clamp(80px,14vw,130px)',
          lineHeight:    0.6,
          color:         'rgba(201,169,110,0.22)',
          marginBottom:  24,
          userSelect:    'none',
        }}>
          &ldquo;
        </div>

        <p style={{
          fontFamily:    'var(--font-cormorant), Georgia, serif',
          fontSize:      'clamp(1.1rem,2.4vw,1.5rem)',
          fontStyle:     'italic',
          fontWeight:    300,
          color:         'rgba(40,35,25,0.75)',
          lineHeight:    1.85,
          letterSpacing: '0.02em',
          marginBottom:  'clamp(28px,4vw,44px)',
        }}>
          {t.text}
        </p>

        {/* Stars */}
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:28 }}>
          {[1,2,3,4,5].map(s => (
            <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.545 5.09H13L9.545 7.636L10.91 12L7 9.272L3.09 12L4.455 7.636L1 5.09H5.455L7 1Z"
                fill={s <= (t.rating ?? 5) ? 'var(--gold)' : 'rgba(201,169,110,0.2)'} />
            </svg>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:28 }}>
          <span style={{ height:'1px', width:40, background:'rgba(201,169,110,0.4)' }} />
          <span style={{ width:5, height:5, background:'rgba(201,169,110,0.55)', transform:'rotate(45deg)' }} />
          <span style={{ height:'1px', width:40, background:'rgba(201,169,110,0.4)' }} />
        </div>

        {/* Avatar + Name */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{
            width:           48,
            height:          48,
            borderRadius:    '50%',
            border:          '1px solid rgba(201,169,110,0.5)',
            background:      'rgba(201,169,110,0.12)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            fontFamily:      'var(--font-cinzel), serif',
            fontSize:        '1.1rem',
            color:           'var(--gold)',
            letterSpacing:   '0.08em',
          }}>
            {t.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p style={{
              fontFamily:    'var(--font-cinzel), serif',
              fontSize:      '0.78rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'var(--green)',
              marginBottom:  5,
            }}>
              {t.name}
            </p>
            <p style={{
              fontFamily:    'var(--font-cormorant), serif',
              fontSize:      '0.88rem',
              fontStyle:     'italic',
              letterSpacing: '0.06em',
              color:         'rgba(40,35,25,0.5)',
            }}>
              {t.role}
            </p>
          </div>

          {t.duration && (
            <span style={{
              marginTop:     4,
              display:       'inline-block',
              padding:       '4px 14px',
              border:        '1px solid rgba(201,169,110,0.35)',
              fontFamily:    'var(--font-jost), sans-serif',
              fontSize:      '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'var(--gold)',
            }}>
              {t.duration}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        gap:            32,
        marginTop:      'clamp(40px,6vw,64px)',
      }}>
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            width:          44,
            height:         44,
            border:         '1px solid rgba(201,169,110,0.45)',
            background:     'transparent',
            color:          'var(--gold)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            transition:     'background 0.22s, color 0.22s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,169,110,0.18)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                width:      i === active ? 32 : 8,
                height:     2,
                background: i === active ? 'var(--gold)' : 'rgba(201,169,110,0.3)',
                border:     'none',
                padding:    0,
                cursor:     'pointer',
                transition: 'width 0.35s ease, background 0.35s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next"
          style={{
            width:          44,
            height:         44,
            border:         '1px solid rgba(201,169,110,0.45)',
            background:     'transparent',
            color:          'var(--gold)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            transition:     'background 0.22s, color 0.22s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,169,110,0.18)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
