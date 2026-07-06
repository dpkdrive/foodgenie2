'use client'
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import DeliveryCheck from './DeliveryCheck'

export const PLAN_CONFIG = {
  gstRate: 0.07,
  mealsPerDay: 3,
  prices: {
    veg:    { 1: 279, 3: 249, 7: 239, 28: 229, custom: 279 },
    egg:    { 1: 279, 3: 249, 7: 239, 28: 229, custom: 279 },
    nonveg: { 1: 279, 3: 259, 7: 249, 28: 239, custom: 279 },
  },
}

const DIET_OPTIONS = [
  { key: 'veg',    label: 'Vegetarian' },
  { key: 'egg',    label: 'Eggetarian' },
  { key: 'nonveg', label: 'Non-Vegetarian' },
]

const MEAL_OPTIONS = [
  { key: 'Breakfast', label: 'Breakfast' },
  { key: 'Lunch',     label: 'Lunch' },
  { key: 'Dinner',    label: 'Dinner' },
]

const CATEGORY_OPTIONS = [
  { key: 'Balanced',                   label: 'Balanced',                     sub: null },
  { key: 'High Protein Low Calories',  label: 'High Protein Low Calories',    sub: null },
  { key: 'Bespoke',                    label: 'Bespoke',                      sub: [
    'Athletes',
    'Diabetes',
    'Arthritis',
    'Vegan',
    'Lacto Intolerance',
    'Gluten-free',
  ]},
]

const DAY_OPTIONS = [
  { value: '3',  label: '3 Days' },
  { value: '7',  label: '7 Days' },
  { value: '28', label: '28 Days' },
  { value: 'custom', label: 'Custom' },
]

const BESPOKE_DAY_OPTIONS = [
  { value: '28', label: '28 Days', price: 39200 },
  { value: '84', label: '84 Days', price: 113408 },
]

const BESPOKE_PRICES = { 28: 39200, 84: 113408 }
const BESPOKE_MEALS = 'Breakfast · Lunch · Snacks · Dinner'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_OF_WEEK = ['Su','Mo','Tu','We','Th','Fr','Sa']

function fmt(n) { return '₹' + Math.round(n).toLocaleString('en-IN') }
function todayMidnight() { const d = new Date(); d.setHours(0,0,0,0); return d }
function sameDay(a, b) { return a && b && a.toDateString() === b.toDateString() }
function isBetween(d, a, b) { return a && b && d > a && d < b }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function formatDate(d) { if (!d) return '—'; return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear() }

function resolveTier(days) {
  if (days < 3)  return 1   // 1–2 days
  if (days <= 3) return 3   // 3 days
  if (days <= 7) return 7   // 4–7 days
  return 28                 // 8+ days
}

function calcAmounts(diet, days, apiPrices) {
  const prices  = apiPrices ?? PLAN_CONFIG.prices
  const tier    = resolveTier(days)
  const perDay  = prices[diet]?.[tier] ?? PLAN_CONFIG.prices[diet]?.[tier]
  if (!perDay || !days) return { perMeal: 0, base: 0, gst: 0, total: 0 }
  const base = perDay * PLAN_CONFIG.mealsPerDay * days
  const gst  = Math.round(base * PLAN_CONFIG.gstRate)
  return { perMeal: perDay, base, gst, total: base + gst }
}

const detailsSchema = Yup.object({
  name:    Yup.string().min(2, 'Name too short').required('Name is required'),
  phone:   Yup.string().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile').required('Phone is required'),
  email:   Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().min(5, 'Address too short').required('Address is required'),
  pincode: Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit pincode').required('Pincode is required'),
  notes:   Yup.string().nullable(),
})

const STEP_LABELS = ['Plan', 'Details', 'Confirm']

