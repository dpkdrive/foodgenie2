'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import BookingModal from '../components/BookingModal'

export const PLAN_CONFIG = {
  gstRate: 0.05,
  prices: {
    veg:    { 3: 249, 7: 239, 28: 229 },
    egg:    { 3: 249, 7: 239, 28: 229 },
    nonveg: { 3: 259, 7: 249, 28: 239 },
  },
  mealsPerDay: 3,
}

const CARD_WIDTH = 420
const CARD_GAP = 24

function Plan({ diet, setDiet }: { diet: string; setDiet: (d: string) => void }) {
  const [modal, setModal] = useState({ open: false, plan: '7', label: '7 Days Plan' })
  const [apiPrices, setApiPrices] = useState<any>(null)
  const [active, setActive] = useState(1)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [paused, setPaused] = useState(false)
  const dragStart = useRef<number | null>(null)

  useEffect(() => {
    fetch('/api/plans')
      .then(r => r.json())
      .then(data => { if (data?.prices) setApiPrices(data.prices) })
      .catch(() => {})
  }, [])

  const activePrices = apiPrices ?? PLAN_CONFIG.prices
  const gstRate = PLAN_CONFIG.gstRate

  function getTotal(d: string, days: number) {
    const perMeal = activePrices[d]?.[days] ?? (PLAN_CONFIG.prices as any)[d][days]
    const base = perMeal * PLAN_CONFIG.mealsPerDay * days
    return { base, gst: base * gstRate, total: base + base * gstRate, perMeal }
  }

  const plans = [
    {
      key: '3', days: 3, label: '3 Days', dur: '3 Days',
      note: 'Trial-friendly plan', featured: false,
      feats: ['Fresh daily preparation', 'Trial-friendly plan'],
      btn: 'Book 3-Day Plan',
    },
    {
      key: '7', days: 7, label: '7 Days', dur: '7 Days',
      note: 'Most Popular', featured: true,
      feats: ['7 days meal plan', 'Nutritionist reviewed', 'Priority support'],
      btn: 'Get Weekly Plan',
    },
    {
      key: '28', days: 28, label: '28 Days', dur: '28 Days',
      note: 'Best value plan', featured: false,
      feats: ['Full month subscription', 'Chef consultation', 'Diet planning included', 'Dedicated account manager'],
      btn: 'Get Monthly Plan',
    },
    {
      key: 'custom', days: 0, label: 'Custom', dur: 'Your Dates',
      note: 'Pick your own dates', featured: false,
      feats: ['Choose start date', 'Flexible duration', 'Personalised schedule'],
      btn: 'Choose My Dates',
    },
    {
      key: 'bespoke', days: 0, label: 'Bespoke', dur: 'Premium',
      note: 'Bride to be specialist plan', featured: false,
      feats: ['4 meals per day', 'Breakfast, Lunch, Snacks & Dinner', 'Available in 28 & 84 days', 'Personalised diet program'],
      btn: 'Book Bespoke Plan',
      fromPrice: '₹39,200',
    },
  ]

  const total = plans.length

  const goTo = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(total - 1, i)))
    setDragX(0)
  }, [total])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setActive(prev => (prev + 1) % total), 3000)
    return () => clearInterval(t)
  }, [paused, total])

  const onMouseDown = (e: React.MouseEvent) => { dragStart.current = e.clientX; setDragging(true) }
  const onMouseMove = (e: React.MouseEvent) => { if (!dragging || dragStart.current === null) return; setDragX(e.clientX - dragStart.current) }
  const onMouseUp = () => {
    if (!dragging) return
    setDragging(false)
    if (dragX < -60 && active < total - 1) goTo(active + 1)
    else if (dragX > 60 && active > 0) goTo(active - 1)
    else setDragX(0)
    dragStart.current = null
  }
  const onTouchStart = (e: React.TouchEvent) => { dragStart.current = e.touches[0].clientX; setDragging(true) }
  const onTouchMove = (e: React.TouchEvent) => { if (dragStart.current === null) return; setDragX(e.touches[0].clientX - dragStart.current) }
  const onTouchEnd = () => {
    setDragging(false)
    if (dragX < -60 && active < total - 1) goTo(active + 1)
    else if (dragX > 60 && active > 0) goTo(active - 1)
    else setDragX(0)
    dragStart.current = null
  }

  const offset = `calc(50% - ${CARD_WIDTH / 2}px - ${active * (CARD_WIDTH + CARD_GAP)}px + ${dragX}px)`

  return (
    <section id="subscription" className="overflow-hidden" style={{ padding: '96px 0', background: '#f0f0f0' }}>

      {/* Heading */}
      <div className="rv text-center mb-16 px-6">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(201,169,110,0.45)' }} />
          <span className="text-[0.72rem] uppercase tracking-[0.26em] font-medium"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}>
            Meal Plans
          </span>
          <span className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(201,169,110,0.45)' }} />
        </div>
        <div className="flex items-center justify-center gap-5 mb-4">
          <span className="h-px w-14 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
          <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-normal uppercase leading-[1.2] tracking-[0.06em]"
            style={{ color: 'var(--green)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}>
            Choose Your Genie Plan
          </h2>
          <span className="h-px w-14 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
        </div>
        <p className="text-[1rem] leading-[1.8] max-w-[480px] mx-auto" style={{ color: 'var(--text-muted)' }}>
          Subscribe as per your preference
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative select-none"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { onMouseUp(); setPaused(false) }}
        onMouseEnter={() => setPaused(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{
            gap: CARD_GAP,
            transform: `translateX(${offset})`,
            transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.77,0,0.175,1)',
            willChange: 'transform',
          }}
        >
          {plans.map((p, i) => {
            const isActive  = i === active
            const isCustom  = p.key === 'custom'
            const isBespoke = p.key === 'bespoke'
            const { total: totalAmt, perMeal } = (isCustom || isBespoke) ? { total: 0, perMeal: 0 } : getTotal(diet, p.days)

            return (
              <div
                key={p.key}
                className="flex-shrink-0 flex flex-col relative"
                style={{
                  width: CARD_WIDTH,
                  background: p.featured
                    ? 'linear-gradient(160deg, #0a0703 0%, #1c1009 55%, #2e1d0e 100%)'
                    : '#fff',
                  boxShadow: isActive
                    ? p.featured
                      ? '0 12px 60px rgba(201,169,110,0.22), 0 4px 24px rgba(0,0,0,0.4)'
                      : '0 8px 48px rgba(28,16,9,0.13)'
                    : '0 2px 16px rgba(28,16,9,0.06)',
                  padding: '48px 40px 40px',
                  opacity: isActive ? 1 : 0.55,
                  transform: isActive ? 'scale(1)' : 'scale(0.97)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
                  pointerEvents: isActive ? 'auto' : 'none',
                  outline: p.featured ? '1px solid rgba(201,169,110,0.25)' : 'none',
                }}
              >
                {isBespoke ? (
                  /* ── Bespoke card: only big title + button ── */
                  <>
                    <div className="flex-1 flex items-center justify-center">
                      <h3 style={{
                        fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif',
                        fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                        fontWeight: 400,
                        lineHeight: 1.2,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: 'var(--green)',
                        textAlign: 'center',
                        margin: 0,
                      }}>
                        Bride<br />to Be
                      </h3>
                    </div>
                    <button
                      onClick={() => setModal({ open: true, plan: p.key, label: p.label })}
                      className="w-full py-[15px] text-[0.72rem] uppercase tracking-[0.2em] font-medium cursor-pointer border-none"
                      style={{
                        background: 'var(--green)',
                        color: '#fff',
                        fontFamily: 'var(--font-cinzel), serif',
                        letterSpacing: '0.2em',
                      }}
                    >
                      {p.btn}
                    </button>
                  </>
                ) : (
                  /* ── Standard card ── */
                  <>
                    {/* Most Popular badge */}
                    {p.featured && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
                        <div className="absolute top-[3px] left-1/2 -translate-x-1/2 text-[0.55rem] font-medium uppercase tracking-[0.22em] px-6 py-[5px]"
                          style={{ background: 'var(--gold)', color: '#1c1009', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.2em' }}>
                          Most Popular
                        </div>
                      </>
                    )}

                    {/* Duration label */}
                    <span className="text-[0.72rem] uppercase tracking-[0.26em] font-medium mb-3 block"
                      style={{ color: 'var(--gold)', fontFamily: 'var(--font-cinzel), serif' }}>
                      {p.dur}
                    </span>

                    {/* Gold bar */}
                    <span className="block w-8 h-px mb-5" style={{ background: 'var(--gold)', opacity: p.featured ? 0.7 : 1 }} />

                    {/* Title */}
                    <h3 className="text-[clamp(1.2rem,2vw,1.5rem)] font-normal uppercase tracking-[0.06em] mb-2"
                      style={{ color: p.featured ? '#fff' : 'var(--green)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}>
                      {p.label}
                    </h3>

                    {/* Note */}
                    <span className="text-[0.75rem] uppercase tracking-[0.14em] font-medium mb-6 block"
                      style={{ color: p.featured ? 'rgba(201,169,110,0.65)' : 'var(--gold)', fontFamily: 'var(--font-jost), sans-serif' }}>
                      {p.note}
                    </span>

                    {/* Divider */}
                    <span className="block h-px mb-6" style={{ background: p.featured ? 'rgba(201,169,110,0.15)' : 'var(--border)' }} />

                    {/* Features */}
                    <ul className="list-none flex flex-col gap-3 mb-8 flex-1">
                      {p.feats.map(f => (
                        <li key={f} className="flex items-center gap-3 text-[0.88rem]"
                          style={{ color: p.featured ? 'rgba(255,255,255,0.75)' : 'rgb(90,85,78)' }}>
                          <span className="flex-shrink-0 text-[0.65rem]" style={{ color: 'var(--gold)' }}>✦</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => setModal({ open: true, plan: p.key, label: p.label })}
                      className="w-full py-[15px] text-[0.72rem] uppercase tracking-[0.2em] font-medium cursor-pointer border-none"
                      style={{
                        background: p.featured
                          ? 'linear-gradient(135deg, var(--gold-light), var(--gold))'
                          : 'var(--green)',
                        color: p.featured ? '#1c1009' : '#fff',
                        fontFamily: 'var(--font-cinzel), serif',
                        letterSpacing: '0.2em',
                      }}
                    >
                      {p.btn}
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-3 mt-10">
        {plans.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="border-none cursor-pointer p-0 transition-all duration-300"
            style={{ width: i === active ? 28 : 8, height: 2, background: i === active ? 'var(--gold)' : 'rgba(201,169,110,0.35)' }} />
        ))}
      </div>

      <BookingModal
        isOpen={modal.open}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        planKey={modal.plan}
        planLabel={modal.label}
        currentDiet={diet}
        apiPrices={apiPrices}
      />
    </section>
  )
}

export default Plan
