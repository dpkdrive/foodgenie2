'use client'

import { useEffect, useRef } from 'react'
import React from 'react'

const sections = [
  {
    id: 'cancellation',
    title: 'Refund & Cancellation Policy',
    content: [
      'In case a user wants to terminate the subscription due to any reason be it transfer, family emergency and similar.',
    ],
    bullets: [
      <>Full refund, if the request is initiated before 24 hours of the first meal delivery of the subscription i.e. 7AM for morning slot and 6PM for evening.</>,
      <>If the refund is initiated after 24 hours then charge of one subscribed plan or meal is applicable.</>,
      <>No refund is applicable on individual meals ordered.</>,
      <>No refunds will be initiated if the kitchen is not operational because of any circumstances not under the control of management like strikes, natural disaster etc. The meal/s will be delivered when the situation subsides.</>,
      <>If refund is accepted by us, the refund amount will be credited back to the original mode of payment within <span style={{ color: 'white', fontWeight: 500 }}>5 working days</span>.</>,
      <>By default, all the meals will be delivered together in the morning slot between <span style={{ color: 'white', fontWeight: 500 }}>7:00 AM to 10:00 AM</span>. Since all deliveries are done in batches, the client should be available to collect the meals. The rider will wait for 5–10 minutes and upon no response, the rider will move ahead and the meals will not be compensated.</>,
    ],
  },
  {
    id: 'conduct-policy',
    title: 'Code Of Conduct Policy',
    content: [
      'Food Genie respects all its clients and employees working in the organization. The company holds the right to terminate any on-going subscription if the client misbehaves with any of its employees. The refund will be processed on a pro-rata basis for the same.',
    ],
  },
  {
    id: 'compensation',
    title: 'Compensation Policy',
    content: [
      'Compensation or appropriate corrective action will be provided only in the event of the following:',
    ],
    bullets: [
      <>Delivery of an incorrect meal</>,
      <>Delivery of a meal containing a stated allergen</>,
      <>Compensation will not be offered for taste-related concerns or subjective meal preference issues.</>,
      <>We value your trust and are dedicated to providing safe, nutritious, and high-quality meals with consistency and care.</>,
    ],
  },
  {
    id: 'meal-prep',
    title: 'Meal Preparation Policy',
    content: [
      'Our kitchen prepares a large volume of meals daily, each tailored to meet individual client requirements, dietary needs, and customization preferences. We take great care to follow all specified instructions and strive to deliver meals that best align with the preferences communicated by our clients.',
      'However, given the scale and complexity of our operations, there may be occasional human errors despite our best efforts and quality checks. In such instances, we request your understanding and patience. We are committed to continually improving and maintaining high service standards.',
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery Policy',
    content: [
      'Each delivery executive carries multiple orders per slot. Therefore, we adhere to designated delivery time windows and do not offer fixed delivery timings for individual clients.',
      'Morning Slot: 7:00 AM – 10:00 AM  ·  Evening Slot: 6:00 PM – 8:00 PM',
      'If you want your delivery at a specific time, you can initiate your request of preferred time to our customer care team via WhatsApp. We do not guarantee but our team will try to accommodate the request.',
      'NOTE — Requests must be submitted by 6:00pm for evening day.',
      'Same-day changes for evening deliveries are not encouraged and we cannot guarantee implementation or compensation under any circumstance.',
      'Delivery address change requests on the same morning of delivery will not be accepted. The delivery will be made to the address last confirmed only.',
    ],
  },
]

const P: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize:   '1.1rem',
  fontWeight: 300,
  lineHeight: 1.85,
  color:      'white',
  margin:     '0 0 12px',
}

const UL: React.CSSProperties = {
  listStyle:     'none',
  padding:       0,
  margin:        '16px 0',
  display:       'flex',
  flexDirection: 'column',
  gap:           10,
}

const LI: React.CSSProperties = {
  display:    'flex',
  gap:        14,
  alignItems: 'flex-start',
  fontFamily: 'Inter, sans-serif',
  fontSize:   '1.1rem',
  fontWeight: 300,
  color:      'white',
  lineHeight: 1.8,
}

function Section({ section, index, total }: { section: typeof sections[0], index: number, total: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={section.id}
      style={{
        opacity:      0,
        transform:    'translateY(20px)',
        transition:   `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms`,
        padding:      'clamp(32px,5vw,48px) clamp(20px,5vw,52px)',
        borderBottom: index < total - 1 ? '1px solid rgba(201,169,110,0.18)' : 'none',
      }}
    >
      <h2 style={{
        fontFamily:    'var(--font-cinzel), serif',
        fontSize:      'clamp(1.2rem,3vw,1.8rem)',
        fontWeight:    400,
        color:         'white',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin:        '0 0 20px',
        lineHeight:    1.3,
      }}>{section.title}</h2>

      {section.content?.map((p, i) => (
        <p key={i} style={P}>{p}</p>
      ))}

      {section.bullets && (
        <ul style={UL}>
          {section.bullets.map((item, i) => (
            <li key={i} style={LI}>
              <span style={{ color: 'white', flexShrink: 0, marginTop: 7, fontSize: 9 }}>◆</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function RefundPage() {
  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh' }}>

      {/* CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(100px,10vw,140px) clamp(20px,5vw,48px) clamp(48px,7vw,80px)' }}>
        <div style={{ border: '1px solid rgba(201,169,110,0.25)', overflow: 'hidden' }}>
          {sections.map((section, index) => (
            <Section key={section.id} section={section} index={index} total={sections.length} />
          ))}
        </div>

        <p style={{ ...P, textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
          Because of the nature of our business, we do not have a return policy.
        </p>

        <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: 12, lineHeight: 1.7 }}>
          Questions about our refund policy?{' '}
          <a href="mailto:feedback@foodgenie.com" style={{ color: 'white', textDecoration: 'none' }}>Contact us</a>
        </p>
      </div>
    </div>
  )
}
