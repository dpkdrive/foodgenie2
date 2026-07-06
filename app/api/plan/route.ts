// import { Resend } from 'resend' // or swap with nodemailer/any mailer

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Single source of truth for all pricing + GST.
// Update here → reflects in both GET (frontend) and POST (email).
// ─────────────────────────────────────────────────────────────────────────────
const CONFIG = {
  gstRate: 0.05,       // 5% GST
  mealsPerDay: 3,      // breakfast + lunch + dinner

  // Per-meal prices (₹) keyed by [diet][days]
  prices: {
    veg:    { 3: 249, 7: 239, 28: 229 },
    egg:    { 3: 249, 7: 239, 28: 229 },
    nonveg: { 3: 259, 7: 249, 28: 239 },
  },

  // Email config
  email: {
    to: 'orders@foodgenie.in',       // ← change to your actual email
    from: 'noreply@foodgenie.in',    // ← must be verified sender in Resend/SES
    subject: '🍽️ New Booking — FoodGenie',
  },
}
// ─────────────────────────────────────────────────────────────────────────────

// const resend = new Resend(process.env.RESEND_API_KEY)

// Helper: resolve price tier — anything above 28 days uses 28-day per-meal rate
function resolveTier(days: number): 3 | 7 | 28 {
  if (days <= 3)  return 3
  if (days <= 7)  return 7
  return 28  // 28+ days all get the 28-day rate
}

// Helper: calculate totals
function calcTotals(diet: string, days: number, perMealOverride?: number) {
  const tier    = resolveTier(days)
  const perMeal = perMealOverride ?? (CONFIG.prices as any)[diet]?.[tier]
  if (!perMeal) return null
  const base = perMeal * CONFIG.mealsPerDay * days
  const gst  = base * CONFIG.gstRate
  return { perMeal, base, gst, total: base + gst }
}

// ─── GET — return pricing config to frontend ──────────────────────────────────
export async function GET() {
  return Response.json({
    prices:      CONFIG.prices,
    gstRate:     CONFIG.gstRate,
    mealsPerDay: CONFIG.mealsPerDay,
  })
}

// ─── POST — receive booking, send email ───────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()

    // Expected body shape:
    // { name, phone, email?, address?, diet, planKey, planLabel, startDate?, customDays? }
    const {
      name, phone, email = '', address = '',
      diet, planKey, planLabel,
      startDate = 'Not specified',
      customDays,
    } = body

    // Validate required fields
    if (!name || !phone || !diet || !planKey) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Resolve days: '3' | '7' | '28' | 'custom'
    // const days = planKey === 'custom' ? (customDays ?? 'custom') : Number(planKey)
    // const amounts = planKey !== 'custom' ? calcTotals(diet, days) : null

    // // Build email HTML
    // const amountSection = amounts
    //   ? `
    //     <tr><td>Per Meal</td><td>₹${amounts.perMeal}</td></tr>
    //     <tr><td>Meals / Day</td><td>${CONFIG.mealsPerDay}</td></tr>
    //     <tr><td>Days</td><td>${days}</td></tr>
    //     <tr><td>Base Amount</td><td>₹${Math.round(amounts.base).toLocaleString('en-IN')}</td></tr>
    //     <tr><td>GST (${CONFIG.gstRate * 100}%)</td><td>₹${Math.round(amounts.gst).toLocaleString('en-IN')}</td></tr>
    //     <tr style="font-weight:bold;background:#f4f4f4"><td>Total</td><td>₹${Math.round(amounts.total).toLocaleString('en-IN')}</td></tr>
    //   `
    //   : `<tr><td colspan="2">Custom plan — pricing to be confirmed</td></tr>`

    // const html = `
    //   <h2 style="font-family:serif;color:#303d2b;">New FoodGenie Booking</h2>
    //   <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;width:100%;max-width:480px;font-family:sans-serif;font-size:14px;">
    //     <tr><th colspan="2" style="background:#303d2b;color:#fff;text-align:left;padding:10px;">Customer Details</th></tr>
    //     <tr><td>Name</td><td>${name}</td></tr>
    //     <tr><td>Phone</td><td>${phone}</td></tr>
    //     <tr><td>Email</td><td>${email || '—'}</td></tr>
    //     <tr><td>Address</td><td>${address || '—'}</td></tr>
    //     <tr><th colspan="2" style="background:#303d2b;color:#fff;text-align:left;padding:10px;">Plan Details</th></tr>
    //     <tr><td>Diet</td><td style="text-transform:capitalize">${diet}</td></tr>
    //     <tr><td>Plan</td><td>${planLabel}</td></tr>
    //     <tr><td>Start Date</td><td>${startDate}</td></tr>
    //     <tr><th colspan="2" style="background:#303d2b;color:#fff;text-align:left;padding:10px;">Pricing</th></tr>
    //     ${amountSection}
    //   </table>
    //   <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:16px;">
    //     Sent from FoodGenie booking form · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    //   </p>
    // `

    // await resend.emails.send({
    //   from:    CONFIG.email.from,
    //   to:      CONFIG.email.to,
    //   subject: CONFIG.email.subject,
    //   html,
    // })

    // return Response.json({ success: true })

  } catch (err) {
    console.error('[plans POST]', err)
    return Response.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}