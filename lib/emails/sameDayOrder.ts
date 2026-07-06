export interface SameDayOrderItem {
  title:    string
  quantity: number
  subtotal: number
}

export interface SameDayOrderEmailData {
  orderId:     string
  customerName: string
  phone:       string
  email:       string
  address:     string
  timing:      string
  items:       SameDayOrderItem[]
  subtotal:    number
  deliveryFee: number
  gst:         number
  total:       number
}

export function sameDayOrderHtml(d: SameDayOrderEmailData): string {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

  const itemRows = d.items.map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#faf7f2'};">
      <td style="padding:10px 20px;font-size:0.84rem;color:#1a1a1a;border-bottom:1px solid rgba(201,169,110,0.12);">${item.title}</td>
      <td style="padding:10px 20px;font-size:0.84rem;color:#1a1a1a;text-align:center;border-bottom:1px solid rgba(201,169,110,0.12);">${item.quantity}</td>
      <td style="padding:10px 20px;font-size:0.84rem;color:#1a1a1a;text-align:right;border-bottom:1px solid rgba(201,169,110,0.12);">${fmt(item.subtotal)}</td>
    </tr>`).join('')

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Order Received — FoodGenie</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid rgba(201,169,110,0.28);box-shadow:0 4px 24px rgba(0,0,0,0.07);">
  <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e 30%,#c9a96e 70%,transparent);"></td></tr>
  <tr><td style="padding:36px 44px 24px;">
    <p style="margin:0 0 4px;font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:#c9a96e;">Same Day Order</p>
    <h1 style="margin:0 0 4px;font-size:1.9rem;font-weight:700;color:#1a1a1a;letter-spacing:0.06em;">Order Received</h1>
    <p style="margin:0;font-size:0.7rem;color:rgba(0,0,0,0.35);font-style:italic;">FoodGenie — Culinary Magic, Delivered</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr>
      <td style="height:1px;background:rgba(201,169,110,0.3);"></td>
      <td width="30" align="center"><div style="width:7px;height:7px;background:#c9a96e;transform:rotate(45deg);display:inline-block;"></div></td>
      <td style="height:1px;background:rgba(201,169,110,0.3);"></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 44px 12px;">
    <p style="margin:0 0 4px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;">Order ID</p>
    <p style="margin:0;font-size:1.4rem;font-weight:700;color:#c9a96e;font-family:'Georgia',serif;letter-spacing:0.06em;">${d.orderId}</p>
  </td></tr>

  <!-- Customer info -->
  <tr><td style="padding:12px 44px 20px;">
    <p style="margin:0 0 12px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;">Customer</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.18);border-collapse:collapse;">
      ${[['Name', d.customerName], ['Phone', d.phone], ['Email', d.email || '—'], ['Address', d.address], ['Delivery Timing', d.timing]]
        .map(([label, val], i) => `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#faf7f2'};">
          <td style="padding:10px 20px;font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:rgba(0,0,0,0.38);width:36%;border-bottom:1px solid rgba(201,169,110,0.12);">${label}</td>
          <td style="padding:10px 20px;font-size:0.84rem;color:#1a1a1a;font-weight:500;border-bottom:1px solid rgba(201,169,110,0.12);">${val}</td>
        </tr>`).join('')}
    </table>
  </td></tr>

  <!-- Items -->
  <tr><td style="padding:0 44px 20px;">
    <p style="margin:0 0 12px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;">Items Ordered</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.18);border-collapse:collapse;">
      <tr style="background:rgba(201,169,110,0.08);">
        <td style="padding:9px 20px;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(0,0,0,0.4);border-bottom:1px solid rgba(201,169,110,0.18);">Item</td>
        <td style="padding:9px 20px;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(0,0,0,0.4);text-align:center;border-bottom:1px solid rgba(201,169,110,0.18);">Qty</td>
        <td style="padding:9px 20px;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(0,0,0,0.4);text-align:right;border-bottom:1px solid rgba(201,169,110,0.18);">Amount</td>
      </tr>
      ${itemRows}
    </table>
  </td></tr>

  <!-- Totals -->
  <tr><td style="padding:0 44px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.22);background:rgba(201,169,110,0.03);">
      <tr>
        <td style="padding:20px 24px;border-left:3px solid #c9a96e;">
          ${[['Subtotal', fmt(d.subtotal)], ['Delivery Fee', fmt(d.deliveryFee)], ['GST', fmt(d.gst)]]
            .map(([label, val]) => `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-size:0.78rem;color:rgba(0,0,0,0.45);">${label}</span>
              <span style="font-size:0.78rem;color:#1a1a1a;">${val}</span>
            </div>`).join('')}
          <div style="border-top:1px solid rgba(201,169,110,0.3);margin-top:10px;padding-top:10px;display:flex;justify-content:space-between;">
            <span style="font-size:0.9rem;font-weight:700;color:#1a1a1a;font-family:'Georgia',serif;">Total</span>
            <span style="font-size:1.1rem;font-weight:700;color:#1a1a1a;font-family:'Georgia',serif;">${fmt(d.total)}</span>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:16px 44px 22px;border-top:1px solid rgba(201,169,110,0.15);">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(0,0,0,0.25);">FoodGenie</td>
      <td align="right" style="font-size:0.68rem;color:rgba(0,0,0,0.3);text-align:right;">+91 99580 93268 · admin@foodgenie.co.in</td>
    </tr></table>
  </td></tr>
  <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e 30%,#c9a96e 70%,transparent);"></td></tr>
</table>
</td></tr></table>
</body></html>`
}
