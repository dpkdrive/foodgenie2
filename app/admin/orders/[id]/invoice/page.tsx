'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ORDERS } from '../../../data'

export default function InvoicePage() {
  const { id }  = useParams<{ id: string }>()
  const router  = useRouter()
  const order   = ORDERS.find(o => o.id === id)

  const [approved, setApproved] = useState(false)
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('fg_approved')
    if (saved) setApproved(!!JSON.parse(saved)[id])
    setMounted(true)
  }, [id])

  const handleApprove = () => {
    const saved  = localStorage.getItem('fg_approved')
    const parsed = saved ? JSON.parse(saved) : {}
    const next   = { ...parsed, [id]: true }
    localStorage.setItem('fg_approved', JSON.stringify(next))
    setApproved(true)
  }

  if (!mounted) return null
  if (!order) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Subscription not found.</div>
  )

  const invoiceDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })

  const STATUS_COLOR: Record<string, string> = {
    Active: '#16a34a', Paused: '#ca8a04', Completed: '#0369a1', Cancelled: '#dc2626',
  }
  const STATUS_BG: Record<string, string> = {
    Active: '#dcfce7', Paused: '#fef9c3', Completed: '#dbeafe', Cancelled: '#fee2e2',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f0e8; font-family: 'Inter', sans-serif; }

        .inv-page {
          min-height: 100vh;
          background: #f5f0e8;
          padding: 32px 20px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .inv-topbar {
          width: 100%;
          max-width: 720px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .inv-sheet {
          width: 100%;
          max-width: 720px;
          background: #fff;
          border: 1px solid rgba(201,169,110,0.25);
          box-shadow: 0 4px 40px rgba(0,0,0,0.07);
        }

        /* ── Ornamental header ── */
        .inv-head {
          padding: 44px 52px 36px;
          border-bottom: 1px solid rgba(201,169,110,0.2);
          position: relative;
        }

        /* top gold rule */
        .inv-head::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c9a96e 30%, #c9a96e 70%, transparent);
        }

        .inv-head-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }

        .inv-eyebrow {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 8px;
        }
        .inv-brand {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 1.9rem;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: 0.1em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .inv-tagline {
          font-size: 0.7rem;
          color: rgba(0,0,0,0.35);
          letter-spacing: 0.06em;
          font-style: italic;
        }

        .inv-right { text-align: right; }
        .inv-inv-label {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 0.55rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.3);
          margin-bottom: 5px;
        }
        .inv-inv-id {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 1.3rem;
          font-weight: 600;
          color: #c9a96e;
          letter-spacing: 0.06em;
        }
        .inv-inv-date {
          font-size: 0.72rem;
          color: rgba(0,0,0,0.35);
          margin-top: 5px;
        }

        /* Gold ornament divider */
        .inv-ornament {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0 0;
        }
        .inv-ornament-line {
          flex: 1;
          height: 1px;
          background: rgba(201,169,110,0.3);
        }
        .inv-ornament-diamond {
          width: 6px; height: 6px;
          background: #c9a96e;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* ── Body ── */
        .inv-body { padding: 40px 52px; }

        .inv-section-label {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 0.55rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .inv-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(201,169,110,0.2);
        }

        /* Status badges */
        .inv-badges {
          display: flex;
          gap: 10px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .inv-badge {
          padding: 5px 18px;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid currentColor;
        }

        /* Info grid */
        .inv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid rgba(201,169,110,0.15);
          margin-bottom: 36px;
        }
        .inv-cell {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(201,169,110,0.1);
          border-right: 1px solid rgba(201,169,110,0.1);
        }
        .inv-cell:nth-child(even) { border-right: none; }
        .inv-cell:nth-last-child(-n+2) { border-bottom: none; }
        .inv-cell-label {
          font-size: 0.62rem;
          font-weight: 600;
          color: rgba(0,0,0,0.35);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .inv-cell-value {
          font-size: 0.85rem;
          color: #111;
          font-weight: 500;
          line-height: 1.4;
        }

        /* Amount */
        .inv-amount-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          border: 1px solid rgba(201,169,110,0.2);
          margin-bottom: 28px;
          position: relative;
          background: rgba(201,169,110,0.03);
        }
        .inv-amount-row::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: #c9a96e;
        }
        .inv-amount-lbl {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.35);
          margin-bottom: 6px;
        }
        .inv-amount-val {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 2.4rem;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .inv-amount-sub {
          font-size: 0.68rem;
          color: rgba(0,0,0,0.3);
          margin-top: 6px;
          font-style: italic;
        }
        .inv-plan-right { text-align: right; }
        .inv-plan-lbl {
          font-size: 0.62rem;
          color: rgba(0,0,0,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 5px;
        }
        .inv-plan-val {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 0.95rem;
          color: #1a1a1a;
          font-weight: 600;
          max-width: 200px;
          line-height: 1.4;
          text-align: right;
        }

        /* Note */
        .inv-note {
          border-left: 2px solid rgba(201,169,110,0.4);
          padding: 0 0 0 16px;
          margin-bottom: 0;
        }
        .inv-note p {
          font-size: 0.72rem;
          color: rgba(0,0,0,0.4);
          line-height: 1.7;
          font-style: italic;
        }
        .inv-note strong { color: #c9a96e; font-style: normal; font-weight: 600; }

        /* ── Footer ── */
        .inv-foot {
          padding: 20px 52px 28px;
          border-top: 1px solid rgba(201,169,110,0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .inv-foot-brand {
          font-family: var(--font-cinzel, 'Georgia', serif);
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.25);
        }
        .inv-foot-contact {
          font-size: 0.68rem;
          color: rgba(0,0,0,0.3);
          text-align: right;
          line-height: 1.7;
        }

        /* ── Print ── */
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background: #fff !important; margin: 0 !important; }
          .inv-page { display: block !important; padding: 0 !important; background: #fff !important; min-height: unset !important; }
          .inv-topbar { display: none !important; }
          .inv-sheet { box-shadow: none !important; border: none !important; max-width: 100% !important; width: 100% !important; }
        }

        @media (max-width: 600px) {
          .inv-head { padding: 32px 24px 24px; }
          .inv-body { padding: 28px 24px; }
          .inv-foot { padding: 16px 24px 24px; flex-direction: column; align-items: flex-start; }
          .inv-grid { grid-template-columns: 1fr; }
          .inv-cell { border-right: none; }
          .inv-cell:nth-last-child(-n+2) { border-bottom: 1px solid rgba(201,169,110,0.1); }
          .inv-cell:last-child { border-bottom: none; }
          .inv-head-row { flex-direction: column; gap: 16px; }
          .inv-right { text-align: left; }
          .inv-amount-row { flex-direction: column; gap: 20px; align-items: flex-start; }
          .inv-plan-right { text-align: left; }
          .inv-plan-val { text-align: left; }
        }
      `}</style>

      <div className="inv-page">

        {/* Top bar */}
        <div className="inv-topbar">
          <button onClick={() => router.back()} style={{
            background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
            padding: '8px 18px', cursor: 'pointer',
            fontSize: '0.78rem', fontWeight: 500, color: '#555',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>← Back</button>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {!approved && (
              <button onClick={handleApprove} style={{
                background: '#1a1a1a', border: 'none',
                padding: '9px 22px', cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 700, color: '#fff',
                letterSpacing: '0.04em',
              }}>✓ Approve</button>
            )}
            <a
              href={`https://wa.me/${order.phone.replace(/\D/g,'')}?text=${encodeURIComponent(
                `*FoodGenie — Subscription Invoice*\n\n` +
                `Invoice No: ${order.id}\n` +
                `Name: ${order.customer}\n` +
                `Plan: ${order.plan}\n` +
                `Meals: ${order.meals}\n` +
                `Start: ${order.startDate}  |  End: ${order.endDate}\n` +
                `Amount: ₹${order.amount.toLocaleString('en-IN')}\n` +
                `Status: ${order.status}\n` +
                `Approval: ${approved ? '✓ Approved' : '⏳ Pending'}\n\n` +
                `For queries: +91 99580 93268`
              )}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                background: '#25d366', border: 'none',
                padding: '9px 22px', cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 700, color: '#fff',
                letterSpacing: '0.04em', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 7,
              }}>
              <svg width="15" height="15" viewBox="0 0 32 32" fill="white">
                <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 2.888.756 5.708 2.192 8.188L0 32l7.594-2.164A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16.004C32 7.56 24.837.396 16 .396zm7.28 19.744c-.396-.198-2.34-1.158-2.704-1.29-.366-.132-.63-.198-.894.198-.264.396-1.026 1.29-1.258 1.554-.234.264-.462.297-.858.1-.396-.198-1.674-.618-3.188-1.972-1.178-1.05-1.974-2.346-2.206-2.742-.234-.396-.024-.61.174-.806.178-.176.396-.462.594-.694.198-.234.264-.396.396-.66.132-.264.066-.495-.033-.694-.1-.198-.894-2.156-1.224-2.956-.322-.774-.65-.67-.894-.682l-.762-.014c-.264 0-.694.1-1.058.495s-1.388 1.356-1.388 3.308c0 1.952 1.422 3.838 1.62 4.102.198.264 2.8 4.276 6.788 5.996.948.41 1.688.654 2.264.838.95.302 1.816.26 2.5.158.762-.114 2.34-.956 2.67-1.88.33-.924.33-1.716.23-1.88-.1-.165-.364-.264-.76-.462z"/>
              </svg>
              Share on WhatsApp
            </a>
            <button onClick={() => window.print()} style={{
              background: '#c9a96e', border: 'none',
              padding: '9px 22px', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, color: '#fff',
              letterSpacing: '0.04em',
            }}>Print / PDF</button>
          </div>
        </div>

        {/* Sheet */}
        <div className="inv-sheet">

          {/* Header */}
          <div className="inv-head">
            <div className="inv-head-row">
              <div>
                <p className="inv-eyebrow">Subscription Invoice</p>
                <h1 className="inv-brand">FoodGenie</h1>
                <p className="inv-tagline">Culinary Magic, Delivered</p>
              </div>
              <div className="inv-right">
                <p className="inv-inv-label">Invoice No.</p>
                <p className="inv-inv-id">{order.id}</p>
                <p className="inv-inv-date">Issued: {invoiceDate}</p>
              </div>
            </div>

            <div className="inv-ornament">
              <div className="inv-ornament-line" />
              <div className="inv-ornament-diamond" />
              <div className="inv-ornament-line" />
            </div>
          </div>

          {/* Body */}
          <div className="inv-body">

            {/* Status badges */}
            <p className="inv-section-label">Status</p>
            <div className="inv-badges">
              <span className="inv-badge" style={{
                color: approved ? '#16a34a' : '#b07d00',
                borderColor: approved ? '#16a34a' : '#b07d00',
                background: approved ? '#f0fdf4' : '#fffbeb',
              }}>
                {approved ? '✓ Approved' : '⏳ Pending Approval'}
              </span>
              <span className="inv-badge" style={{
                color: STATUS_COLOR[order.status],
                borderColor: STATUS_COLOR[order.status],
                background: STATUS_BG[order.status],
              }}>{order.status}</span>
            </div>

            {/* Details */}
            <p className="inv-section-label">Subscription Details</p>
            <div className="inv-grid">
              {[
                ['Customer',   order.customer],
                ['Phone',      order.phone],
                ['Email',      order.email],
                ['Address',    order.address],
                ['Plan',       order.plan],
                ['Plan Type',  (order as any).planType || 'Fixed'],
                ['Category',   order.category || '—'],
                ['Meals',      order.meals],
                ['Start Date', order.startDate],
                ['End Date',   order.endDate],
                ['Sub ID',     order.id],
              ].map(([label, value]) => (
                <div className="inv-cell" key={label}>
                  <p className="inv-cell-label">{label}</p>
                  <p className="inv-cell-value">{value}</p>
                </div>
              ))}
            </div>

            {/* Payment */}
            <p className="inv-section-label">Payment</p>
            <div className="inv-amount-row">
              <div>
                <p className="inv-amount-lbl">Total Amount</p>
                <p className="inv-amount-val">₹{order.amount.toLocaleString('en-IN')}</p>
                <p className="inv-amount-sub">Inclusive of all charges · GST as applicable</p>
              </div>
              <div className="inv-plan-right">
                <p className="inv-plan-lbl">Plan</p>
                <p className="inv-plan-val">{order.plan}</p>
              </div>
            </div>

            {/* Note */}
            <div className="inv-note">
              <p>
                This invoice is auto-generated by FoodGenie Admin. For queries contact us at{' '}
                <strong>+91 99580 93268</strong> or <strong>admin@foodgenie.com</strong>.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="inv-foot">
            <p className="inv-foot-brand">FoodGenie</p>
            <div className="inv-foot-contact">
              <p>+91 99580 93268 · admin@foodgenie.com</p>
              <p>Sector 57, Gurugram</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
