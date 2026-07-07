'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  ['/#about', 'About Us'],
  ['/#menu', 'Menu'],
  ['/#subscription', 'Subscribe'],
  ['/#testimonials', 'Reviews'],
  ['/#faq', 'FAQs'],
  ['/bulk-order', 'Corporate / Party'],
]

const TAJ_FONT = { fontFamily: 'Inter, serif', letterSpacing: '0.16em', textTransform: 'uppercase' }

export default function Navbar({ variant = 'home' }) {
  const router = useRouter()
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* ── Navbar bar ──────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between bg-white border-b border-[var(--border)] transition-all duration-300 ${stuck ? 'nav-stuck' : ''}`}
        style={{ padding: stuck ? '12px 18px' : '16px 28px' }}
      >
        {/* Logo */}
        <Link href="/" onClick={close} className="flex items-center no-underline flex-shrink-0 z-[201]">
          {/* <Image src="/assets/logo.webp" alt="FoodGenie" width={52} height={52} /> */}
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--gold)', lineHeight: '1', marginRight: '10px', fontWeight: "bold", textTransform: 'uppercase' }}><div>Food</div><div>Genie</div></span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-9 list-none">
          {NAV_LINKS.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                onClick={close}
                style={TAJ_FONT}
                className="text-[0.82rem] font-semibold text-[var(--green)] no-underline uppercase tracking-[0.16em] transition-all duration-300 hover:text-[var(--gold)] relative py-1 after:content-[''] after:absolute after:w-0 after:h-[1.5px] after:bottom-0 after:left-0 after:bg-[var(--gold)] hover:after:w-full after:transition-all after:duration-300"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: LOGIN / REGISTER + hamburger */}
        <div className="flex items-center gap-6">
          {/* Desktop */}
          <Link
            href="/same-day-delivery"
            style={{ ...TAJ_FONT, textAlign: 'center', lineHeight: 1.2 }}
            className="hidden md:flex flex-col items-center same-day-btn px-4 py-2"
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>Same Day Delivery</span>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '700' }}>09:00 AM → 11:00 PM</span>
          </Link>

          {/* Mobile */}
          <Link
            href="/same-day-delivery"
            onClick={close}
            style={{ fontFamily: 'Cormorant Garamond, serif', textAlign: 'center', lineHeight: 1.2 }}
            className="md:hidden flex flex-col items-center same-day-btn px-3 py-1 text-[var(--gold)] "
          >
            <span style={{ fontSize: '3.2vw', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textShadow: "1px 1px 1px #c7c7c7ff" }}>Same Day Delivery</span>
            <span style={{ fontSize: '.8rem', letterSpacing: '0.08em', marginTop: 1, fontWeight: '700' }}>09:00 AM → 11:00 PM</span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden flex flex-col justify-center items-center bg-transparent border-none cursor-pointer z-[201] p-1 gap-[7px]"
            style={{ width: 40, height: 40 }}
          >
            <span style={{
              display: 'block', width: 34, height: 1.5,
              background: 'var(--gold)', borderRadius: 0,
              transition: 'transform 0.38s ease, opacity 0.28s ease',
              transform: open ? 'translateY(8.5px) rotate(45deg)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 34, height: 1.5,
              background: 'var(--gold)', borderRadius: 0,
              transition: 'opacity 0.22s ease, transform 0.22s ease',
              opacity: open ? 0 : 1,
              transform: open ? 'scaleX(0)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 34, height: 1.5,
              background: 'var(--gold)', borderRadius: 0,
              transition: 'transform 0.38s ease, opacity 0.28s ease',
              transform: open ? 'translateY(-8.5px) rotate(-45deg)' : 'none',
            }} />
          </button>
        </div>
      </nav>

      {/* ── Fullscreen dropdown — white bg, left-aligned gold links ─────── */}
      <div
        className="fixed inset-0 z-[199] flex flex-col bg-white overflow-y-auto"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.42s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Spacer = navbar height */}
        <div style={{ height: 84, flexShrink: 0, borderBottom: '1px solid var(--border)' }} />

        {/* Nav links — left aligned, Taj-size font */}
        <ul className="list-none flex-1 px-10 py-6">
          {NAV_LINKS.map(([href, label], i) => (
            <li
              key={href}
              style={{
                borderBottom: '1px solid var(--border)',
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`,
              }}
            >
              <a
                href={href}
                onClick={close}
                style={{
                  fontFamily: 'Inter, serif',
                  letterSpacing: '0.18em',
                  fontSize: '.9rem',
                }}
                className="block py-3 font-semibold text-[var(--green)] no-underline uppercase transition-colors duration-300 hover:text-[var(--gold)]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Bottom CTA */}
        <div
          className="px-10 py-8 border-t border-[var(--border)] bg-[var(--gold)] "
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.5s ease ${NAV_LINKS.length * 60 + 60}ms, transform 0.5s ease ${NAV_LINKS.length * 60 + 60}ms`,
          }}
        >
          <div className='flex justify-center '>
            <a
              href="tel:+919958093268"
              onClick={close}
              style={{
                letterSpacing: '0.18em',
                borderRadius: 0,
                justifySelf: 'center',
              }}
              className="inline-flex items-center border border-white text-white text-[0.8rem] font-medium uppercase px-3 py-[13px] no-underline hover:bg-white hover:text-black hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              Call Now — +91 99580 93268
            </a>
          </div>
          <p
            className="text-[0.8rem] mt-4 leading-relaxed text-white text-center"
            style={{ letterSpacing: '0.08em' }}
          >
            Sector 57, Gurugram
          </p>
        </div>
      </div>
    </>
  )
}
