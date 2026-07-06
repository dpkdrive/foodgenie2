import Link from 'next/link'

export default function PaymentSuccess() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf9f7', fontFamily: 'Inter, sans-serif', padding: '24px',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '56px 48px', maxWidth: 480, width: '100%',
        textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        borderTop: '4px solid #c9a96e',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#dcfce7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: '1.8rem',
        }}>✓</div>

        <p style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a96e', fontFamily: 'var(--font-cinzel), serif', marginBottom: 12 }}>
          Payment Successful
        </p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#2d4a28', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.04em', marginBottom: 16 }}>
          Thank You!
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.55)', lineHeight: 1.8, marginBottom: 32 }}>
          Your FoodGenie subscription is confirmed. Our team will reach out within 2 hours to set up your delivery schedule.
        </p>

        <Link href="/" style={{
          display: 'inline-block', padding: '12px 32px',
          background: '#2d4a28', color: '#fff', textDecoration: 'none',
          fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', fontFamily: 'var(--font-cinzel), serif',
        }}>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
