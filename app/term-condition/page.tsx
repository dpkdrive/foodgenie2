import React from 'react'

const sections = [
  {
    id: 'acceptance',
    num: '01',
    title: 'Acceptance of Terms',
    content: [
      `Please read these Terms very carefully. If you do not agree to these Terms, Food Genie will not be able to provide any of its Services to you. By accessing or viewing the Platform and/or using the Services, you represent that you have read the Terms and agree to be bound by the same.`,
      `We may amend/modify the Terms at any time, and such modifications shall be effective immediately upon posting on the Platform. You are suggested to keep informed and check the platform on regular basis. If you do not agree to the Terms & Conditions as may be modified from time to time, you have the option to not avail or discontinue from availing our Services.`,
    ],
  },
  {
    id: 'declaration',
    num: '02',
    title: 'Declaration',
    bullets: [
      'We do not negotiate prices on our products and all our prices are final.',
      'Food Genie will not be responsible for any meal compensation if the meal delivery is delayed because of unforeseen events like heavy rainfall, natural calamities etc.',
      'If there is any change in address kindly inform us a day before by 6pm post that no request will be entertained.',
    ],
  },
  {
    id: 'medical',
    num: '03',
    title: 'Medical Conditions',
    content: [
      'Food Genie is not responsible for any medical condition/s that is experienced by the client during the tenure of the subscription and is not liable to pay any compensation for the same.',
    ],
    note: 'Note: The same food is consumed by team members including founder.',
  },
  {
    id: 'payment',
    num: '04',
    title: 'Payments & Billing',
    content: [
      'All payments for subscriptions and individual orders must be made in advance through the payment methods available on our Platform. We accept major credit/debit cards, UPI, net banking, and select digital wallets.',
      'All prices displayed on the Platform are inclusive of applicable taxes unless stated otherwise.',
      'We do not negotiate prices on our products and all our prices are final.',
      'Failed payments will result in temporary suspension of your subscription until the outstanding amount is cleared.',
      'FoodGenie uses PCI-DSS compliant third-party payment gateways. We do not store your complete card details on our servers.',
      'In case of an erroneous charge, please contact our support team within 48 hours of the transaction. Verified billing errors will be corrected promptly.',
      'GST and other applicable levies will be charged as per prevailing government regulations and will appear on your invoice.',
    ],
  },
  {
    id: 'delivery',
    num: '05',
    title: 'Delivery Terms',
    content: [
      'FoodGenie strives to deliver your meals fresh and on time. Deliveries are made within the stated delivery windows communicated at the time of subscription. However, the following conditions apply:',
      'Delivery windows are estimates and may vary due to traffic, weather, or operational factors. FoodGenie will not be responsible for any meal compensation if the meal delivery is delayed because of unforeseen events like heavy rainfall, natural calamities, or force majeure.',
      'If there is any change in address, kindly inform us a day before by 6pm. No request for address change will be entertained after this deadline.',
      'Failed payments will result in temporary suspension of your subscription until the outstanding amount is cleared.',
      `Deliveries are attempted once per scheduled window. If you are unavailable, the meal will be left in a safe, accessible spot at your premises at our delivery partner's discretion.`,
      'In case of an erroneous charge, please contact our support team within 48 hours of the transaction. Verified billing errors will be corrected promptly.',
      'Delivery is currently available only within serviceable pin codes listed on the Platform. FoodGenie reserves the right to modify the delivery coverage area.',
    ],
  },
]

const P: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize:   '1.1rem',
  fontWeight: 300,
  lineHeight: 1.85,
  color:      'rgb(69,68,63)',
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
  color:      'rgb(69,68,63)',
  lineHeight: 1.8,
}

export default function TermsPage() {
  return (
    <div style={{ background: '#fff', color: 'var(--green)', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{
        padding:      'clamp(100px,14vw,140px) clamp(20px,6vw,96px) clamp(48px,7vw,72px)',
        textAlign:    'center',
        borderBottom: '1px solid rgba(201,169,110,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          <span style={{ height: 1, width: 48, background: 'rgba(201,169,110,0.5)', flexShrink: 0 }} />
          <span style={{
            fontFamily:    'var(--font-cinzel), serif',
            fontSize:      '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color:         'var(--gold)',
          }}>Legal · Last updated June 2025</span>
          <span style={{ height: 1, width: 48, background: 'rgba(201,169,110,0.5)', flexShrink: 0 }} />
        </div>

        <h1 style={{
          fontFamily:    'var(--font-cinzel), serif',
          fontSize:      'clamp(1.8rem,5vw,3.5rem)',
          fontWeight:    400,
          color:         'var(--green)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight:    1.15,
          margin:        '0 auto',
        }}>
          Terms &amp; <span style={{ color: 'var(--gold)' }}>Conditions</span>
        </h1>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,48px)' }}>
        <div style={{ border: '1px solid rgba(201,169,110,0.25)', overflow: 'hidden' }}>
          {sections.map((s, idx) => (
            <div
              key={s.id}
              style={{
                padding:      'clamp(32px,5vw,48px) clamp(20px,5vw,52px)',
                borderBottom: idx < sections.length - 1 ? '1px solid rgba(201,169,110,0.18)' : 'none',
              }}
            >
              {/* Number + Title */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
                <span style={{
                  fontFamily:    'var(--font-cinzel), serif',
                  fontSize:      '0.65rem',
                  letterSpacing: '0.18em',
                  color:         'var(--gold)',
                  flexShrink:    0,
                }}>{s.num}</span>
                <h2 style={{
                  fontFamily:    'var(--font-cinzel), serif',
                  fontSize:      'clamp(1rem,2.2vw,1.35rem)',
                  fontWeight:    400,
                  color:         'var(--green)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin:        0,
                  lineHeight:    1.3,
                }}>{s.title}</h2>
              </div>

              {/* Paragraphs */}
              {s.content?.map((p, i) => (
                <p key={i} style={P}>{p}</p>
              ))}

              {/* Bullets */}
              {s.bullets && (
                <ul style={UL}>
                  {s.bullets.map((b, i) => (
                    <li key={i} style={LI}>
                      <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 7, fontSize: 9 }}>◆</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Note */}
              {s.note && (
                <p style={{
                  fontFamily:  'Inter, sans-serif',
                  fontSize:    '0.88rem',
                  fontWeight:  500,
                  fontStyle:   'italic',
                  color:       'var(--gold)',
                  marginTop:   14,
                  paddingLeft: 16,
                  borderLeft:  '2px solid rgba(201,169,110,0.4)',
                }}>
                  {s.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(40,35,25,0.45)', marginTop: 36, lineHeight: 1.7 }}>
          Questions?{' '}
          <a href="mailto:support@foodgenie.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Contact us</a>
        </p>
      </div>
    </div>
  )
}
