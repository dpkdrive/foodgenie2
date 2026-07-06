import React from 'react'

function fmt(n: number) { return '₹' + n.toLocaleString('en-IN') }

const HERO_PRICE = { veg: 199, nonveg: 224, egg: 210 }

function Hero({ diet }: { diet: string }) {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center text-center relative bg-white overflow-hidden"
      style={{ padding: '140px 24px 80px' }}
    >
      {/* Subtle radial bg */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(201,169,110,0.06) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-[720px] md:max-w-[1000px] mx-auto w-full">

        {/* Badge */}
        <p
          className="text-[1rem] font-medium text-[var(--gold)] uppercase tracking-[0.28em] mb-8 animate-fade-up-1"
          style={{}}
        >
          Premium Culinary Experience
        </p>

        {/* Single heading — with left/right separator bars */}
        <div className="flex items-center justify-center gap-2 mb-10 animate-fade-up-2">
          <span className="w-10 h-px bg-[var(--green)] flex-shrink-0" />
          <h1
            className="font-cinzel text-[clamp(2rem,4.5vw,3.6rem)] font-normal uppercase leading-[1.22] text-[var(--green)] tracking-[0.06em]"
            style={{ fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
          >
            Food Genie is where you experience cooking with Verve &amp; Imagination
          </h1>
          <span className="w-10 h-px bg-[var(--green)] flex-shrink-0" />
        </div>

        {/* Body — bigger font */}
        <p
          className="text-[1.05rem] max-w-[520px] mx-auto leading-[1.9] mb-10 animate-fade-up-3"
          style={{}}
        >
          Food Genie is a daily, weekly, monthly food subscription platform meticulously crafted for discerning individuals, couples, and families.
        </p>

        {/* CTA row */}
        <div className="flex items-center justify-center gap-8 animate-fade-up-4">
          {/* BOOK A STAY style button */}
          <a href="#subscription" className="btn-taj-filled">
            Explore Plans
          </a>

          {/* Plain link — no button */}
          <a
            href="#menu"
            style={{ letterSpacing: '0.16em' }}
            className="text-[0.72rem] font-semibold text-[var(--green)] uppercase no-underline border-b-2 border-[var(--green)] pb-px transition-all duration-300 hover:text-[var(--gold)] hover:border-[var(--gold)]"
          >
            View Menu
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-0 mt-14 pt-10 border-t border-[var(--border)] animate-fade-up-5">
          {[['500+', 'Happy Families'], ['28', 'Days Freshness'], ['3', 'Meals Daily']].map(([n, l], i, arr) => (
            <div key={n} className={`${i < arr.length - 1 ? 'pr-10 mr-10 border-r border-[var(--border)]' : ''} text-center`}>
              <div
                className="font-cinzel text-[2rem] font-normal text-[var(--green)] leading-none"
                style={{ fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
              >{n}</div>
              <div
                className="text-[0.65rem] text-[var(--text-muted)] mt-1.5 uppercase tracking-[0.1em]"
                style={{}}
              >{l}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Hero
