import { NextRequest, NextResponse } from 'next/server'
import { approveSubscription } from '@/lib/controllers/subscription.controller'
import { requireAuth } from '@/lib/auth'
import { sendEmail, ADMIN } from '@/lib/emails/resend'
import { orderReceivedHtml } from '@/lib/emails/orderReceived'

/* POST /api/subscriptions/:id/approve */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const sub = await approveSubscription(params.id, auth.id)

    const fmt = (d: Date) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    const emailData = {
      subscriptionId: sub.subscriptionId,
      customerName:   sub.customer.name,
      phone:          sub.customer.phone,
      email:          sub.customer.email,
      address:        sub.customer.address,
      plan:           sub.plan,
      meals:          sub.meals,
      startDate:      fmt(sub.startDate),
      endDate:        fmt(sub.endDate),
      amount:         sub.amount,
    }

    // Admin notification
    sendEmail({
      to:      ADMIN,
      subject: `New Order Received — ${sub.subscriptionId} — ${sub.customer.name}`,
      html:    orderReceivedHtml(emailData),
    }).catch(console.error)

    // Customer confirmation
    if (sub.customer.email) {
      sendEmail({
        to:      sub.customer.email,
        subject: `Order Received — ${sub.subscriptionId} — FoodGenie`,
        html:    orderReceivedHtml(emailData),
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, data: sub })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 404 })
  }
}
