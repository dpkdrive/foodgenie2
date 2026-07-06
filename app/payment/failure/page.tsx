import Link from 'next/link'

export default function PaymentFailure() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf9f7', fontFamily: 'Inter, sans-serif', padding: '24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '56px 48px', maxWidth: 480, width: '100%',
        textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        borderTop: '4px solid #ef4444',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#fee2e2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '1.8rem',
        }}>✕</div>

        <p style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ef4444', fontFamily: 'var(--font-cinzel), serif', marginBottom: 12 }}>
          Payment Failed
        </p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#2d4a28', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.04em', marginBottom: 16 }}>
          Something Went Wrong
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', lineHeight: 1.8, marginBottom: 32 }}>
          Your payment could not be processed. No amount has been charged. Please try again or contact us for assistance.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/#subscription" style={{
            display: 'inline-block', padding: '12px 32px',
            background: '#2d4a28', color: '#fff', textDecoration: 'none',
            fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', fontFamily: 'var(--font-cinzel), serif',
          }}>
            Try Again
          </Link>
          <Link href="/contact" style={{
            display: 'inline-block', padding: '12px 32px',
            background: 'transparent', color: '#2d4a28', textDecoration: 'none',
            fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', fontFamily: 'var(--font-cinzel), serif',
            border: '1.5px solid #2d4a28',
          }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
