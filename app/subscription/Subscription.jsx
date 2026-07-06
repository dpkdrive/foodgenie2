'use client'
import { useState } from 'react'
import Link from 'next/link'

/* ── MOCK DATA ── */
const USER = {
  name:    'Priya Sharma',
  email:   'priya.sharma@gmail.com',
  phone:   '+91 98765 43210',
  address: 'B-204, Sector 62, Noida, Uttar Pradesh — 201309',
  joined:  'March 2024',
  avatar:  'P',
}

const SUBSCRIPTIONS = [
  {
    id: 'FG-2024-0041',
    status: 'active',
    plan: '28 Days Plan',
    diet: '🌿 Vegetarian',
    meals: 'Breakfast + Lunch + Dinner',
    startDate: '01 Mar 2026',
    endDate:   '28 Mar 2026',
    daysLeft: 8,
    totalDays: 28,
    amount: '₹19,725',
    delivery: 'B-204, Sector 62, Noida',
    menu: 'Balanced Food',
  },
  {
    id: 'FG-2024-0039',
    status: 'active',
    plan: '7 Days Plan',
    diet: '🍗 Non-Vegetarian',
    meals: 'Lunch + Dinner',
    startDate: '18 Mar 2026',
    endDate:   '24 Mar 2026',
    daysLeft: 2,
    totalDays: 7,
    amount: '₹5,402',
    delivery: 'Office: Sector 18, Noida',
    menu: 'Low Calorie & High Protein',
  },
  {
    id: 'FG-2024-0035',
    status: 'pending',
    plan: 'Custom Plan — 5 Days',
    diet: '🥚 Eggetarian',
    meals: 'Breakfast + Lunch + Dinner',
    startDate: '01 Apr 2026',
    endDate:   '05 Apr 2026',
    daysLeft: null,
    totalDays: 5,
    amount: '₹3,542',
    delivery: 'B-204, Sector 62, Noida',
    menu: 'Balanced Food',
    pendingNote: 'Payment confirmation awaited. Please complete your payment to activate this plan.',
  },
  {
    id: 'FG-2024-0028',
    status: 'expired',
    plan: '28 Days Plan',
    diet: '🌿 Vegetarian',
    meals: 'Breakfast + Lunch + Dinner',
    startDate: '01 Jan 2026',
    endDate:   '28 Jan 2026',
    daysLeft: 0,
    totalDays: 28,
    amount: '₹19,725',
    delivery: 'B-204, Sector 62, Noida',
    menu: 'Balanced Food',
  },
  {
    id: 'FG-2024-0021',
    status: 'expired',
    plan: '7 Days Plan',
    diet: '🍗 Non-Vegetarian',
    meals: 'Breakfast + Lunch + Dinner',
    startDate: '10 Dec 2025',
    endDate:   '16 Dec 2025',
    daysLeft: 0,
    totalDays: 7,
    amount: '₹5,402',
    delivery: 'B-204, Sector 62, Noida',
    menu: 'Low Calorie & High Protein',
  },
]

/* ── STATUS CONFIG ── */
const STATUS = {
  active: {
    label: 'Active',
    bg: 'bg-[#dcfce7]',
    text: 'text-[#15803d]',
    dot: 'bg-[#22c55e]',
    border: 'border-[#bbf7d0]',
    headerBg: 'bg-gradient-to-r from-[#f0fdf4] to-[#dcfce7]',
    accentBar: 'from-[#303d2b] via-[#6b8f5e] to-[#d4a055]',
    cardBorder: 'border-[#86efac]',
    cardShadow: 'shadow-[0_4px_32px_rgba(34,197,94,0.12)]',
  },
  pending: {
    label: 'Pending Payment',
    bg: 'bg-[#fef9c3]',
    text: 'text-[#a16207]',
    dot: 'bg-[#eab308]',
    border: 'border-[#fef08a]',
    headerBg: 'bg-gradient-to-r from-[#fefce8] to-[#fef9c3]',
    accentBar: 'from-[#eab308] via-[#ca8a04] to-[#d97706]',
    cardBorder: 'border-[#fde68a]',
    cardShadow: 'shadow-[0_4px_32px_rgba(234,179,8,0.10)]',
  },
  expired: {
    label: 'Expired',
    bg: 'bg-[#f3f4f6]',
    text: 'text-[#6b7280]',
    dot: 'bg-[#9ca3af]',
    border: 'border-[#e5e7eb]',
    headerBg: 'bg-[var(--cream)]',
    accentBar: 'from-[#d1d5db] via-[#9ca3af] to-[#6b7280]',
    cardBorder: 'border-[var(--border)]',
    cardShadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
  },
}