function Calendar({ startDate, endDate, calView, setCalView, onDateClick }) {
  const y = calView.getFullYear(), m = calView.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const today = todayMidnight()
  const tomorrow = addDays(today, 1)
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(<div key={'e' + i} />)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d)
    const isPast = date < tomorrow
    const isStart = sameDay(date, startDate)
    const isEnd = sameDay(date, endDate)
    const inRange = isBetween(date, startDate, endDate)
    const isToday = sameDay(date, today)

    cells.push(
      <div
        key={d}
        onClick={() => !isPast && onDateClick(new Date(date))}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 36, fontSize: '0.82rem', cursor: isPast ? 'default' : 'pointer',
          opacity: isPast ? 0.3 : 1,
          background: isStart || isEnd ? 'var(--green)' : inRange ? 'rgba(28,16,9,0.06)' : 'transparent',
          color: isStart || isEnd ? '#fff' : isToday ? 'var(--gold)' : 'var(--green)',
          fontWeight: isToday ? 600 : 400,
          border: isToday && !isStart && !isEnd ? '1px solid var(--gold)' : 'none',
        }}
      >
        {d}
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid var(--border)', background: '#fff', marginTop: 12, padding: '16px' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => { const d = new Date(calView); d.setMonth(d.getMonth() - 1); setCalView(d) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: '1.1rem', padding: '0 8px' }}
        >‹</button>
        <span style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.78rem', letterSpacing: '0.14em', color: 'var(--green)', textTransform: 'uppercase' }}>
          {MONTHS[m]} {y}
        </span>
        <button
          type="button"
          onClick={() => { const d = new Date(calView); d.setMonth(d.getMonth() + 1); setCalView(d) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: '1.1rem', padding: '0 8px' }}
        >›</button>
      </div>
      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 0', fontFamily: 'var(--font-cinzel), serif' }}>{d}</div>
        ))}
      </div>
      {/* Dates grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells}
      </div>
      {/* Selection info */}
      <div style={{ marginTop: 12, padding: '10px 12px', background: '#faf9f7', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-jost), sans-serif' }}>
        {!startDate
          ? 'Select start date (tap same date twice for 1 day)'
          : !endDate
            ? `Start: ${formatDate(startDate)} — select end date (or tap same date for 1 day)`
            : `${formatDate(startDate)} → ${formatDate(endDate)}`}
      </div>
    </div>
  )
}

