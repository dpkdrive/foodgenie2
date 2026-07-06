'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { authHeaders } from '@/lib/client-auth'

const gold  = '#c9a96e'
const green = '#2d4a28'

const STATUS_STYLE = {
  Pending:          { bg: '#f3e8ff', color: '#7c3aed' },
  Accepted:         { bg: '#dbeafe', color: '#1d4ed8' },
  Preparing:        { bg: '#fef9c3', color: '#ca8a04' },
  'Out for Delivery': { bg: '#ffedd5', color: '#ea580c' },
  Delivered:        { bg: '#dcfce7', color: '#16a34a' },
  Cancelled:        { bg: '#fee2e2', color: '#dc2626' },
}

const ALL_STATUSES = ['Pending', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled']

export default function SameDayInvoicePage() {
  const { id }   = useParams()
  const router   = useRouter()
  const [order,  setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    fetch(`/api/same-day/orders/${id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(r => { if (r.success) setOrder(r.data) })
      .finally(() => setLoading(false))
  }, [id])

  const handleAccept = async () => {
    setSaving(true)
    const res  = await fetch(`/api/same-day/orders/${id}/accept`, { method: 'POST', headers: authHeaders() })
    const data = await res.json()
    if (data.success) setOrder(data.data)
    setSaving(false)
  }

  const handleStatus = async status => {
    setSaving(true)
    const res  = await fetch(`/api/same-day/orders/${id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) setOrder(data.data)
    setSaving(false)
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading…</div>
  if (!order)  return <div style={{ padding: 60, textAlign: 'center', color: 'rgba(0,0,0,0.5)' }}>Order not found.</div>

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const st = STATUS_STYLE[order.status] ?? { bg: '#f3f4f6', color: '#6b7280' }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      {/* Actions bar */}
      <div className="no-print" style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.15)', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>← Back</button>
        <div style={{ flex: 1 }} />
        {order.status === 'Pending' && (
          <button onClick={handleAccept} disabled={saving}
            style={{ background: green, color: '#fff', border: 'none', padding: '8px 20px', fontSize: '0.8rem', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
            ✓ Accept Order
          </button>
        )}
        <select value={order.status} onChange={e => handleStatus(e.target.value)} disabled={saving}
          style={{ border: `1px solid ${st.color}`, background: st.bg, color: st.color, padding: '8px 12px', fontSize: '0.8rem', cursor: 'pointer', outline: 'none', fontWeight: 600 }}>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => window.print()} style={{ background: gold, color: '#fff', border: 'none', padding: '8px 20px', fontSize: '0.8rem', cursor: 'pointer' }}>Print Invoice</button>
      </div>

      {/* Invoice */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', maxWidth: 760, margin: '0 auto', padding: '40px 48px' }}>

        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, borderBottom: '2px solid #f0ece4', paddingBottom: 28 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-cinzel, serif)', fontSize: '1.4rem', letterSpacing: '0.18em', color: green, margin: 0 }}>FoodGenie</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0', letterSpacing: '0.06em' }}>Same Day Delivery Invoice</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: '2px 0 0' }}>Sector 57, Gurugram</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 700, color: gold, margin: 0, letterSpacing: '0.06em' }}>{order.orderId}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0' }}>{invoiceDate}</p>
            <span style={{ ...st, display: 'inline-block', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, marginTop: 8 }}>{order.status}</span>
          </div>
        </div>

        {/* Customer + Delivery */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 600 }}>Bill To</p>
            <p style={{ fontWeight: 600, color: '#111', margin: 0 }}>{order.customer.name}</p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.55)', margin: '4px 0 0' }}>{order.customer.phone}</p>
            {order.customer.email && <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.55)', margin: '2px 0 0' }}>{order.customer.email}</p>}
            <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.55)', margin: '4px 0 0' }}>{order.customer.address}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 600 }}>Delivery Details</p>
            <p style={{ fontSize: '0.82rem', margin: 0 }}><span style={{ color: 'rgba(0,0,0,0.4)' }}>Timing: </span><strong>{order.timing}</strong></p>
            <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}><span style={{ color: 'rgba(0,0,0,0.4)' }}>Payment: </span><strong>{order.paymentMethod}</strong></p>
            <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}><span style={{ color: 'rgba(0,0,0,0.4)' }}>Pay Status: </span><strong style={{ color: order.paymentStatus === 'Paid' ? '#16a34a' : order.paymentStatus === 'Failed' ? '#dc2626' : '#ca8a04' }}>{order.paymentStatus}</strong></p>
            {order.transactionId && <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0', fontFamily: 'monospace' }}>Txn: {order.transactionId}</p>}
            {order.acceptedAt && <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0' }}>Accepted: {new Date(order.acceptedAt).toLocaleString('en-IN')}</p>}
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#f8f5f0', borderBottom: '1px solid #e8e0d0' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>#</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Item</th>
              <th style={{ padding: '10px 14px', textAlign: 'center', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Qty</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0ece4' }}>
                <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'rgba(0,0,0,0.4)' }}>{i + 1}</td>
                <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: 500, color: '#111' }}>{item.title}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.85rem', color: '#333' }}>{item.quantity}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.85rem', color: '#333' }}>₹{item.price.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: green }}>₹{item.subtotal.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <div style={{ width: 260 }}>
            <Row label="Subtotal" value={`₹${order.subtotal.toLocaleString('en-IN')}`} />
            <Row label="GST & Other Taxes" value={`₹${(order.gst ?? 0).toLocaleString('en-IN')}`} />
            <Row label="Delivery Fee" value={order.deliveryFee ? `₹${order.deliveryFee.toLocaleString('en-IN')}` : 'Free'} />
            <div style={{ borderTop: '2px solid #f0ece4', marginTop: 8, paddingTop: 10 }}>
              <Row label="Total" value={`₹${order.total.toLocaleString('en-IN')}`} bold />
            </div>
          </div>
        </div>

        {order.notes && (
          <div style={{ background: '#fafaf9', border: '1px solid #f0ece4', padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)', margin: '0 0 4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Notes</p>
            <p style={{ fontSize: '0.82rem', color: '#333', margin: 0 }}>{order.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #f0ece4', paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.35)', margin: 0, letterSpacing: '0.06em' }}>Thank you for choosing FoodGenie — Same Day Delivery</p>
          <p style={{ fontSize: '0.68rem', color: 'rgba(0,0,0,0.3)', margin: '4px 0 0' }}>+91 99580 93268 · foodgenie.in</p>
        </div>
      </div>
    </>
  )
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.82rem' }}>
      <span style={{ color: 'rgba(0,0,0,0.5)' }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: bold ? green : '#333' }}>{value}</span>
    </div>
  )
}
