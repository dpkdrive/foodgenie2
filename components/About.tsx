import Image from 'next/image'
import React from 'react'


const ISSUES = [
  { pre: 'आज फिर ', highlight: 'कुक नहीं आई?', post: '' },
  { pre: 'आज फिर ', highlight: 'खाना टेस्टी नहीं बना?', post: '' },
  { pre: '', highlight: 'Meal prep और self cooking', post: ' में बहुत energy और time जा रहा है?' },
  { pre: 'घर में ', highlight: 'get together', post: ' है?' },
  { pre: 'Office में ', highlight: 'event', post: ' है?' },
]

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden  padding-top"
      style={{ background: 'linear-gradient(to bottom, #000000 0%, #ffffff 100%)' }}

    >
      {/* ── Top heading ─────────────────────────────────────────────── */}
      <div className="text-center px-6 ">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-12 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
          <h2
            className="font-cinzel text-[clamp(1.8rem,4vw,3.2rem)] font-normal uppercase leading-[1.2] tracking-[0.06em]"
            style={{ color: '#ffffff', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
          >
            Handcrafted, Delectable &amp;<br />Wholesome Food Solution
          </h2>
          <span className="h-px w-12 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.5)' }} />
        </div>
        <p
          className="font-playfair text-[clamp(1rem,1.8vw,1.2rem)] font-light italic max-w-[500px] mx-auto leading-[1.8]"
          style={{ color: 'rgba(201,169,110,0.65)' }}
        >
          "Food is the best love language"
        </p>
      </div>

      {/* ── Two-column grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* Image column */}
        <div className="rv relative h-[560px] md:h-auto min-h-[500px] overflow-hidden">
          <Image
            src="/assets/masale.webp"
            alt="FoodGenie Spices"
            fill
            className="object-cover"
            style={{ filter: 'brightness(0.75)' }}
          />
        </div>

        {/* Text column */}
        <div
          className="rv px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center"
          style={{ background: 'rgba(255,255,255,0.97)' }}
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-8 flex-shrink-0" style={{ background: 'var(--gold)' }} />
            <span
              className="text-[0.85rem] uppercase tracking-[0.22em] font-medium"
              style={{ color: 'var(--gold)', fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif' }}
            >
              About Food Genie
            </span>
          </div>

          {/* Hindi issues list */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-10">
            {ISSUES.map(({ pre, highlight, post }, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2"
                style={{
                  fontFamily: "'Tiro Devanagari Hindi', Georgia, serif",
                  fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
                  lineHeight: 1.8,
                  color: 'rgb(90,85,78)',
                  width: 'fit-content',
                }}
              >
                {(i === 1 || i === 4) && (
                  <span style={{ color: 'var(--gold)', flexShrink: 0, fontWeight: 300 }}>|</span>
                )}
                <span>
                  {pre}
                  <span style={{ color: 'var(--green)', borderBottom: '2px solid var(--gold)', paddingBottom: 1, fontWeight: 500 }}>
                    {highlight}
                  </span>
                  {post}
                </span>
              </div>
            ))}
          </div>

          {/* Body */}
          <p className="leading-[1.9] mb-5 text-[1.1rem]">
            Food Genie is a food solution expertly tailored to meet your nutritional needs, liberating you from cook woes, grocery management hassles, and health compromises – empowering you to focus on your personal and professional life's pursuits with ease.
          </p>
          <p className="leading-[1.9] mb-5 text-[1.05rem]">
            We all face following similar issues in our kitchen - incessant absences of cook especially when you're counting on them, ignored feedback, hasty preparations that sacrifice quality, lack of attention to cooking techniques.
          </p>
          <p className="leading-[1.9] mb-5 text-[1.05rem]">
            Despite trials with recommended chefs and cooks, finding 'the one" who masters the art of healthy, delectable cooking remains elusive.
          </p>
          <p className="leading-[1.9] mb-3 text-[1.05rem]">Repeated mistakes ensue: —</p>
          <ul className="mb-5 flex flex-col gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              'Scorched oil compromising nutrients - leading to oxidation and polymerisation.',
              'Vegetables and fruits soaked in water for long leading to vitamin and mineral loss or not washed properly to remove pesticides.',
              'Hygiene oversights — Leading to vitamin and mineral loss.',
              'Waste management — Improper segregation of waste',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[1.05rem] leading-[1.9]" style={{ color: 'rgb(69,68,63)' }}>
                <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.15em' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="leading-[1.9] mb-4 text-[1.05rem]">And many more.</p>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <div
        className="text-center py-14 px-6"
        style={{ background: '#ffffff', borderTop: '1px solid var(--border)' }}
      >
        <p
          className="font-cinzel text-[clamp(1rem,2vw,1.3rem)] font-normal uppercase tracking-[0.1em] mb-6"
          style={{ color: 'var(--green)', fontFamily: 'var(--font-cinzel), serif' }}
        >
          One Stop Solution to All Your Food Related Issues
        </p>
        <a href="#subscription" className="btn-taj-filled">Explore Plans</a>
      </div>
    </section>
  )
}

export default About
