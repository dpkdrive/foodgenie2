'use client'
import { useState, useEffect } from 'react'
import { authHeaders } from '@/lib/client-auth'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const gold  = '#c9a96e'
const green = '#2d4a28'

const PIE_COLORS = [gold, '#f59e0b', '#3b82f6', '#ef4444']

const STATUS_STYLE = {
  Pending:   { bg: '#f3e8ff', color: '#7c3aed' },
  Active:    { bg: '#dcfce7', color: '#16a34a' },
  Paused:    { bg: '#fef9c3', color: '#ca8a04' },
  Completed: { bg: '#e0f2fe', color: '#0369a1' },
  Cancelled: { bg: '#fee2e2', color: '#dc2626' },
}


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#111' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ margin: '2px 0', color: p.color }}>
          {p.name === 'revenue' ? '₹' + p.value.toLocaleString('en-IN') : p.value}
          {' '}<span style={{ color: 'rgba(0,0,0,0.4)' }}>{p.name}</span>
        </p>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const [stats,     setStats]     = useState(null)
  const [recent,    setRecent]    = useState([])
  const [monthly,   setMonthly]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [dateFrom,  setDateFrom]  = useState('')
  const [dateTo,    setDateTo]    = useState('')
  const [dateField, setDateField] = useState('startDate')

  const clearDates = () => { setDateFrom(''); setDateTo('') }

  useEffect(() => {
    const headers = authHeaders()
    setLoading(true)

    const dateParams = new URLSearchParams({ dateField })
    if (dateFrom) dateParams.set('dateFrom', dateFrom)
    if (dateTo)   dateParams.set('dateTo',   dateTo)
    const dq = dateParams.toString()

    Promise.all([
      fetch(`/api/subscriptions?stats=true&${dq}`, { headers }).then(r => r.json()),
      fetch(`/api/subscriptions?limit=5&sortBy=createdAt&order=desc&${dq}`, { headers }).then(r => r.json()),
      fetch(`/api/subscriptions?monthly=true&${dq}`, { headers }).then(r => r.json()),
    ]).then(([statsRes, recentRes, monthlyRes]) => {
      if (statsRes.success)   setStats(statsRes.data)
      if (recentRes.success)  setRecent(recentRes.data)
      if (monthlyRes.success) setMonthly(monthlyRes.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [dateFrom, dateTo, dateField])

  const STATS_CARDS = stats ? [
    { label: 'Total Subscriptions', value: stats.total,     sub: 'All time',       accent: gold   },
    { label: 'Active',              value: stats.active,    sub: 'Running now',    accent: '#16a34a' },
    { label: 'Completed',           value: stats.completed, sub: 'Finished',       accent: '#0369a1' },
    { label: 'Revenue',             value: '₹' + stats.revenue.toLocaleString('en-IN'), sub: 'Total collected', accent: '#7c3aed' },
  ] : []

  const pieData = stats ? [
    { name: 'Active',    value: stats.active    },
    { name: 'Paused',    value: stats.paused    },
    { name: 'Completed', value: stats.completed },
    { name: 'Cancelled', value: stats.cancelled },
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-grid-2fr { grid-template-columns: 1fr !important; }
          .admin-grid-half { grid-template-columns: 1fr !important; }
          .admin-title-row { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .admin-filter-bar { flex-direction: column !important; align-items: flex-start !important; }
          .admin-filter-bar input[type="date"] { width: 100%; }
          .admin-filter-bar select { width: 100%; }
        }
      `}</style>

      {/* Page title */}
      <div className="admin-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 3px', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.04em' }}>Dashboard</h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>Welcome back, Admin · FoodGenie</p>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '6px 14px' }}>
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Date filter bar */}
      <div className="admin-filter-bar" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: '12px 18px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Filter By</span>

        <select
          value={dateField}
          onChange={e => setDateField(e.target.value)}
          style={{ padding: '7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.78rem', color: '#111', outline: 'none', background: '#fff', cursor: 'pointer' }}>
          <option value="startDate">Start Date</option>
          <option value="createdAt">Created At</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>From</span>
          <input
            type="date" value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            style={{ padding: '7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.78rem', color: '#111', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }}>To</span>
          <input
            type="date" value={dateTo} min={dateFrom}
            onChange={e => setDateTo(e.target.value)}
            style={{ padding: '7px 10px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: '0.78rem', color: '#111', outline: 'none', cursor: 'pointer' }}
          />
        </div>

        {(dateFrom || dateTo) && (
          <button onClick={clearDates}
            style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
            ✕ Clear
          </button>
        )}

        {(dateFrom || dateTo) && (
          <span style={{ fontSize: '0.72rem', color: gold, fontWeight: 600, marginLeft: 4 }}>
            {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : dateFrom ? `From ${dateFrom}` : `Until ${dateTo}`}
          </span>
        )}

        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'rgba(0,0,0,0.3)' }}>
          {(dateFrom || dateTo) ? 'Filtered results' : 'All time'}
        </span>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '20px', height: 100, opacity: 0.5 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {STATS_CARDS.map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '14px 14px 0 0' }} />
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: '1.9rem', fontWeight: 800, color: s.accent, margin: '0 0 2px', lineHeight: 1, fontFamily: 'var(--font-cinzel), serif' }}>{s.value}</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.35)', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts row 1 */}
      <div className="admin-grid-2fr" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '20px 20px 14px' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>Revenue Overview</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: '0 0 14px' }}>Monthly revenue (₹) · live data</p>
          {loading ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.8rem' }}>Loading...</div>
          ) : monthly.length === 0 ? (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.8rem' }}>No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={gold} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} tickFormatter={v => '₹' + v / 1000 + 'k'} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke={gold} strokeWidth={2.5} fill="url(#goldGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '20px 20px 14px' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>Status Breakdown</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: '0 0 14px' }}>All subscriptions</p>
          {!loading && (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 10px', marginTop: 8 }}>
                {pieData.map((s, i) => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.5)' }}>{s.name} <strong style={{ color: '#111' }}>{s.value}</strong></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="admin-grid-half" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '20px 20px 14px' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>New Subscriptions</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: '0 0 14px' }}>Monthly count · live data</p>
          {loading ? (
            <div style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.8rem' }}>Loading...</div>
          ) : monthly.length === 0 ? (
            <div style={{ height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '0.8rem' }}>No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'rgba(0,0,0,0.4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="subscriptions" fill={gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent subscriptions summary */}
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: '20px' }}>
          <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>Quick Stats</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: '0 0 16px' }}>Live from database</p>
          {loading ? <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Loading...</p> : stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Pending Approval', value: stats.total - (stats.approved ?? 0), color: '#ca8a04' },
                { label: 'Paused',           value: stats.paused,    color: '#6b7280' },
                { label: 'Cancelled',        value: stats.cancelled, color: '#dc2626' },
                { label: 'Total Revenue',    value: '₹' + stats.revenue.toLocaleString('en-IN'), color: green },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.55)' }}>{r.label}</span>
                  <span style={{ fontWeight: 700, color: r.color, fontSize: '0.88rem' }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent subscriptions table */}
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111', margin: '0 0 2px' }}>Recent Subscriptions</p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.4)', margin: 0 }}>Latest 5 entries</p>
          </div>
          <a href="/admin/orders" style={{ fontSize: '0.78rem', color: gold, textDecoration: 'none', fontWeight: 600, border: `1px solid ${gold}`, padding: '6px 14px', borderRadius: 6 }}>View all →</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Sub ID', 'Customer', 'Plan', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 18px', textAlign: 'left', fontWeight: 600, color: 'rgba(0,0,0,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(0,0,0,0.05)', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '0.83rem' }}>Loading...</td></tr>
              ) : recent.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#aaa', fontSize: '0.83rem' }}>No subscriptions yet</td></tr>
              ) : recent.map((o, i) => (
                <tr key={o._id} style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                  <td style={{ padding: '13px 18px', color: gold, fontWeight: 700, fontSize: '0.78rem' }}>{o.subscriptionId}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#111', fontSize: '0.82rem' }}>{o.customer?.name}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'rgba(0,0,0,0.4)' }}>{o.customer?.phone}</p>
                  </td>
                  <td style={{ padding: '13px 18px', color: 'rgba(0,0,0,0.6)', fontSize: '0.8rem' }}>{o.plan}</td>
                  <td style={{ padding: '13px 18px', fontWeight: 700, color: '#111' }}>₹{o.amount?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ background: STATUS_STYLE[o.status]?.bg, color: STATUS_STYLE[o.status]?.color, padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
