import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight:      '100vh',
      background:     '#fff',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        'clamp(40px,8vw,80px) clamp(24px,6vw,64px)',
      position:       'relative',
      overflow:       'hidden',
      textAlign:      'center',
    }}>
      {/* Corner ornaments */}
      <span style={{ position:'absolute', top:36, left:36, width:48, height:48,
        borderTop:'1px solid rgba(201,169,110,0.35)', borderLeft:'1px solid rgba(201,169,110,0.35)' }} />
      <span style={{ position:'absolute', top:36, right:36, width:48, height:48,
        borderTop:'1px solid rgba(201,169,110,0.35)', borderRight:'1px solid rgba(201,169,110,0.35)' }} />
      <span style={{ position:'absolute', bottom:36, left:36, width:48, height:48,
        borderBottom:'1px solid rgba(201,169,110,0.35)', borderLeft:'1px solid rgba(201,169,110,0.35)' }} />
      <span style={{ position:'absolute', bottom:36, right:36, width:48, height:48,
        borderBottom:'1px solid rgba(201,169,110,0.35)', borderRight:'1px solid rgba(201,169,110,0.35)' }} />

      {/* Section label */}
      <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
        <span style={{ height:1, width:48, background:'rgba(201,169,110,0.4)' }} />
        <span style={{
          fontFamily:    'var(--font-cinzel), serif',
          fontSize:      '0.65rem',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color:         'var(--gold)',
        }}>Page Not Found</span>
        <span style={{ height:1, width:48, background:'rgba(201,169,110,0.4)' }} />
      </div>

      {/* 404 number */}
      <div style={{
        fontFamily:    'var(--font-cormorant), Georgia, serif',
        fontSize:      'clamp(7rem,20vw,14rem)',
        fontWeight:    300,
        lineHeight:    0.85,
        color:         'rgba(201,169,110,0.15)',
        letterSpacing: '0.06em',
        userSelect:    'none',
        marginBottom:  32,
      }}>
        404
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily:    'var(--font-cinzel), serif',
        fontSize:      'clamp(1.4rem,3.5vw,2.4rem)',
        fontWeight:    400,
        color:         'var(--green, #1c1009)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        lineHeight:    1.3,
        margin:        '0 0 20px',
      }}>
        Lost Your Way?
      </h1>

      {/* Subtitle */}
      <p style={{ maxWidth: 460, margin: '0 0 48px', lineHeight: 1.8 }}>
        The page you are looking for does not exist or has been moved.
        Let us guide you back to something delicious.
      </p>

      {/* Divider */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:48 }}>
        <span style={{ height:'1px', width:40, background:'rgba(201,169,110,0.4)' }} />
        <span style={{ width:5, height:5, background:'rgba(201,169,110,0.55)', transform:'rotate(45deg)', flexShrink:0 }} />
        <span style={{ height:'1px', width:40, background:'rgba(201,169,110,0.4)' }} />
      </div>

      {/* CTA */}
      <Link href="/" className="btn-taj btn-taj-gold">
        Return Home
      </Link>
    </main>
  )
}
