'use client'

import Link from 'next/link'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import BannerSliderModal from './BannerSliderModal'

const MENU_ITEMS = [
  {
    num: '01',
    title: 'Balanced Food',
    desc: 'Every plate achieves the perfect harmony of carbohydrates, proteins, and healthy fats — designed to fuel your day with sustained energy and joy.',
    badge: 'Everyday Nourishment',
    href: '/food-menu/balanced-food',
    bannerKey: 'balancedFood',
    tags: [''],
  },
  {
    num: '02',
    title: 'Low Calorie & High Protein',
    desc: 'Scientifically balanced meals for those on a fitness journey. High-quality protein sources, minimal calories, maximum taste — because eating healthy should never mean eating boring.',
    badge: 'Fitness Focused',
    href: '/food-menu/low-calorie-high-protein',
    bannerKey: 'lowCalories',
    tags: [''],
  },
  {
    num: '03',
    title: 'Bespoke Package',
    desc: "Crafted by a dedicated chef for your specific dietary needs. Customize your meals for 10 days while trusting our chef's expertise to delight you with the remaining days.",
    badge: "Chef's Specialty",
    href: '/food-menu/low-calorie-high-protein',
    bannerKey: 'bespokePackage',
    tags: ['Athletes', 'Diabetes', 'Arthritis', 'Vegan', 'Lactose Intolerance', 'Gluten-Free', 'Bride to be'],
  },
]

const CARD_WIDTH = 420
const CARD_GAP = 24

