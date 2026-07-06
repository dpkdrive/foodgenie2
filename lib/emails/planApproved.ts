export interface PlanApprovedData {
  subscriptionId: string
  customerName:   string
  plan:           string
  meals:          string
  startDate:      string
  endDate:        string
  amount:         number
}

export function planApprovedHtml(d: PlanApprovedData): string {
  const amt = `₹${d.amount.toLocaleString('en-IN')}`
  const rows: [string, string][] = [
    ['Plan',       d.plan],
    ['Meals',      d.meals],
    ['Start Date', d.startDate],
    ['End Date',   d.endDate],
    ['Amount',     amt],
  ]
  const rowsHtml = rows.map(([label, val], i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#faf7f2'};">
      <td style="padding:11px 20px;font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:rgba(0,0,0,0.38);width:36%;border-bottom:1px solid rgba(201,169,110,0.12);">${label}</td>
      <td style="padding:11px 20px;font-size:0.85rem;color:#1a1a1a;font-weight:500;border-bottom:1px solid rgba(201,169,110,0.12);">${val}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Plan Approved — FoodGenie</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid rgba(201,169,110,0.28);box-shadow:0 4px 24px rgba(0,0,0,0.07);">
  <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e 30%,#c9a96e 70%,transparent);"></td></tr>
  <tr><td style="padding:36px 44px 24px;">
    <p style="margin:0 0 4px;font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:#c9a96e;">Great News!</p>
    <h1 style="margin:0 0 4px;font-size:1.9rem;font-weight:700;color:#1a1a1a;letter-spacing:0.06em;">Your Plan is Approved</h1>
    <p style="margin:0;font-size:0.8rem;color:rgba(0,0,0,0.45);">Hi ${d.customerName}, your FoodGenie subscription has been confirmed.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
      <td style="height:1px;background:rgba(201,169,110,0.3);"></td>
      <td width="30" align="center"><div style="width:7px;height:7px;background:#c9a96e;transform:rotate(45deg);display:inline-block;"></div></td>
      <td style="height:1px;background:rgba(201,169,110,0.3);"></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 44px 12px;">
    <span style="display:inline-block;padding:5px 18px;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:1px solid #16a34a;color:#16a34a;background:#f0fdf4;">✓ Approved &amp; Active</span>
  </td></tr>

  <tr><td style="padding:12px 44px 28px;">
    <p style="margin:0 0 12px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;">Subscription Details</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.18);border-collapse:collapse;">${rowsHtml}</table>
  </td></tr>

  <tr><td style="padding:0 44px 32px;">
    <table cellpadding="0" cellspacing="0" style="border-left:2px solid rgba(201,169,110,0.4);padding-left:14px;">
      <tr><td style="font-size:0.72rem;color:rgba(0,0,0,0.4);line-height:1.8;font-style:italic;">
        Welcome to the FoodGenie family! Your meals will start from the date mentioned above.<br/>
        For any queries, reach us at <strong style="color:#c9a96e;font-style:normal;">+91 99580 93268</strong> or <strong style="color:#c9a96e;font-style:normal;">admin@foodgenie.co.in</strong>.
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:16px 44px 22px;border-top:1px solid rgba(201,169,110,0.15);">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.25);">FoodGenie</td>
      <td align="right" style="font-size:0.68rem;color:rgba(0,0,0,0.3);text-align:right;">+91 99580 93268 · admin@foodgenie.co.in<br/>Sector 57, Gurugram</td>
    </tr></table>
  </td></tr>
  <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e 30%,#c9a96e 70%,transparent);"></td></tr>
</table>
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin-top:18px;">
  <tr><td align="center" style="font-size:0.68rem;color:rgba(0,0,0,0.35);font-style:italic;line-height:1.7;">
    You received this email because you have an active subscription with FoodGenie.<br/>
    © ${new Date().getFullYear()} FoodGenie. All rights reserved.
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}
