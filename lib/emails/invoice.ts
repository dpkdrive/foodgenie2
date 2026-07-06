export interface InvoiceEmailData {
  invoiceId:   string
  customerName: string
  phone:       string
  email:       string
  address:     string
  plan:        string
  meals:       string
  startDate:   string
  endDate:     string
  amount:      number
  status:      string
  approved:    boolean
  invoiceDate: string
}

export function invoiceEmailHtml(d: InvoiceEmailData): string {
  const amountFormatted = `₹${d.amount.toLocaleString('en-IN')}`

  const statusColor: Record<string, string> = {
    Active:    '#16a34a',
    Paused:    '#ca8a04',
    Completed: '#0369a1',
    Cancelled: '#dc2626',
  }
  const statusBg: Record<string, string> = {
    Active:    '#dcfce7',
    Paused:    '#fef9c3',
    Completed: '#dbeafe',
    Cancelled: '#fee2e2',
  }

  const sColor = statusColor[d.status] ?? '#555'
  const sBg    = statusBg[d.status]    ?? '#f5f5f5'

  const rows = [
    ['Customer',   d.customerName],
    ['Phone',      d.phone],
    ['Email',      d.email],
    ['Address',    d.address],
    ['Plan',       d.plan],
    ['Meals',      d.meals],
    ['Start Date', d.startDate],
    ['End Date',   d.endDate],
  ]

  const rowsHtml = rows.map(([label, value], i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#faf7f2'};">
      <td style="padding:12px 20px;font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:rgba(0,0,0,0.38);width:38%;border-bottom:1px solid rgba(201,169,110,0.12);">
        ${label}
      </td>
      <td style="padding:12px 20px;font-size:0.85rem;color:#1a1a1a;font-weight:500;border-bottom:1px solid rgba(201,169,110,0.12);">
        ${value ?? '—'}
      </td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FoodGenie Invoice — ${d.invoiceId}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Georgia',serif;-webkit-font-smoothing:antialiased;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border:1px solid rgba(201,169,110,0.28);box-shadow:0 4px 32px rgba(0,0,0,0.07);">

          <!-- Gold top rule -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e 30%,#c9a96e 70%,transparent);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:#c9a96e;">Subscription Invoice</p>
                    <h1 style="margin:0 0 4px;font-family:'Georgia',serif;font-size:2rem;font-weight:700;color:#1a1a1a;letter-spacing:0.08em;line-height:1;">FoodGenie</h1>
                    <p style="margin:0;font-size:0.7rem;color:rgba(0,0,0,0.35);letter-spacing:0.06em;font-style:italic;">Culinary Magic, Delivered</p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(0,0,0,0.3);">Invoice No.</p>
                    <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:1.3rem;font-weight:700;color:#c9a96e;letter-spacing:0.06em;">${d.invoiceId}</p>
                    <p style="margin:0;font-size:0.7rem;color:rgba(0,0,0,0.35);">Issued: ${d.invoiceDate}</p>
                  </td>
                </tr>
              </table>

              <!-- Ornament divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="height:1px;background:rgba(201,169,110,0.3);"></td>
                  <td width="12" align="center" style="padding:0 10px;">
                    <div style="width:7px;height:7px;background:#c9a96e;transform:rotate(45deg);display:inline-block;"></div>
                  </td>
                  <td style="height:1px;background:rgba(201,169,110,0.3);"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status badges -->
          <tr>
            <td style="padding:0 48px 28px;">
              <p style="margin:0 0 14px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;font-family:'Georgia',serif;">Status</p>
              <span style="display:inline-block;padding:5px 18px;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:1px solid ${d.approved ? '#16a34a' : '#b07d00'};color:${d.approved ? '#16a34a' : '#b07d00'};background:${d.approved ? '#f0fdf4' : '#fffbeb'};margin-right:8px;">
                ${d.approved ? '✓ Approved' : '⏳ Pending Approval'}
              </span>
              <span style="display:inline-block;padding:5px 18px;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;border:1px solid ${sColor};color:${sColor};background:${sBg};">
                ${d.status}
              </span>
            </td>
          </tr>

          <!-- Details table -->
          <tr>
            <td style="padding:0 48px 28px;">
              <p style="margin:0 0 14px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;font-family:'Georgia',serif;">Subscription Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.18);border-collapse:collapse;">
                ${rowsHtml}
              </table>
            </td>
          </tr>

          <!-- Amount box -->
          <tr>
            <td style="padding:0 48px 28px;">
              <p style="margin:0 0 14px;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;font-family:'Georgia',serif;">Payment</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(201,169,110,0.22);background:rgba(201,169,110,0.03);position:relative;">
                <tr>
                  <td style="padding:24px 28px;border-left:3px solid #c9a96e;">
                    <p style="margin:0 0 6px;font-size:0.55rem;letter-spacing:0.25em;text-transform:uppercase;color:rgba(0,0,0,0.35);font-family:'Georgia',serif;">Total Amount</p>
                    <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:2.2rem;font-weight:700;color:#1a1a1a;letter-spacing:0.02em;line-height:1;">${amountFormatted}</p>
                    <p style="margin:0;font-size:0.68rem;color:rgba(0,0,0,0.3);font-style:italic;">Inclusive of all charges · GST as applicable</p>
                  </td>
                  <td align="right" style="padding:24px 28px;vertical-align:top;">
                    <p style="margin:0 0 6px;font-size:0.62rem;color:rgba(0,0,0,0.3);text-transform:uppercase;letter-spacing:0.1em;">Plan</p>
                    <p style="margin:0;font-family:'Georgia',serif;font-size:0.95rem;font-weight:700;color:#1a1a1a;line-height:1.4;max-width:160px;text-align:right;">${d.plan}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding:0 48px 36px;">
              <table cellpadding="0" cellspacing="0" style="border-left:2px solid rgba(201,169,110,0.4);padding-left:16px;">
                <tr>
                  <td style="font-size:0.72rem;color:rgba(0,0,0,0.4);line-height:1.8;font-style:italic;">
                    This invoice is auto-generated by FoodGenie. For queries contact us at
                    <strong style="color:#c9a96e;font-style:normal;font-weight:600;"> +91 99580 93268</strong> or
                    <strong style="color:#c9a96e;font-style:normal;font-weight:600;"> admin@foodgenie.com</strong>.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 48px 24px;border-top:1px solid rgba(201,169,110,0.15);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'Georgia',serif;font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(0,0,0,0.25);">FoodGenie</td>
                  <td align="right" style="font-size:0.68rem;color:rgba(0,0,0,0.3);line-height:1.7;text-align:right;">
                    +91 99580 93268 · admin@foodgenie.com<br/>
                    Sector 57, Gurugram
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bottom gold rule -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,transparent,#c9a96e 30%,#c9a96e 70%,transparent);"></td>
          </tr>

        </table>

        <!-- Below-card note -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin-top:20px;">
          <tr>
            <td align="center" style="font-size:0.68rem;color:rgba(0,0,0,0.35);font-style:italic;font-family:'Georgia',serif;line-height:1.7;">
              You received this email because you have an active subscription with FoodGenie.<br/>
              © ${new Date().getFullYear()} FoodGenie. All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}
