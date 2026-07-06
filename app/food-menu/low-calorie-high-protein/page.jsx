'use client'
import { useState, useEffect, useRef } from 'react'
import ScrollReveal from '../../../components/ScrollReveal'
import Image from 'next/image'

const SLIDES = [
  {
    tag: '',
    title: '',
    titleEm: '',
    desc: '',
    pills: [''],
    img: '/assets/salad.jpeg',
  },
]

export default function LowCalPage() {
  const [cur, setCur] = useState(0)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [lb, setLb] = useState(null)
  const autoRef = useRef(null)

  const go = (n) => {
    clearTimeout(autoRef.current)
    const next = (n + SLIDES.length) % SLIDES.length
    setCur(next)
    autoRef.current = setTimeout(() => go(next + 1), 4500)
  }

  useEffect(() => {
    autoRef.current = setTimeout(() => go(1), 4500)
    return () => clearTimeout(autoRef.current)
  }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLb(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <ScrollReveal />

      {/* ── SLIDER + SIDE BANNERS LAYOUT ── */}
      <div className="mt-[100px] mb-10 flex gap-3 px-4" style={{ minHeight: '520px' }}>

        {/* ── MAIN SLIDER ── */}
        <div className="relative flex-1 overflow-hidden rounded-2xl" style={{ height: '520px' }}>
          {/* Fitness badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-[rgba(48,61,43,0.75)] backdrop-blur-sm border border-[rgba(255,255,255,0.15)] px-4 py-2 rounded-full">
            <span className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-[#d4a055]">💪 Fitness Menu</span>
          </div>

          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${cur * 100}%)`, width: `${SLIDES.length * 100}%` }}
          >
            {SLIDES.map((s, i) => (
              <div
                key={i}
                className="relative flex-shrink-0"
                style={{ width: `${100 / SLIDES.length}%`, height: '100%' }}
              >
                <Image
                  src={s.img}
                  alt={s.titleEm}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, rgba(5,15,5,0.82) 0%, rgba(5,15,5,0.35) 55%, transparent 100%)' }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 pb-12 pl-10 pr-8 max-w-[560px]">
                  <div
                    className="inline-flex items-center gap-1.5 px-3.5 py-[5px] rounded-full text-[0.68rem] font-bold tracking-[0.1em] uppercase mb-3.5"
                    style={{ background: 'rgba(212,160,85,0.2)', border: '1px solid rgba(212,160,85,0.4)', color: '#d4a055' }}
                  >
                    ✦ {s.tag}
                  </div>
                  <div
                    className="font-playfair font-bold leading-[1.1] text-white tracking-[-0.02em] mb-2.5"
                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
                  >
                    {s.title}<em className="italic" style={{ color: '#d4a055' }}>{s.titleEm}</em>
                  </div>
                  <div className="text-[0.9rem] leading-[1.7] max-w-[420px]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    {s.desc}
                  </div>
                  <div className="flex items-center gap-3 mt-5 flex-wrap">
                    {s.pills.map(p => (
                      <div
                        key={p}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium backdrop-blur-sm"
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => go(cur - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-[42px] h-[42px] flex items-center justify-center rounded-full text-white text-lg z-10 backdrop-blur-md transition-all hover:bg-[rgba(255,255,255,0.25)]"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >‹</button>
          <button
            onClick={() => go(cur + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-[42px] h-[42px] flex items-center justify-center rounded-full text-white text-lg z-10 backdrop-blur-md transition-all hover:bg-[rgba(255,255,255,0.25)]"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.25)' }}
          >›</button>

          {/* Counter */}
          <div className="absolute top-5 right-5 text-[0.72rem] font-semibold tracking-[0.1em] z-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span className="text-white">{cur + 1}</span> / {SLIDES.length}
          </div>

          {/* Dots */}
          <div className="absolute bottom-5 right-5 flex gap-2 z-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`sdot ${i === cur ? 'on' : ''}`}
              />
            ))}
          </div>
        </div>

      </div>{/* end flex row */}

      {/* ── STATS BAND ── */}
      <div className="bg-[var(--green)]  flex items-center justify-center gap-0 flex-wrap">
        {[['🔥','Avg 280 kcal','per meal'],['💪','35g+','avg protein'],['⚡','100%','chef crafted']].map(([icon, num, lbl], i, arr) => (
          <div key={i} className={`flex items-center gap-3 py-4 px-8 ${i < arr.length - 1 ? 'border-r border-[rgba(255,255,255,0.1)]' : ''}`}>
            <span className="text-xl">{icon}</span>
            <div>
              <div className="font-playfair text-[1.1rem] font-bold text-[var(--cream)] leading-none">{num}</div>
              <div className="text-[0.65rem] text-[rgba(251,241,231,0.5)] tracking-[0.08em] uppercase mt-0.5">{lbl}</div>
            </div>
          </div>
        ))}
      </div>

    </>
  )
}