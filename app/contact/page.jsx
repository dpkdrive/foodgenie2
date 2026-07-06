export const metadata = {
  title: 'Get in Touch — Food Genie',
  description: 'Contact FoodGenie for inquiries, feedback, or simply to say hello.',
}

const CARD = {
  background:  '#fff',
  border:      '1px solid rgba(201,169,110,0.25)',
  padding:     'clamp(28px,4vw,40px)',
}

const LABEL = {
  fontFamily:    'var(--font-cinzel), serif',
  fontSize:      '0.62rem',
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color:         'var(--gold)',
  display:       'block',
  marginBottom:  12,
}

const H3 = {
  fontFamily:    'var(--font-cinzel), serif',
  fontSize:      'clamp(0.9rem,1.8vw,1.1rem)',
  fontWeight:    400,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color:         'var(--green)',
  margin:        '0 0 20px',
}

const P = {
  fontFamily: 'Inter, sans-serif',
  fontSize:   '1.1rem',
  fontWeight: 300,
  lineHeight: 1.85,
  color:      'rgb(69,68,63)',
  margin:     '0 0 8px',
}

const CONTACT_LINK = {
  fontFamily:    'Inter, sans-serif',
  fontSize:      '1rem',
  fontWeight:    300,
  color:         'rgb(69,68,63)',
  textDecoration:'none',
  display:       'flex',
  alignItems:    'center',
  gap:           12,
  padding:       '10px 0',
  borderBottom:  '1px solid rgba(201,169,110,0.18)',
}

export default function ContactPage() {
  return (
    <div style={{ background: '#fff', color: 'var(--green)', minHeight: '100vh' }}>
      <style>{`
        .contact-link:hover { color: var(--gold) !important; }
      `}</style>

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
          }}>Contact Us</span>
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
          margin:        '0 auto 20px',
        }}>
          We&apos;d Love to <span style={{ color: 'var(--gold)' }}>Hear</span> From You
        </h1>

        <p style={{ ...P, maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
          Reach out for inquiries, feedback, or simply to say hello. We&apos;re always happy to connect.
        </p>
      </section>

      {/* CARDS */}
      <div style={{
        maxWidth: 1060,
        margin:   '0 auto',
        padding:  'clamp(48px,7vw,80px) clamp(20px,5vw,48px)',
        display:  'grid',
        gap:      24,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      }}>

        {/* Address */}
        <div style={CARD}>
          <span style={LABEL}>Find Us</span>
          <h3 style={H3}>Our Location</h3>
          <address style={{ fontStyle: 'normal' }}>
            <p style={P}>
              Fourleaf Cafe &amp; Restaurants Pvt. Ltd.<br />
              Sector 57, Gurugram
            </p>
          </address>
        </div>

        {/* Get in Touch */}
        <div style={CARD}>
          <span style={LABEL}>Reach Out</span>
          <h3 style={H3}>Get in Touch</h3>
          <a href="mailto:inquiries@foodgenie.com" style={CONTACT_LINK}
            className="contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--gold)' }}>
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
            </svg>
            inquiries@foodgenie.com
          </a>
          <a href="https://wa.me/919958093268" target="_blank" rel="noopener noreferrer" style={{ ...CONTACT_LINK }}
            className="contact-link">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" style={{ flexShrink: 0, color: 'var(--gold)' }}>
              <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 2.888.756 5.708 2.192 8.188L0 32l7.594-2.164A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16.004C32 7.56 24.837.396 16 .396zm7.28 19.744c-.396-.198-2.34-1.158-2.704-1.29-.366-.132-.63-.198-.894.198-.264.396-1.026 1.29-1.258 1.554-.234.264-.462.297-.858.1-.396-.198-1.674-.618-3.188-1.972-1.178-1.05-1.974-2.346-2.206-2.742-.234-.396-.024-.61.174-.806.178-.176.396-.462.594-.694.198-.234.264-.396.396-.66.132-.264.066-.495-.033-.694-.1-.198-.894-2.156-1.224-2.956-.322-.774-.65-.67-.894-.682l-.762-.014c-.264 0-.694.1-1.058.495s-1.388 1.356-1.388 3.308c0 1.952 1.422 3.838 1.62 4.102.198.264 2.8 4.276 6.788 5.996.948.41 1.688.654 2.264.838.95.302 1.816.26 2.5.158.762-.114 2.34-.956 2.67-1.88.33-.924.33-1.716.23-1.88-.1-.165-.364-.264-.76-.462z"/>
            </svg>
            WhatsApp: +91 99580 93268
          </a>
          <a href="tel:+919958093268" style={{ ...CONTACT_LINK, borderBottom: 'none' }}
            className="contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--gold)' }}>
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Call: +91 99580 93268
          </a>
        </div>

        {/* Feedback */}
        <div style={CARD}>
          <span style={LABEL}>Inquiry</span>
          <h3 style={H3}>Inquiry &amp; Feedback</h3>
          <p style={P}>We take every word seriously. Share your experience and help us do better.</p>
          <a href="mailto:feedback@foodgenie.com" style={{ ...CONTACT_LINK, borderBottom: 'none', marginTop: 8 }}
            className="contact-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--gold)' }}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            feedback@foodgenie.com
          </a>
        </div>

      </div>

    </div>
  )
}