export default function Menu() {
  const [active, setActive] = useState(1)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [paused, setPaused] = useState(false)
  const [bannerOpen, setBannerOpen] = useState(false)
  const [bannerItem, setBannerItem] = useState(null) // { images, title }
  const [packageBanners, setPackageBanners] = useState({})
  const dragStart = useRef(null)
  const total = MENU_ITEMS.length

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(({ data }) => {
        if (!data?.banners) return
        const map = {}
        Object.entries(data.banners).forEach(([key, list]) => {
          if (Array.isArray(list) && list.length > 0)
            map[key] = list.map(b => b.url ?? b)
        })
        setPackageBanners(map)
      })
      .catch(() => {})
  }, [])

  const goTo = useCallback((i) => {
    setActive(Math.max(0, Math.min(total - 1, i)))
    setDragX(0)
  }, [total])

  // Auto slide
  React.useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setActive(prev => (prev + 1) % total)
    }, 3000)
    return () => clearInterval(t)
  }, [paused, total])

  // Mouse drag
  const onMouseDown = (e) => {
    dragStart.current = e.clientX
    setDragging(true)
  }
  const onMouseMove = (e) => {
    if (!dragging || dragStart.current === null) return
    setDragX(e.clientX - dragStart.current)
  }
  const onMouseUp = () => {
    if (!dragging) return
    setDragging(false)
    if (dragX < -60 && active < total - 1) goTo(active + 1)
    else if (dragX > 60 && active > 0) goTo(active - 1)
    else setDragX(0)
    dragStart.current = null
  }

  // Touch drag
  const onTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX
    setDragging(true)
  }
  const onTouchMove = (e) => {
    if (dragStart.current === null) return
    setDragX(e.touches[0].clientX - dragStart.current)
  }
  const onTouchEnd = () => {
    setDragging(false)
    if (dragX < -60 && active < total - 1) goTo(active + 1)
    else if (dragX > 60 && active > 0) goTo(active - 1)
    else setDragX(0)
    dragStart.current = null
  }

  // Offset: center active card in viewport
  const offset = `calc(50% - ${CARD_WIDTH / 2}px - ${active * (CARD_WIDTH + CARD_GAP)}px + ${dragX}px)`

  return (
    <>
    <BannerSliderModal
      open={bannerOpen}
      onClose={() => setBannerOpen(false)}
      images={bannerItem?.images ?? []}
      title={bannerItem?.title ?? ''}
    />
    <section id="menu" className="overflow-hidden padding-top" style={{ background: '#f0f0f0' }}>

      {/* Heading */}
      <div className="rv text-center mb-16 px-6 ">
        <div className="flex items-center justify-center gap-4 mb-5">
          <span className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(201,169,110,0.45)' }} />
          <span
            className="text-[0.72rem] uppercase tracking-[0.26em] font-medium"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
          >
            What We Serve
          </span>
          <span className="h-px flex-1 max-w-[80px]" style={{ background: 'rgba(201,169,110,0.45)' }} />
        </div>

        <div className="flex items-center justify-center gap-5 mb-4">
          <span className="h-px w-14 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
          <h2
            className="text-[clamp(1.8rem,4vw,3.2rem)] font-normal uppercase leading-[1.2] tracking-[0.06em]"
            style={{ color: 'var(--green)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
          >
            Our Signature Food Menu
          </h2>
          <span className="h-px w-14 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
        </div>

        <p className="text-[1rem] leading-[1.8] max-w-[480px] mx-auto" style={{ color: 'var(--text-muted)' }}>
          Three thoughtfully crafted categories designed around your health goals and taste preferences.
        </p>
      </div>

      {/* Carousel viewport */}
      <div
        className="relative select-none"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={(e) => { onMouseUp(e); setPaused(false) }}
        onMouseEnter={() => setPaused(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Track */}
        <div
          className="flex"
          style={{
            gap: CARD_GAP,
            transform: `translateX(${offset})`,
            transition: dragging ? 'none' : 'transform 0.5s cubic-bezier(0.77,0,0.175,1)',
            willChange: 'transform',
          }}
        >
          {MENU_ITEMS.map((item, i) => {
            const isActive = i === active
            return (
              <div
                key={item.num}
                className="flex-shrink-0 bg-white flex flex-col"
                style={{
                  width: CARD_WIDTH,
                  padding: '48px 40px 40px',
                  boxShadow: isActive ? '0 8px 48px rgba(28,16,9,0.13)' : '0 2px 16px rgba(28,16,9,0.06)',
                  opacity: isActive ? 1 : 0.55,
                  transform: isActive ? 'scale(1)' : 'scale(0.97)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Number */}
                <div className="mb-6">
                  <span
                    className="text-[4rem] font-normal leading-none"
                    style={{ color: 'rgba(201,169,110,0.25)', fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {item.num}
                  </span>
                </div>

                {/* Gold bar */}
                <span className="block w-8 h-px mb-5" style={{ background: 'var(--gold)' }} />

                {/* Title */}
                <h3
                  className="text-[clamp(1.1rem,1.8vw,1.45rem)] font-normal uppercase tracking-[0.06em] mb-3"
                  style={{ color: 'var(--green)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
                >
                  {item.title}
                </h3>

                {/* Badge */}
                <span
                  className="inline-block text-[0.78rem] uppercase tracking-[0.18em] font-medium mb-5"
                  style={{
                    color: 'var(--gold)',
                    fontFamily: 'var(--font-jost), sans-serif',
                  }}
                >
                  {item.badge}
                </span>

                {/* Desc */}
                <p className="text-[0.97rem] leading-[1.85] mb-6 flex-1" style={{ color: 'rgb(90,85,78)' }}>
                  {item.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.62rem] uppercase tracking-[0.12em] font-medium px-3 py-1"
                      style={{
                        border: '1px solid var(--border)',
                        color: 'var(--green-light)',
                        fontFamily: 'var(--font-jost), sans-serif',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    const imgs = packageBanners[item.bannerKey] ?? []
                    setBannerItem({ images: imgs, title: item.title })
                    setBannerOpen(true)
                  }}
                  className="inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] font-medium"
                  style={{
                    color: 'var(--gold)',
                    fontFamily: 'var(--font-cinzel), serif',
                    borderBottom: '1px solid rgba(201,169,110,0.4)',
                    paddingBottom: '2px',
                    width: 'fit-content',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(201,169,110,0.4)',
                    cursor: 'pointer',
                    padding: '0 0 2px 0',
                  }}
                >
                  View Menu Card <span style={{ letterSpacing: 0 }}>→</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-3 mt-10">
        {MENU_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="border-none cursor-pointer p-0 transition-all duration-300"
            style={{
              width: i === active ? 28 : 8,
              height: 2,
              background: i === active ? 'var(--gold)' : 'rgba(201,169,110,0.35)',
            }}
          />
        ))}
      </div>

    </section>
    </>
  )
}
