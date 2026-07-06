'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

const PAY_STYLE = {
  Paid:    { bg: '#dcfce7', color: '#16a34a' },
  Pending: { bg: '#fef9c3', color: '#ca8a04' },
  Failed:  { bg: '#fee2e2', color: '#dc2626' },
}

export default function SameDayOrdersAdmin() {
  const router = useRouter()
  const [orders,   setOrders]   = useState([])
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [statusF,  setStatusF]  = useState('')
  const [page,     setPage]     = useState(1)
  const [total,    setTotal]    = useState(0)
  const LIMIT = 20

  const load = (p = 1) => {
    setLoading(true)
    const q = new URLSearchParams({ page: String(p), limit: String(LIMIT) })
    if (statusF) q.set('status', statusF)
    if (search)  q.set('search', search)
    fetch(`/api/same-day/orders?${q}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(r => { if (r.success) { setOrders(r.data); setTotal(r.total) } })
      .finally(() => setLoading(false))
  }

  const loadStats = () => {
    fetch('/api/same-day/orders?stats=true', { headers: authHeaders() })
      .then(r => r.json())
      .then(r => { if (r.success) setStats(r.data) })
  }

  useEffect(() => { load(1); setPage(1); loadStats() }, [statusF])

  const handleSearch = e => { e.preventDefault(); setPage(1); load(1) }

  const handleAccept = async (id) => {
    const res  = await fetch(`/api/same-day/orders/${id}/accept`, { method: 'POST', headers: authHeaders() })
    const data = await res.json()
    if (data.success) load(page)
    else alert(data.message)
  }

  const handleStatus = async (id, status) => {
    const res  = await fetch(`/api/same-day/orders/${id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) load(page)
    else alert(data.message)
  }

  const handleMarkPaid = async (id) => {
    if (!confirm('Mark this order as Paid?')) return
    const res  = await fetch(`/api/same-day/orders/${id}`, {
      method: 'PATCH',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus: 'Paid' }),
    })
    const data = await res.json()
    if (data.success) load(page)
    else alert(data.message)
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-cinzel, serif)', fontSize: '1.35rem', letterSpacing: '0.12em', color: green, margin: 0 }}>SAME DAY ORDERS</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(0,0,0,0.4)', margin: '4px 0 0' }}>Manage and track same-day delivery orders</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total',          value: stats.total,          color: gold },
            { label: 'Pending',        value: stats.pending,        color: '#7c3aed' },
            { label: 'Accepted',       value: stats.accepted,       color: '#1d4ed8' },
            { label: 'Out for Del.',   value: stats.outForDelivery, color: '#ea580c' },
            { label: 'Delivered',      value: stats.delivered,      color: '#16a34a' },
            { label: 'Revenue',        value: '₹' + (stats.revenue ?? 0).toLocaleString('en-IN'), color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', padding: '14px 16px' }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: s.color, margin: '4px 0 0' }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, order ID…"
            style={{ flex: 1, border: '1px solid rgba(0,0,0,0.12)', background: '#fff', padding: '8px 12px', fontSize: '0.82rem', outline: 'none' }} />
          <button type="submit" style={{ background: green, color: '#fff', border: 'none', padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer' }}>Search</button>
        </form>
        <select value={statusF} onChange={e => setStatusF(e.target.value)}
          style={{ border: '1px solid rgba(0,0,0,0.12)', background: '#fff', padding: '8px 12px', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}>
          <option value="">All Status</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafaf9' }}>
              {['Order ID', 'Customer', 'Items', 'Timing', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontFamily: 'var(--font-cinzel, serif)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(0,0,0,0.4)', fontWeight: 600, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>Loading…</td></tr>
            )}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: 'rgba(0,0,0,0.3)' }}>No orders found</td></tr>
            )}
            {orders.map((o, i) => (
              <tr key={o._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: i % 2 === 0 ? '#fff' : '#fafaf9' }}>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)' }}>{o.orderId}</td>
                <td style={{ padding: '12px 14px' }}>
                  <p style={{ margin: 0, fontWeight: 500, color: '#111' }}>{o.customer.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'rgba(0,0,0,0.45)' }}>{o.customer.phone}</p>
                </td>
                <td style={{ padding: '12px 14px', color: 'rgba(0,0,0,0.6)' }}>
                  {o.items.map((it, idx) => (
                    <p key={idx} style={{ margin: idx === 0 ? 0 : '2px 0 0', fontSize: '0.78rem' }}>{it.title} × {it.quantity}</p>
                  ))}
                </td>
                <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'rgba(0,0,0,0.55)', whiteSpace: 'nowrap' }}>{o.timing}</td>
                <td style={{ padding: '12px 14px', fontWeight: 600, color: green }}>₹{o.total.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span style={{ ...PAY_STYLE[o.paymentStatus], padding: '3px 10px', fontSize: '0.72rem', fontWeight: 500 }}>{o.paymentStatus}</span>
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <select value={o.status}
                    onChange={e => handleStatus(o._id, e.target.value)}
                    style={{ border: `1px solid ${STATUS_STYLE[o.status]?.color ?? '#ccc'}`, background: STATUS_STYLE[o.status]?.bg ?? '#fff', color: STATUS_STYLE[o.status]?.color ?? '#333', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', outline: 'none', fontWeight: 500 }}>
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'rgba(0,0,0,0.45)', whiteSpace: 'nowrap' }}>
                  {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                    {o.status === 'Pending' && (
                      <button onClick={() => handleAccept(o._id)}
                        style={{ background: green, color: '#fff', border: 'none', padding: '5px 12px', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Accept
                      </button>
                    )}
                    {o.paymentStatus !== 'Paid' && (
                      <button onClick={() => handleMarkPaid(o._id)}
                        style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '5px 12px', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        Mark Paid
                      </button>
                    )}
                    <button onClick={() => router.push(`/admin/same-day/orders/${o._id}`)}
                      style={{ background: 'none', border: '1px solid rgba(0,0,0,0.15)', padding: '5px 12px', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Invoice
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          <button disabled={page <= 1} onClick={() => { setPage(p => p - 1); load(page - 1) }}
            style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#fff', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>
            ← Prev
          </button>
          <span style={{ padding: '6px 14px', fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); load(page + 1) }}
            style={{ border: '1px solid rgba(0,0,0,0.15)', background: '#fff', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', opacity: page >= totalPages ? 0.4 : 1 }}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
