import React from 'react'

export const metadata = {
  title: 'Privacy Policy — Food Genie',
  description: 'Learn how FoodGenie collects, uses, and protects your personal data.',
}

const sections = [
  {
    id: 'commitment',
    num: '00',
    title: 'Our Commitment to Privacy',
    content: ['Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate, disclose and make use of personal information. The following outlines our privacy policy.'],
    bullets: [
      'Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.',
      'We will collect and use personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.',
      'We will only retain personal information as long as necessary for the fulfillment of those purposes.',
      'We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.',
      'Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.',
      'We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.',
      'We will make readily available to customers information about our policies and practices relating to the management of personal information.',
    ],
  },
  {
    id: 'information-we-collect',
    num: '01',
    title: 'Information We Collect',
    content: ['We collect information you provide directly to us when you register an account, place an order, subscribe to a meal plan, or contact us for support. The types of personal data we may collect include:'],
    bullets: [
      'Identity & Contact Information: Full name, email address, phone number, and delivery address.',
      'Account Credentials: Username and encrypted password used to access your FoodGenie account.',
      'Payment Information: Billing address, card type, and last four digits of your card. Full card numbers are never stored on our servers.',
      'Dietary Preferences & Allergies: Meal preferences, dietary restrictions, and allergy information you choose to share.',
      'Order & Transaction History: Details of every order placed, including items, delivery time, value, and fulfilment status.',
      'Device & Usage Data: IP address, browser type, operating system, pages visited, and interaction events.',
      'Communications: Records of correspondence when you contact our support team.',
    ],
  },
  {
    id: 'how-we-use',
    num: '02',
    title: 'How We Use Your Information',
    content: ['We use the personal information we collect to deliver, improve, and protect the FoodGenie service. Specifically, your data is used to:'],
    bullets: [
      'Process and fulfill your orders, manage subscriptions, and send delivery notifications and receipts.',
      'Personalise your meal recommendations based on your stated dietary preferences.',
      'Process payments securely and prevent fraudulent transactions.',
      'Respond to your support requests, queries, and feedback promptly.',
      'Send you service-related communications such as account updates and policy changes.',
      'Send optional marketing communications. You may unsubscribe anytime via the link in any email.',
      'Analyse aggregated, anonymised usage data to improve our platform and menu offerings.',
      'Comply with applicable laws, regulations, and legal obligations.',
    ],
  },
  {
    id: 'data-sharing',
    num: '03',
    title: 'Data Sharing & Third Parties',
    content: ['We do not sell your personal information to third parties under any circumstances. We may share your data only in the limited scenarios described below.'],
    bullets: [
      'Service Providers: Trusted vendors for cloud hosting, payment processing, SMS/email delivery, and analytics — bound by strict data processing agreements.',
      'Delivery Partners: Your name, phone number, and delivery address are shared with our logistics partners solely to fulfil your order.',
      'Legal Compliance: We may disclose information to authorities when required by law or court order.',
      'Business Transfers: In the event of a merger or acquisition, your data may be transferred to the successor entity.',
      'With Your Consent: We may share data with other third parties when you have given us explicit consent.',
    ],
  },
  {
    id: 'cookies',
    num: '04',
    title: 'Cookies & Tracking',
    content: ['We use cookies, pixel tags, and similar tracking technologies to operate and improve our platform. You can control cookie behaviour through your browser settings.'],
    bullets: [
      'Essential Cookies: Required for core platform functionality such as authentication and session management.',
      'Analytical Cookies: Help us understand how visitors interact with our website.',
      'Functional Cookies: Remember your preferences such as language, region, and dietary filters.',
      'Marketing Cookies: Used to show relevant advertisements. You may opt out at any time.',
    ],
  },
  {
    id: 'data-security',
    num: '05',
    title: 'Data Security',
    content: ['We take the security of your personal information seriously and implement a range of technical and organisational measures to protect it.'],
    bullets: [
      'All data transmitted between your device and our servers is encrypted using SSL/TLS encryption.',
      'Payment card data is processed via PCI-DSS compliant payment gateways. We do not store raw card details.',
      'Access to personal data within our organisation is restricted on a need-to-know basis.',
      'Our systems undergo regular security audits and penetration testing.',
      'In the event of a data breach, we will notify you and relevant authorities within 72 hours.',
    ],
  },
  {
    id: 'retention',
    num: '06',
    title: 'Data Retention',
    content: ['We retain your personal information only for as long as necessary to fulfil the purposes outlined in this Policy, or as required by applicable law.'],
    bullets: [
      'Account data is retained for the duration of your active account relationship with FoodGenie.',
      'Following account deletion, we will delete or anonymise your personal data within 30 days.',
      'Transaction and billing records may be retained for up to 7 years per financial regulations.',
      'If you submit a data deletion request, we will confirm deletion within 10 business days.',
    ],
  },
  {
    id: 'your-rights',
    num: '07',
    title: 'Your Rights & Choices',
    content: ['Depending on your jurisdiction, you may have certain rights regarding your personal data.'],
    bullets: [
      'Right to Access: Request a copy of the personal data we hold about you at any time.',
      'Right to Rectification: Request correction of any inaccurate or incomplete information.',
      'Right to Erasure: Request deletion of your personal data, subject to legal retention obligations.',
      'Right to Restrict Processing: Ask us to restrict how we use your data in certain circumstances.',
      'Right to Data Portability: Request your data in a structured, machine-readable format.',
      'Right to Object: Object to processing of your data for direct marketing purposes at any time.',
      'To exercise any of these rights, please contact us at privacy@foodgenie.com.',
    ],
  },
  {
    id: 'contact',
    num: '08',
    title: 'Contact & Grievances',
    content: ['For any privacy-related queries, data requests, or grievances, please reach out to our Data Protection Officer:'],
    address: [
      'Fourleaf Cafe & Restaurants Pvt. Ltd.',
      'Sector 57, Gurugram',
      'privacy@foodgenie.com',
    ],
    extra: 'We aim to respond to all privacy-related requests within 10 business days.',
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

export default function PrivacyPage() {
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
          Privacy <span style={{ color: 'var(--gold)' }}>Policy</span>
        </h1>
      </section>

      {/* CONTENT */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(48px,7vw,80px) clamp(20px,5vw,48px)' }}>
        <div style={{ border: '1px solid rgba(201,169,110,0.25)', overflow: 'hidden' }}>
          {sections.map((s, idx) => (
            <div
              key={s.id}
              id={s.id}
              style={{
                padding:      'clamp(32px,5vw,48px) clamp(20px,5vw,52px)',
                borderBottom: idx < sections.length - 1 ? '1px solid rgba(201,169,110,0.18)' : 'none',
              }}
            >
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

              {s.content?.map((p, i) => (
                <p key={i} style={P}>{p}</p>
              ))}

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

              {s.address && (
                <address style={{ fontStyle: 'normal', margin: '16px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.address.map((line, i) => (
                    <span key={i} style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize:   '1.1rem',
                      fontWeight: 300,
                      color:      line.includes('@') ? 'var(--gold)' : 'rgb(69,68,63)',
                      lineHeight: 1.9,
                    }}>{line}</span>
                  ))}
                </address>
              )}

              {s.extra && (
                <p style={{ ...P, marginTop: 16 }}>{s.extra}</p>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(40,35,25,0.45)', marginTop: 36, lineHeight: 1.7 }}>
          Privacy concerns?{' '}
          <a href="mailto:privacy@foodgenie.com" style={{ color: 'var(--gold)', textDecoration: 'none' }}>privacy@foodgenie.com</a>
        </p>
      </div>
    </div>
  )
}
