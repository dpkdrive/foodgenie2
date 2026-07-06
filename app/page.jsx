'use client'
import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'

import Menu from '../components/Menu'
import Hero from '../components/Hero'
import TestimonialsCarousel from '../components/Testimonial'
import About from '../components/About'
import Plan from '../components/Plan'
import MealSchedule from '../components/MealSchedule'



const FAQS = [
  { q:'Why FoodGenie?', a:<ul className="list-none"><li className="py-1 pl-[18px] relative before:content-['•'] before:absolute before:left-0 before:text-[var(--green)]">Experienced and passionate chefs dish out a repertoire of cuisines, taking your culinary experience to another level.</li><li className="py-1 pl-[18px] relative before:content-['•'] before:absolute before:left-0 before:text-[var(--green)]">Home style, handcrafted, nutritious offerings with balanced flavours are designed to delight and satisfy.</li><li className="py-1 pl-[18px] relative before:content-['•'] before:absolute before:left-0 before:text-[var(--green)]">Fresh preparations daily with qualitative ingredients.</li></ul>, open:true },
  { q:'Who is the competitor of FoodGenie?', a:'We believe in collaboration, shared success, and collective growth over competition and a scarcity mindset.' },
  { q:'Can I customise my meal plan?', a:'Absolutely! FoodGenie offers Veg, Non-Veg, and Eggetarian options across all plans. Our team works with you to accommodate dietary preferences, allergies, and taste preferences. Weekly and monthly subscribers get dedicated menu customisation support.' },
  { q:'Do you cater for events and occasions?', a:'Yes! FoodGenie is a premium food provider for Birthdays, Anniversaries, Promotions, Family & Friends reunions, Baby Showers, and all joyful festivities. Contact us to craft your bespoke culinary experience.' },
]

export default function HomePage() {
  const [diet, setDiet] = useState('veg')
  const [openFaqs, setOpenFaqs] = useState({ 0: true })

  const toggleFaq = (i) => setOpenFaqs(p => ({ ...p, [i]: !p[i] }))



  return (
    <>
      <ScrollReveal />

      {/* ── HERO ── */}
      <Hero diet={diet}/>


      {/* ── ABOUT ── */}
        <About />

      {/* ── MENU ── */}
     <Menu />

      {/* ── SUBSCRIPTION ── */}
    <Plan diet={diet} setDiet={setDiet}/>

      {/* ── MEAL SCHEDULE ── */}
      {/* <MealSchedule /> */}

      {/* ── TESTIMONIALS ── */}
          <TestimonialsCarousel />

      {/* ── FAQ ── */}
      <section id="faq" style={{ background: '#fff' }} className="padding-top padding-bottom px-6">

        {/* Heading */}
        <div className="rv " style={{ textAlign: 'center', marginBottom: 'clamp(48px,7vw,72px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 18 }}>
            <span style={{ height: 1, width: 52, background: 'rgba(201,169,110,0.5)', flexShrink: 0 }} />
            <span style={{
              fontFamily: 'var(--font-inter), serif',
              fontSize: '1rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>Got Questions</span>
            <span style={{ height: 1, width: 52, background: 'rgba(201,169,110,0.5)', flexShrink: 0 }} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 'clamp(1.6rem,3.5vw,2.8rem)',
            fontWeight: 400,
            color: 'var(--green)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            margin: '0 0 16px',
          }}>
            Frequently Asked Questions
          </h2>

        </div>

        {/* Accordion */}
        <div className="rv" style={{ maxWidth: 780, margin: '0 auto' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(201,169,110,0.25)' }}>

              {/* Question row */}
              <button
                onClick={() => toggleFaq(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                  padding: 'clamp(18px,3vw,26px) 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: 'clamp(1rem,1.8vw,1.25rem)',
                  fontWeight: 400,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: openFaqs[i] ? 'var(--gold)' : 'var(--green)',
                  transition: 'color 0.25s',
                  lineHeight: 1.5,
                }}>
                  {faq.q}
                </span>

                {/* +/− icon */}
                <span style={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  border: '1px solid rgba(201,169,110,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold)',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-jost), sans-serif',
                  fontWeight: 300,
                  transition: 'background 0.25s, color 0.25s',
                  background: openFaqs[i] ? 'var(--gold)' : 'transparent',
                }}>
                  <span style={{ color: openFaqs[i] ? '#fff' : 'var(--gold)', lineHeight: 1 }}>
                    {openFaqs[i] ? '−' : '+'}
                  </span>
                </span>
              </button>

              {/* Answer */}
              <div style={{
                maxHeight: openFaqs[i] ? 400 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.42s cubic-bezier(0.4,0,0.2,1)',
              }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  color: 'rgba(50,45,35,0.72)',
                  lineHeight: 1.85,
                  letterSpacing: '0.01em',
                  paddingBottom: 'clamp(18px,3vw,26px)',
                }}>
                  {faq.a}
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>
    </>
  )
}