export default function BookingModal({ isOpen, onClose, planKey, planLabel, currentDiet, apiPrices }) {
  const isBespoke = planKey === 'bespoke'
  const isFixed   = !isBespoke && planKey !== 'custom'  // 3, 7, 28 days

  const [step, setStep]             = useState(0)
  const [diet, setDiet]             = useState(currentDiet || 'veg')
  const [mealType, setMealType]     = useState('Lunch')
  const [category, setCategory]     = useState(isBespoke ? 'Bespoke' : '')
  const [bespokeType, setBespokeType] = useState(isBespoke ? 'Bride to be' : '')
  const [selectedDayOpt, setSelectedDayOpt] = useState(isBespoke ? '28' : planKey !== 'custom' ? (planKey || '7') : 'custom')
  const [days, setDays]             = useState(isBespoke ? 28 : planKey !== 'custom' ? (Number(planKey) || 7) : 0)
  const [calView, setCalView]       = useState(new Date())
  const [startDate, setStartDate]   = useState(null)
  const [endDate, setEndDate]       = useState(null)
  const [showSuccess,    setShowSuccess]    = useState(false)
  const [paying,         setPaying]         = useState(false)
  const [payError,       setPayError]       = useState('')
  const [deliveryResult, setDeliveryResult] = useState(null)  // { charge, distanceKm, serviceable }

  useEffect(() => {
    if (isOpen) {
      setStep(0)
      setDiet(currentDiet || 'veg')
      setMealType(planKey !== 'custom' && planKey !== 'bespoke' ? 'Breakfast + Lunch + Dinner' : 'Lunch')
      if (isBespoke) {
        setCategory('Bespoke')
        setBespokeType('Bride to be')
        setSelectedDayOpt('28')
        setDays(28)
      } else {
        setCategory('')
        setBespokeType('')
        const opt = planKey !== 'custom' ? (planKey || '7') : 'custom'
        setSelectedDayOpt(opt)
        setDays(opt !== 'custom' ? Number(opt) : 0)
      }
      setStartDate(null); setEndDate(null)
      setPayError('')
      setDeliveryResult(null)
      formik.resetForm()
    }
  }, [isOpen, planKey, currentDiet])

  const handleDayOptChange = (e) => {
    const v = e.target.value
    setSelectedDayOpt(v)
    if (v !== 'custom') setDays(Number(v))
    else { setDays(0); setStartDate(null); setEndDate(null) }
  }

  const handleDateClick = (date) => {
    if (!startDate || (startDate && endDate)) {
      const s = new Date(date); s.setHours(0, 0, 0, 0)
      setStartDate(s); setEndDate(null)
    } else {
      const s = new Date(date); s.setHours(0, 0, 0, 0)
      if (s < startDate) {
        setStartDate(s); setEndDate(null)
      } else if (sameDay(s, startDate)) {
        // same day = 1 day plan
        setEndDate(s)
        setDays(1)
      } else {
        setEndDate(s)
        setDays(Math.round((s - startDate) / 86400000) + 1)
      }
    }
  }

  const effectiveCategory = isBespoke ? 'Bespoke — Bride to be' : category === 'Bespoke' ? `Bespoke — ${bespokeType}` : category
  const canProceed = isBespoke
    ? days > 0
    : (selectedDayOpt !== 'custom' ? days > 0 : (startDate && endDate))
        && !!category
        && (category !== 'Bespoke' || !!bespokeType)

  const { perMeal, base, gst, total } = isBespoke
    ? (() => {
        const base = BESPOKE_PRICES[days] ?? 39200
        const gst  = Math.round(base * PLAN_CONFIG.gstRate)
        return { perMeal: 0, base, gst, total: base + gst }
      })()
    : calcAmounts(diet, days, apiPrices)

  const formik = useFormik({
    initialValues: { name: '', phone: '', email: '', address: '', pincode: '', notes: '' },
    validationSchema: detailsSchema,
    onSubmit: () => setStep(2),
  })

  const deliveryCharge = (deliveryResult?.chargePerDay ?? 0) * days

  const handleConfirm = async () => {
    setPaying(true); setPayError('')
    try {
      /* For fixed plans (3/7/28 days), auto-set start = tomorrow, end = start + days - 1 */
      let sDate = startDate
      let eDate = endDate
      if (selectedDayOpt !== 'custom') {
        sDate = new Date(); sDate.setHours(0, 0, 0, 0); sDate.setDate(sDate.getDate() + 1)
        eDate = addDays(sDate, days - 1)
      }

      const res = await fetch('/api/payment/initiate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name:    formik.values.name,
            phone:   formik.values.phone,
            email:   formik.values.email || '',
            address: `${formik.values.address}, ${formik.values.pincode}`,
          },
          plan:           planLabel,
          planType:       isBespoke ? 'Bespoke' : category === 'Bespoke' ? 'Bespoke' : selectedDayOpt !== 'custom' ? 'Fixed' : 'Customized',
          category:       effectiveCategory,
          meals:          isBespoke ? BESPOKE_MEALS : mealType,
          startDate:      sDate?.toISOString(),
          endDate:        eDate?.toISOString(),
          amount:         Math.round(total + deliveryCharge),
          deliveryCharge: deliveryCharge,
          notes:          formik.values.notes || '',
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Payment initiation failed')

      /* Redirect to PhonePe payment page */
      window.location.href = data.redirectUrl
    } catch (err) {
      setPayError(err.message || 'Something went wrong.')
    } finally { setPaying(false) }
  }

  if (!isOpen && !showSuccess) return null

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    border: '1px solid var(--border)', borderRadius: 0,
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
    color: 'var(--green)', background: '#faf9f7', outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontSize: '0.65rem', textTransform: 'uppercase',
    letterSpacing: '0.18em', fontFamily: 'var(--font-cinzel), serif',
    color: 'var(--gold)', marginBottom: 6,
  }

  return (
    <>
      {/* Success */}
      {showSuccess && (
        <div className="modal-overlay is-open" style={{ zIndex: 600 }}>
          <div className="modal-box bg-white w-full max-w-[440px] text-center p-12" style={{ boxShadow: '0 24px 80px rgba(28,16,9,0.25)' }}>
            <div className="text-[0.65rem] uppercase tracking-[0.22em] mb-6" style={{ color: 'var(--gold)', fontFamily: 'var(--font-cinzel), serif' }}>Booking Confirmed</div>
            <h3 className="text-[1.8rem] font-normal uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--green)', fontFamily: 'var(--font-cinzel), serif' }}>Thank You!</h3>
            <p className="text-[0.9rem] leading-[1.8] mb-8" style={{ color: 'rgb(90,85,78)' }}>
              Your FoodGenie plan has been booked. Our team will reach out within 2 hours to confirm your delivery schedule.
            </p>
            <button onClick={() => setShowSuccess(false)} className="btn-taj-filled">Continue</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay is-open">
          <div className="modal-box bg-white w-full max-w-[580px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 24px 80px rgba(28,16,9,0.25)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 sticky top-0 bg-white z-10" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <div className="text-[0.6rem] uppercase tracking-[0.22em] mb-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-cinzel), serif' }}>{planLabel}</div>
                <div className="flex items-baseline gap-3">
                  <div className="text-[1.1rem] font-normal uppercase tracking-[0.06em]" style={{ color: 'var(--green)', fontFamily: 'var(--font-cinzel), serif' }}>{STEP_LABELS[step]}</div>
                  {!isBespoke && perMeal > 0 && (
                    <div style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.06em' }}>
                      {fmt(perMeal)}<span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginLeft: 3 }}>/ meal per day</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="flex items-center justify-center bg-transparent border-none cursor-pointer" style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Step bar */}
            <div className="flex px-8 pt-5 gap-2">
              {STEP_LABELS.map((lbl, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1">
                  <div className="h-[2px]" style={{ background: i <= step ? 'var(--gold)' : 'var(--border)' }} />
                  <span className="text-[0.58rem] uppercase tracking-[0.14em]"
                    style={{ color: i <= step ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>{lbl}</span>
                </div>
              ))}
            </div>

            <div className="px-8 py-7">

              {/* ── Step 0: Diet + Meal + Days ── */}
              {step === 0 && (
                <div>
                  {isBespoke ? (
                    /* ── Bespoke Step 0 layout ── */
                    <>
                      {/* Heading */}
                      <h2 style={{
                        fontFamily: 'var(--font-cinzel), "Palatino Linotype", serif',
                        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                        fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: 'var(--green)', margin: '0 0 20px', lineHeight: 1.2,
                      }}>
                        Bride to Be
                      </h2>

                      {/* Choose Diet */}
                      <div className="mb-5">
                        <label style={labelStyle}>Choose Diet</label>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          {DIET_OPTIONS.map(opt => (
                            <button key={opt.key} type="button" onClick={() => setDiet(opt.key)}
                              style={{
                                flex: 1, padding: '8px 6px', cursor: 'pointer', border: 'none', textAlign: 'center',
                                background: diet === opt.key ? 'var(--green)' : '#faf9f7',
                                border: `1px solid ${diet === opt.key ? 'var(--green)' : 'var(--border)'}`,
                                color: diet === opt.key ? '#fff' : 'var(--green)',
                                fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem',
                                letterSpacing: '0.06em', textTransform: 'uppercase', transition: 'all 0.2s ease',
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Meals line */}
                      <div className="mb-5" style={{
                        padding: '10px 14px',
                        border: '1px solid var(--gold)',
                        background: 'rgba(201,169,110,0.06)',
                        fontSize: '0.75rem', lineHeight: 1.5,
                        color: 'var(--gold)', letterSpacing: '0.04em',
                      }}>
                        4 meals daily &nbsp;|&nbsp; Breakfast, Lunch, Snacks and Dinner &nbsp;|&nbsp; {days * 4} meals
                      </div>

                      {/* Perks */}
                      <div className="mb-6" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                          {
                            num: '1',
                            text: `Complimentary Daily Hydration Shots for ${days} days — A wellness elixir served every day to keep you refreshed and glowing.`,
                          },
                          {
                            num: '2',
                            text: `Bridal Calm Sessions — ${days === 84 ? 'Six' : 'Two'} 15-minute guided mental wellness sessions designed to ease pre-wedding stress.`,
                          },
                        ].map(perk => (
                          <div key={perk.num} style={{
                            display: 'flex', gap: 12, alignItems: 'flex-start',
                            padding: '12px 14px',
                            border: '1px solid var(--border)',
                            background: '#faf9f7',
                          }}>
                            <span style={{
                              flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                              background: 'var(--gold)', color: '#fff',
                              fontFamily: 'var(--font-cinzel), serif', fontSize: '0.65rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{perk.num}</span>
                            <p style={{
                              margin: 0, fontSize: '0.78rem', lineHeight: 1.6,
                              color: 'rgba(0,0,0,0.65)',
                            }}>{perk.text}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* ── Standard Step 0 layout ── */
                    <>
                      {/* Category */}
                      <div className="mb-6">
                        <label style={labelStyle}>Category</label>
                        <div className="flex flex-col gap-2 mt-2">
                          {CATEGORY_OPTIONS.map(opt => (
                            <div key={opt.key}>
                              <button type="button" onClick={() => { setCategory(opt.key); setBespokeType('') }}
                                className="flex items-center justify-between px-4 py-3 cursor-pointer border-none text-left w-full"
                                style={{
                                  background: category === opt.key ? 'var(--green)' : '#faf9f7',
                                  border: `1px solid ${category === opt.key ? 'var(--green)' : 'var(--border)'}`,
                                  color: category === opt.key ? '#fff' : 'var(--green)',
                                  fontFamily: 'var(--font-cinzel), serif', fontSize: '0.75rem',
                                  letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s ease',
                                }}
                              >
                                {opt.label}
                                {category === opt.key && <span style={{ color: 'var(--gold)' }}>✓</span>}
                              </button>

                              {/* Bespoke sub-options */}
                              {opt.key === 'Bespoke' && category === 'Bespoke' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6, paddingLeft: 12 }}>
                                  {opt.sub.map(s => (
                                    <button key={s} type="button" onClick={() => setBespokeType(s)}
                                      style={{
                                        padding: '7px 10px', cursor: 'pointer', fontSize: '0.72rem',
                                        fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.06em',
                                        textTransform: 'uppercase', textAlign: 'left',
                                        background: bespokeType === s ? 'rgba(201,169,110,0.15)' : '#fff',
                                        border: `1px solid ${bespokeType === s ? 'var(--gold)' : 'var(--border)'}`,
                                        color: bespokeType === s ? 'var(--gold)' : 'rgba(0,0,0,0.55)',
                                        transition: 'all 0.18s',
                                      }}
                                    >
                                      {bespokeType === s ? '✓ ' : ''}{s}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Diet + Meal Type side by side */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                        {/* Choose Diet */}
                        <div>
                          <label style={labelStyle}>Choose Diet</label>
                          <div className="flex flex-col gap-2 mt-2">
                            {DIET_OPTIONS.map(opt => (
                              <button key={opt.key} type="button" onClick={() => setDiet(opt.key)}
                                className="flex items-center justify-between px-4 py-3 cursor-pointer border-none text-left"
                                style={{
                                  background: diet === opt.key ? 'var(--green)' : '#faf9f7',
                                  border: `1px solid ${diet === opt.key ? 'var(--green)' : 'var(--border)'}`,
                                  color: diet === opt.key ? '#fff' : 'var(--green)',
                                  fontFamily: 'var(--font-cinzel), serif', fontSize: '0.75rem',
                                  letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s ease',
                                }}
                              >
                                {opt.label}
                                {diet === opt.key && <span style={{ color: 'var(--gold)' }}>✓</span>}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Meal Type */}
                        <div>
                          <label style={labelStyle}>
                            Meal Type
                          </label>
                          <div className="flex flex-col gap-2 mt-2">
                            {MEAL_OPTIONS.map(opt => {
                              const active = isFixed || mealType === opt.key
                              return (
                                <button key={opt.key} type="button"
                                  onClick={() => !isFixed && setMealType(opt.key)}
                                  className="flex items-center justify-between px-4 py-3 border-none text-left"
                                  style={{
                                    background: active ? 'var(--gold)' : '#faf9f7',
                                    border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                                    color: active ? '#fff' : 'var(--green)',
                                    fontFamily: 'var(--font-cinzel), serif', fontSize: '0.75rem',
                                    letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.2s ease',
                                    cursor: isFixed ? 'default' : 'pointer',
                                    opacity: isFixed ? 0.9 : 1,
                                  }}
                                >
                                  {opt.label}
                                  {active && <span style={{ opacity: 0.8 }}>✓</span>}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Duration */}
                  <div className="mb-8">
                    <label style={labelStyle}>Duration</label>
                    {isBespoke ? (
                      <div className="flex gap-3 mt-2">
                        {BESPOKE_DAY_OPTIONS.map(opt => (
                          <button key={opt.value} type="button"
                            onClick={() => { setSelectedDayOpt(opt.value); setDays(Number(opt.value)) }}
                            className="flex-1 flex flex-col items-center py-4 border-none cursor-pointer"
                            style={{
                              background: selectedDayOpt === opt.value ? 'var(--green)' : '#faf9f7',
                              border: `1px solid ${selectedDayOpt === opt.value ? 'var(--green)' : 'var(--border)'}`,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <span style={{
                              fontFamily: 'var(--font-cinzel), serif', fontSize: '0.82rem',
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              color: selectedDayOpt === opt.value ? '#fff' : 'var(--green)',
                            }}>{opt.label}</span>
                            <span style={{
                              fontFamily: 'var(--font-cinzel), serif', fontSize: '0.72rem',
                              color: selectedDayOpt === opt.value ? 'rgba(255,255,255,0.7)' : 'var(--gold)',
                              marginTop: 4,
                            }}>{fmt(opt.price)}</span>
                          </button>
                        ))}
                      </div>
                    ) : selectedDayOpt !== 'custom' ? (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px',
                        border: '1px solid var(--gold)',
                        background: 'rgba(201,169,110,0.06)',
                        color: 'var(--gold)',
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                      }}>
                        <span style={{ color: 'var(--gold)' }}>✓</span>
                        {DAY_OPTIONS.find(o => o.value === selectedDayOpt)?.label}
                      </div>
                    ) : (
                      <Calendar
                        startDate={startDate}
                        endDate={endDate}
                        calView={calView}
                        setCalView={setCalView}
                        onDateClick={handleDateClick}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    disabled={!canProceed}
                    className="btn-taj-filled"
                    style={{ width: '100%', opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}
                  >
                    Next — Personal Details
                  </button>
                </div>
              )}

              {/* ── Step 1: Personal Details ── */}
              {step === 1 && (
                <form onSubmit={formik.handleSubmit}>
                  <button type="button" onClick={() => setStep(0)}
                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer mb-6 p-0 text-[0.72rem] uppercase tracking-[0.14em]"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>
                    ← Back
                  </button>

                  <div className="flex flex-col gap-5">
                    {[
                      { name: 'name',  label: 'Full Name',     placeholder: 'Your full name',        type: 'text' },
                      { name: 'phone', label: 'Phone Number',  placeholder: '10-digit mobile number', type: 'tel' },
                      { name: 'email', label: 'Email Address', placeholder: 'your@email.com',         type: 'email' },
                    ].map(({ name, label, placeholder, type, optional }) => (
                      <div key={name}>
                        <label style={labelStyle}>{label}{optional && <span style={{ opacity: 0.5 }}> (optional)</span>}</label>
                        <input name={name} type={type} placeholder={placeholder}
                          {...formik.getFieldProps(name)} style={inputStyle} />
                        {formik.touched[name] && formik.errors[name] && (
                          <div className="text-[0.72rem] mt-1" style={{ color: '#c0392b' }}>{formik.errors[name]}</div>
                        )}
                      </div>
                    ))}

                    {/* Address + Pincode + Map */}
                    <div>
                      <label style={labelStyle}>Delivery Address</label>
                      <input name="address" type="text" placeholder="House / flat / street / area"
                        {...formik.getFieldProps('address')} style={inputStyle} />
                      {formik.touched.address && formik.errors.address && (
                        <div className="text-[0.72rem] mt-1" style={{ color: '#c0392b' }}>{formik.errors.address}</div>
                      )}
                    </div>

                    <div>
                      <label style={labelStyle}>Pincode</label>
                      <input
                        name="pincode" type="text" inputMode="numeric" maxLength={6}
                        placeholder="6-digit pincode"
                        {...formik.getFieldProps('pincode')}
                        onChange={e => formik.setFieldValue('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        style={inputStyle}
                      />
                      {formik.touched.pincode && formik.errors.pincode && (
                        <div className="text-[0.72rem] mt-1" style={{ color: '#c0392b' }}>{formik.errors.pincode}</div>
                      )}
                      <DeliveryCheck
                        pincode={formik.values.pincode}
                        mode={isBespoke ? 'bespoke' : undefined}
                        onResult={r => setDeliveryResult(r)}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Special Notes <span style={{ opacity: 0.5 }}>(optional)</span></label>
                      <textarea name="notes" rows={3} placeholder="Dietary preferences, allergies, etc."
                        {...formik.getFieldProps('notes')} style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn-taj-filled mt-7"
                    disabled={isBespoke && !!deliveryResult?.notDeliverable}
                    style={{ width: '100%', opacity: (isBespoke && deliveryResult?.notDeliverable) ? 0.4 : 1, cursor: (isBespoke && deliveryResult?.notDeliverable) ? 'not-allowed' : 'pointer' }}>
                    Next — Review Order
                  </button>
                </form>
              )}

              {/* ── Step 2: Summary ── */}
              {step === 2 && (
                <div>
                  <button type="button" onClick={() => setStep(1)}
                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer mb-6 p-0 text-[0.72rem] uppercase tracking-[0.14em]"
                    style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>
                    ← Back
                  </button>

                  <div style={{ border: '1px solid var(--border)' }}>
                    {[
                      ['Plan', planLabel],
                      ['Category', effectiveCategory],
                      ['Diet', DIET_OPTIONS.find(o => o.key === diet)?.label],
                      ['Meals', isBespoke ? BESPOKE_MEALS : mealType],
                      ['Duration', isBespoke
                        ? `${days} Days · 4 meals/day`
                        : selectedDayOpt === 'custom'
                          ? `${days} Days (${formatDate(startDate)} → ${formatDate(endDate)})`
                          : `${days} Days`],
                      ['Name', formik.values.name],
                      ['Phone', formik.values.phone],
                      ['Address', formik.values.address],
                      ['Pincode', formik.values.pincode],
                      formik.values.notes ? ['Notes', formik.values.notes] : null,
                    ].filter(Boolean).map(([l, v]) => (
                      <div key={l} className="flex justify-between items-start px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                        <span className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>{l}</span>
                        <span className="text-[0.88rem] text-right max-w-[60%]" style={{ color: 'var(--green)' }}>{v}</span>
                      </div>
                    ))}

                    {/* Price breakdown */}
                    <div className="flex justify-between items-center px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>Subtotal</span>
                      <span className="text-[0.88rem]" style={{ color: 'var(--green)' }}>{fmt(base)}</span>
                    </div>
                    <div className="flex justify-between items-center px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>
                        Govt. & Other Taxes
                      </span>
                      <span className="text-[0.88rem]" style={{ color: 'var(--green)' }}>{fmt(gst)}</span>
                    </div>
                    <div className="flex justify-between items-center px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: '#faf9f7' }}>
                      <span className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-cinzel), serif' }}>Delivery</span>
                      {deliveryCharge > 0 ? (
                        <span className="text-[0.8rem] font-medium" style={{ color: '#c9a96e' }}>{fmt(deliveryCharge)}</span>
                      ) : (
                        <span className="text-[0.8rem] font-medium" style={{ color: '#16a34a' }}>Free</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center px-5 py-4" style={{ background: 'var(--green)' }}>
                      <span className="text-[0.68rem] uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-cinzel), serif' }}>Total Payable</span>
                      <span className="text-[1.4rem] font-normal" style={{ color: '#fff', fontFamily: 'var(--font-cinzel), serif' }}>{fmt(total + deliveryCharge)}</span>
                    </div>
                  </div>

                  <div className="text-[0.7rem] mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                    {deliveryCharge > 0 ? `Delivery charge: ${fmt(deliveryCharge)} included` : 'Free Delivery'}
                  </div>

                  {payError && (
                    <div className="mt-4 px-4 py-3 text-[0.8rem]" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#c0392b' }}>{payError}</div>
                  )}

                  <button onClick={handleConfirm} disabled={paying} className="btn-taj-filled mt-6"
                    style={{ width: '100%', opacity: paying ? 0.6 : 1 }}>
                    {paying ? 'Processing...' : 'Confirm Booking'}
                  </button>

                  <div className="text-center text-[0.68rem] mt-3" style={{ color: 'var(--text-muted)' }}>
                    🔒 Secure · UPI · Cards · Net Banking
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
