import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_SECRET)

export const FROM    = 'FoodGenie <noreply@foodgenie.co.in>'
export const ADMIN   = process.env.ADMIN_MAIL ?? 'admin@foodgenie.co.in'
export const SUPPORT = '+91 99580 93268'

export async function sendEmail(opts: {
  to:      string | string[]
  subject: string
  html:    string
}) {
  const { error } = await resend.emails.send({
    from:    FROM,
    to:      opts.to,
    subject: opts.subject,
    html:    opts.html,
  })
  if (error) throw new Error(`Resend error: ${error.message}`)
}