/* ── PROGRESS BAR ── */
function ProgressBar({ daysLeft, totalDays }) {
  const completed = totalDays - daysLeft
  const pct = Math.round((completed / totalDays) * 100)
  const isUrgent = daysLeft <= 3

  return (
    <div className="mt-1">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.7rem] text-[var(--text-muted)]">
          {completed} of {totalDays} days completed
        </span>
        <span className={`text-[0.72rem] font-bold tabular-nums px-2.5 py-0.5 rounded-full border ${
          isUrgent
            ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
            : 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
        }`}>
          {isUrgent ? '⚡ ' : ''}{daysLeft} days left
        </span>
      </div>
      <div className="h-2 bg-[var(--cream2)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isUrgent
              ? 'linear-gradient(90deg,#dc2626,#f87171)'
              : 'linear-gradient(90deg,#303d2b,#6b8f5e)',
          }}
        />
      </div>
    </div>
  )
}

/* ── MEAL TIMELINE ── */
function MealTimeline({ meals }) {
  const allMeals = ['Breakfast', 'Lunch', 'Dinner']
  const activeMeals = meals.split('+').map(m => m.trim())
  const icons = { Breakfast: '☀️', Lunch: '🌤️', Dinner: '🌙' }
  const times = { Breakfast: '8–9 AM', Lunch: '12–1 PM', Dinner: '7–8 PM' }

  return (
    <div className="flex items-center gap-0">
      {allMeals.map((meal, i) => {
        const isIncluded = activeMeals.some(a => a.includes(meal))
        const nextIncluded = i < 2 && activeMeals.some(a => a.includes(allMeals[i + 1]))
        return (
          <div key={meal} className="flex items-center flex-1">
            <div className={`flex flex-col items-center flex-1 transition-opacity ${isIncluded ? 'opacity-100' : 'opacity-25'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 ${
                isIncluded
                  ? 'bg-white border-[var(--green)] shadow-[0_2px_8px_rgba(48,61,43,0.12)]'
                  : 'bg-[var(--cream2)] border-[var(--border)]'
              }`}>
                {icons[meal]}
              </div>
              <div className={`text-[0.62rem] font-bold mt-1.5 ${isIncluded ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}`}>
                {meal}
              </div>
              <div className="text-[0.58rem] text-[var(--text-muted)] mt-0.5">{times[meal]}</div>
            </div>
            {i < 2 && (
              <div className={`h-[2px] w-5 flex-shrink-0 mx-[-6px] mb-6 rounded-full ${
                isIncluded && nextIncluded ? 'bg-[var(--green)]' : 'bg-[var(--border)]'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── ORDER CARD ── */
function SubCard({ sub, onRenew }) {
  const [expanded, setExpanded] = useState(false)
  const s = STATUS[sub.status]
  const isActive  = sub.status === 'active'
  const isPending = sub.status === 'pending'
  const isExpired = sub.status === 'expired'
  const isUrgent  = isActive && sub.daysLeft !== null && sub.daysLeft <= 5

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${s.cardBorder} ${s.cardShadow} ${isExpired ? 'opacity-70 hover:opacity-100' : ''}`}>

      {/* Accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${s.accentBar}`} />

      {/* Card header */}
      <div className={`${s.headerBg} px-5 pt-4 pb-4 border-b border-[var(--border)]`}>
        <div className="flex items-start justify-between gap-4">

          {/* Left: Plan info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-playfair text-[1.05rem] font-bold text-[var(--green)] leading-tight">
                {sub.plan}
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[0.65rem] font-bold border whitespace-nowrap ${s.bg} ${s.text} ${s.border}`}>
                <span className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${s.dot} ${isActive ? 'animate-pulse' : ''}`} />
                {s.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[0.68rem] text-[var(--text-muted)] font-mono tracking-wider">#{sub.id}</span>
              <span className="text-[var(--border)] select-none">·</span>
              <span className="text-[0.7rem] text-[var(--text-muted)]">{sub.diet}</span>
              <span className="text-[var(--border)] select-none">·</span>
              <span className="text-[0.7rem] text-[var(--text-muted)]">📋 {sub.menu}</span>
            </div>
          </div>

          {/* Right: Amount */}
          <div className="text-right flex-shrink-0">
            <div className="font-playfair text-[1.3rem] font-bold text-[var(--green)] leading-none">{sub.amount}</div>
            <div className="text-[0.62rem] text-[var(--text-muted)] mt-1 uppercase tracking-wide font-medium">Total Paid</div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-white px-5 pt-4 pb-5">

        {/* Date range */}
        <div className="flex items-center gap-2 bg-[var(--cream)] rounded-xl px-4 py-3 border border-[var(--border)]">
          <div className="text-center flex-shrink-0">
            <div className="text-[0.58rem] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">Start Date</div>
            <div className="text-[0.82rem] font-bold text-[var(--text-mid)]">{sub.startDate}</div>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-2">
            <div className="flex-1 border-t-2 border-dashed border-[var(--border)]" />
            <span className="text-[0.62rem] text-[var(--text-muted)] bg-white border border-[var(--border)] px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">
              {sub.totalDays} days
            </span>
            <div className="flex-1 border-t-2 border-dashed border-[var(--border)]" />
          </div>
          <div className="text-center flex-shrink-0">
            <div className="text-[0.58rem] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-0.5">End Date</div>
            <div className="text-[0.82rem] font-bold text-[var(--text-mid)]">{sub.endDate}</div>
          </div>
        </div>

        {/* Progress bar — active only */}
        {isActive && sub.daysLeft !== null && (
          <div className="mt-3">
            <ProgressBar daysLeft={sub.daysLeft} totalDays={sub.totalDays} />
          </div>
        )}

        {/* Delivery address */}
        <div className="mt-3 flex items-center gap-2 bg-[var(--cream)] border border-[var(--border)] rounded-xl px-3.5 py-2.5">
          <span className="text-sm flex-shrink-0">📍</span>
          <div className="min-w-0">
            <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-wide">Delivery Address</div>
            <div className="text-[0.78rem] font-medium text-[var(--text-mid)] mt-0.5 truncate">{sub.delivery}</div>
          </div>
        </div>

        {/* Meal timeline */}
        <div className="mt-4 px-1">
          <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Daily Meals Included</div>
          <MealTimeline meals={sub.meals} />
        </div>

        {/* Urgent renewal banner */}
        {isUrgent && (
          <div className="mt-4 flex items-center gap-3 bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-4 py-3">
            <span className="text-base flex-shrink-0">🔔</span>
            <div className="flex-1 min-w-0">
              <p className="text-[0.76rem] font-bold text-[#c2410c]">
                Only {sub.daysLeft} day{sub.daysLeft !== 1 ? 's' : ''} remaining!
              </p>
              <p className="text-[0.7rem] text-[#ea580c] mt-0.5">
                Renew your plan before it expires to avoid any break in service.
              </p>
            </div>
            <button
              onClick={() => onRenew(sub)}
              className="flex-shrink-0 text-[0.72rem] font-bold bg-[#ea580c] text-white px-3.5 py-2 rounded-lg border-none cursor-pointer transition-all hover:bg-[#c2410c] hover:-translate-y-0.5"
              style={{ fontFamily: 'Inter,sans-serif' }}>
              Renew Now →
            </button>
          </div>
        )}

        {/* Pending payment banner */}
        {isPending && (
          <div className="mt-4 flex items-start gap-3 bg-[#fefce8] border border-[#fef08a] rounded-xl px-4 py-3">
            <span className="text-base flex-shrink-0 mt-0.5">⏳</span>
            <div>
              <p className="text-[0.76rem] font-bold text-[#92400e]">Payment Pending</p>
              <p className="text-[0.72rem] text-[#a16207] mt-0.5 leading-[1.6]">{sub.pendingNote}</p>
            </div>
          </div>
        )}

        {/* Expandable order details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Full Order Details</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                ['🔖', 'Order ID',        sub.id],
                ['📅', 'Duration',        `${sub.totalDays} Days`],
                ['🍳', 'Meals per Day',   `${sub.meals.split('+').length} meals`],
                ['📍', 'Delivery To',     sub.delivery],
                ['📋', 'Menu Type',       sub.menu],
                ['🌿', 'Diet Preference', sub.diet.slice(3)],
              ].map(([icon, label, val]) => (
                <div key={label} className="bg-[var(--cream)] rounded-xl px-3.5 py-3 border border-[var(--border)]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">{icon}</span>
                    <div className="text-[0.6rem] font-bold text-[var(--text-muted)] uppercase tracking-[0.07em]">{label}</div>
                  </div>
                  <div className="text-[0.78rem] font-semibold text-[var(--text-mid)] leading-tight">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)] flex-wrap gap-2">
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 text-[0.76rem] font-semibold text-[var(--text-muted)] hover:text-[var(--green)] transition-colors cursor-pointer bg-transparent border-none p-0"
            style={{ fontFamily: 'Inter,sans-serif' }}>
            <span className="w-5 h-5 rounded-full bg-[var(--cream2)] border border-[var(--border)] flex items-center justify-center text-[0.58rem]">
              {expanded ? '▲' : '▼'}
            </span>
            {expanded ? 'Hide Details' : 'View Full Details'}
          </button>

          <div className="flex items-center gap-2">
            {isActive && (
              <button
                className="text-[0.74rem] font-semibold text-[var(--text-muted)] bg-[var(--cream2)] border border-[var(--border)] px-3.5 py-2 rounded-lg cursor-pointer transition-all hover:border-[#f87171] hover:text-[#dc2626] hover:bg-[#fef2f2]"
                style={{ fontFamily: 'Inter,sans-serif' }}>
                ⏸ Pause Delivery
              </button>
            )}
            {isPending && (
              <button
                onClick={() => onRenew(sub)}
                className="inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-5 py-2.5 rounded-xl border-none cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(234,179,8,0.4)]"
                style={{ background: 'linear-gradient(135deg,#eab308,#ca8a04)', color: 'white', fontFamily: 'Inter,sans-serif' }}>
                💳 Complete Payment
              </button>
            )}
            {isExpired && (
              <button
                onClick={() => onRenew(sub)}
                className="inline-flex items-center gap-1.5 text-[0.78rem] font-bold bg-[var(--green)] text-[var(--cream)] px-5 py-2.5 rounded-xl border-none cursor-pointer transition-all hover:bg-[var(--green-mid)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(48,61,43,0.25)]"
                style={{ fontFamily: 'Inter,sans-serif' }}>
                ↻ Reorder This Plan
              </button>
            )}
            {isActive && (
              <button
                onClick={() => onRenew(sub)}
                className="inline-flex items-center gap-1.5 text-[0.78rem] font-bold bg-[var(--green)] text-[var(--cream)] px-5 py-2.5 rounded-xl border-none cursor-pointer transition-all hover:bg-[var(--green-mid)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(48,61,43,0.25)]"
                style={{ fontFamily: 'Inter,sans-serif' }}>
                ↻ Renew Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN ACCOUNT PAGE
══════════════════════════════════════════ */
export default function AccountPage() {
  const [activeTab,  setActiveTab]  = useState('all')
  const [editMode,   setEditMode]   = useState(false)
  const [profile,    setProfile]    = useState(USER)
  const [draft,      setDraft]      = useState(USER)
  const [toast,      setToast]      = useState('')
  const [renewModal, setRenewModal] = useState(null)

  console.log("activeTab",activeTab)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const TABS = [
    { key: 'all',     label: 'All Orders', count: SUBSCRIPTIONS.length },
    { key: 'active',  label: 'Active',     count: SUBSCRIPTIONS.filter(s => s.status === 'active').length },
    { key: 'pending', label: 'Pending',    count: SUBSCRIPTIONS.filter(s => s.status === 'pending').length },
    { key: 'expired', label: 'Expired',    count: SUBSCRIPTIONS.filter(s => s.status === 'expired').length },
  ]

  const filtered = activeTab === 'all'
    ? SUBSCRIPTIONS
    : SUBSCRIPTIONS.filter(s => s.status === activeTab)

  const saveProfile = () => {
    setProfile(draft)
    setEditMode(false)
    showToast('✅ Profile updated successfully!')
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[999] bg-[var(--green)] text-[var(--cream)] px-6 py-3 rounded-full text-[0.84rem] font-semibold shadow-xl animate-fade-down">
          {toast}
        </div>
      )}

      {/* Renew / Pay Modal */}
      {renewModal && (
        <div
          className="fixed inset-0 z-[500] bg-[rgba(28,38,24,0.6)] backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setRenewModal(null)}>
          <div
            className="bg-white rounded-2xl max-w-[420px] w-full shadow-[0_24px_80px_rgba(0,0,0,0.3)] overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="h-1" style={{ background: 'linear-gradient(90deg,#303d2b,#d4a055)' }} />
            <div className="p-7">
              <div className="font-playfair text-xl font-bold text-[var(--green)] mb-2">
                {renewModal.status === 'pending' ? '💳 Complete Payment' : '↻ Reorder Plan'}
              </div>
              <p className="text-[0.84rem] text-[var(--text-muted)] leading-[1.6] mb-6">
                <strong className="text-[var(--text-mid)]">{renewModal.plan}</strong>
                {' · '}{renewModal.diet}{' · '}{renewModal.amount}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setRenewModal(null); showToast('🎉 Order placed successfully!') }}
                  className="flex-1 py-3 bg-[var(--green)] text-[var(--cream)] rounded-xl font-bold text-[0.84rem] border-none cursor-pointer transition-all hover:bg-[var(--green-mid)]"
                  style={{ fontFamily: 'Inter,sans-serif' }}>
                  {renewModal.status === 'pending' ? 'Pay Now →' : 'Confirm Order →'}
                </button>
                <button
                  onClick={() => setRenewModal(null)}
                  className="px-5 py-3 bg-[var(--cream2)] text-[var(--text-mid)] rounded-xl font-semibold text-[0.84rem] border border-[var(--border)] cursor-pointer transition-all hover:bg-[var(--border)]"
                  style={{ fontFamily: 'Inter,sans-serif' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Hero Header */}
      <div className="bg-[var(--green)] mt-[100px] relative overflow-hidden px-5 md:px-[52px] pt-9 pb-[52px]" >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%,rgba(176,125,58,0.15) 0%,transparent 60%)' }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-playfair text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#b84c38,#d4714f)', boxShadow: '0 4px 20px rgba(184,76,56,0.4)' }}>
              {profile.avatar}
            </div>
            <div>
              <div className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[rgba(251,241,231,0.4)] mb-1">My Account</div>
              <h1 className="font-playfair text-2xl font-bold text-[var(--cream)]">
                Welcome back, <em className="not-italic text-[var(--gold-light)]">{profile.name.split(' ')[0]}</em> 👋
              </h1>
              <div className="text-[0.8rem] text-[rgba(251,241,231,0.5)] mt-0.5">Member since {profile.joined}</div>
            </div>
            <div className="ml-auto flex gap-8 flex-wrap">
              {[
                [SUBSCRIPTIONS.filter(s => s.status === 'active').length,  'Active Plans'],
                [SUBSCRIPTIONS.filter(s => s.status === 'pending').length, 'Pending'],
                [SUBSCRIPTIONS.length,                                      'Total Orders'],
              ].map(([num, lbl]) => (
                <div key={lbl} className="text-center">
                  <div className="font-playfair text-2xl font-bold text-[var(--cream)] leading-none">{num}</div>
                  <div className="text-[0.65rem] text-[rgba(251,241,231,0.45)] mt-1 tracking-[0.06em] uppercase">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto relative z-10 px-5 md:px-[52px]" >
        <div className="h-6" />

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1fr_340px]">

          {/* LEFT: Orders */}
          <div>
            <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_var(--shadow)]">

              {/* Tab bar */}
              <div className="flex border-b border-[var(--border)]">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-3 text-[0.78rem] font-semibold border-b-2 transition-all cursor-pointer bg-transparent
                      ${activeTab === tab.key
                        ? 'text-[var(--green)] border-b-[var(--green)]'
                        : 'text-[var(--text-muted)] border-b-transparent hover:text-[var(--green)]'}`}
                    style={{ fontFamily: 'Inter,sans-serif' }}>
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`w-5 h-5 rounded-full text-[0.63rem] font-bold flex items-center justify-center transition-colors ${
                        activeTab === tab.key
                          ? 'bg-[var(--green)] text-[var(--cream)]'
                          : 'bg-[var(--cream2)] text-[var(--text-muted)]'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Orders list */}
              <div className="p-5 flex flex-col gap-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">📭</div>
                    <div className="font-playfair text-lg font-bold text-[var(--green)] mb-2">No Orders Found</div>
                    <p className="text-[0.84rem] text-[var(--text-muted)] mb-5">
                      You don't have any orders in this category yet.
                    </p>
                    <Link
                      href="/#subscription"
                      className="inline-block bg-[var(--green)] text-[var(--cream)] px-6 py-3 rounded-xl font-semibold text-[0.84rem] no-underline transition-all hover:bg-[var(--green-mid)]">
                      Browse Plans
                    </Link>
                  </div>
                ) : (
                  filtered.map(sub => (
                    <SubCard key={sub.id} sub={sub} onRenew={setRenewModal} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Profile + Quick Actions */}
          <div className="flex flex-col gap-5">

            {/* Profile card */}
            <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_var(--shadow)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--cream)]">
                <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">Account Details</div>
                <button
                  onClick={() => { setDraft(profile); setEditMode(v => !v) }}
                  className="text-[0.74rem] font-semibold text-[var(--green)] bg-none border-none cursor-pointer p-0 flex items-center gap-1 transition-colors hover:text-[var(--gold)]"
                  style={{ fontFamily: 'Inter,sans-serif' }}>
                  {editMode ? '✕ Cancel' : '✏️ Edit Profile'}
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[var(--border)]">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-playfair text-lg font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#b84c38,#d4714f)' }}>
                    {profile.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[0.9rem] text-[var(--green)]">{profile.name}</div>
                    <div className="text-[0.72rem] text-[var(--text-muted)] mt-0.5">Premium Member</div>
                  </div>
                </div>

                {editMode ? (
                  <div className="flex flex-col gap-3">
                    {[
                      ['Full Name',    'name',  'text',  'Your full name'],
                      ['Email',        'email', 'email', 'your@email.com'],
                      ['Phone',        'phone', 'tel',   '+91 XXXXX XXXXX'],
                    ].map(([label, field, type, placeholder]) => (
                      <div key={field}>
                        <label className="block text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-1">{label}</label>
                        <input
                          type={type}
                          value={draft[field]}
                          disabled={type === "email" ? true : false}
                          placeholder={placeholder}
                          onChange={e => setDraft(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 bg-[var(--cream)] border-[1.5px] border-[var(--border)] rounded-xl outline-none text-[0.84rem] text-[var(--text)] transition-all focus:border-[var(--green)] focus:shadow-[0_0_0_3px_rgba(48,61,43,0.08)]"
                          style={{ fontFamily: 'Inter,sans-serif' }} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[0.68rem] font-bold text-[var(--text-muted)] uppercase tracking-[0.08em] mb-1">Delivery Address (Only for new subscriptions)</label>
                      <textarea
                        rows={3}
                        value={draft.address}
                        placeholder="Your delivery address"
                        onChange={e => setDraft(p => ({ ...p, address: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-[var(--cream)] border-[1.5px] border-[var(--border)] rounded-xl outline-none text-[0.84rem] text-[var(--text)] resize-none transition-all focus:border-[var(--green)] focus:shadow-[0_0_0_3px_rgba(48,61,43,0.08)]"
                        style={{ fontFamily: 'Inter,sans-serif' }} />
                    </div>
                    <button
                      onClick={saveProfile}
                      className="w-full py-3 bg-[var(--green)] text-[var(--cream)] rounded-xl font-bold text-[0.84rem] border-none cursor-pointer transition-all hover:bg-[var(--green-mid)] hover:-translate-y-0.5 mt-1"
                      style={{ fontFamily: 'Inter,sans-serif' }}>
                      Save Changes ✓
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {[
                      ['👤', 'Name',             profile.name],
                      ['✉️', 'Email Address',    profile.email],
                      ['📞', 'Phone Number',     profile.phone],
                      ['📍', 'Delivery Address', profile.address],
                    ].map(([icon, label, val]) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
                        <div className="min-w-0">
                          <div className="text-[0.66rem] font-bold text-[var(--text-muted)] uppercase tracking-[0.08em]">{label}</div>
                          <div className="text-[0.83rem] text-[var(--text-mid)] font-medium mt-0.5 leading-[1.5] break-words">{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_var(--shadow)]">
              <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--cream)]">
                <div className="text-[0.72rem] font-bold tracking-[0.14em] uppercase text-[var(--text-muted)]">Quick Actions</div>
              </div>
              <div className="p-3 flex flex-col gap-1">
                {[
                  ['🍽️', 'Book a New Subscription', '/#subscription'],
                  ['📋', 'View Balanced Food Menu',  '/food-menu/balanced-food'],
                  ['💪', 'View Fitness Menu',         '/food-menu/low-calorie-high-protein'],
                  ['📞', 'Contact Support',           '/contact'],
                ].map(([icon, label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl no-underline transition-all group hover:bg-[var(--green-pale)]">
                    <span className="text-base">{icon}</span>
                    <span className="text-[0.82rem] font-medium text-[var(--text-mid)] group-hover:text-[var(--green)] transition-colors">{label}</span>
                    <span className="ml-auto text-[var(--text-muted)] text-xs group-hover:text-[var(--green)] transition-all group-hover:translate-x-0.5">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sign out */}
            <button
              className="w-full py-3 bg-white border border-[var(--border)] rounded-2xl font-semibold text-[0.84rem] text-[var(--text-muted)] cursor-pointer transition-all hover:border-[#ef4444] hover:text-[#ef4444] hover:bg-[#fef2f2]"
              style={{ fontFamily: 'Inter,sans-serif' }}>
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 text-center text-[0.72rem] text-[var(--text-muted)]">
        </div>
      </div>
    </div>
  )
}