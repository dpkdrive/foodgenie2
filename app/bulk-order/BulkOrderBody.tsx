'use client'

export default function BulkOrderBody({ imageUrl }: { imageUrl: string }) {
  return (
    <div style={{
      background:     'var(--green)',
      minHeight:      '100vh',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        'clamp(100px,12vw,140px) clamp(20px,5vw,48px) clamp(48px,7vw,80px)',
    }}>

      <h1 style={{
        fontFamily:    'var(--font-cinzel), serif',
        fontSize:      'clamp(2rem,6vw,4rem)',
        fontWeight:    400,
        color:         '#fff',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight:    1.15,
        margin:        '0 0 48px',
        textAlign:     'center',
      }}>
        Corporate / Party
      </h1>

      <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36 }}>

        {imageUrl ? (
          <div style={{
            width:        '100%',
            borderRadius: 0,
            overflow:     'hidden',
            border:       '1px solid rgba(255,255,255,0.1)',
          }}>
            <img
              src={imageUrl}
              alt="Bulk Order Menu"
              style={{ width: '100%', display: 'block', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div style={{
            width:        '100%',
            padding:      '60px 0',
            textAlign:    'center',
            border:       '1px solid rgba(255,255,255,0.1)',
            color:        'rgba(255,255,255,0.3)',
            fontFamily:   'Inter, sans-serif',
            fontSize:     '0.9rem',
          }}>
            Menu image coming soon
          </div>
        )}

        <a
          href="tel:+919958093268"
          className="hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            10,
            padding:        '16px 48px',
            background:     'transparent',
            border:         '1px solid rgba(255,255,255,0.5)',
            color:          '#fff',
            fontFamily:     'Inter, sans-serif',
            fontSize:       '0.78rem',
            fontWeight:     400,
            letterSpacing:  '0.26em',
            textTransform:  'uppercase',
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
          </svg>
          Call Us — +91 99580 93268
        </a>

      </div>
    </div>
  )
}
