import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Subscription from '@/lib/models/Subscription'
import { verifyPayment } from '@/lib/phonepe'
import { sendEmail, ADMIN } from '@/lib/emails/resend'
import { orderReceivedHtml } from '@/lib/emails/orderReceived'

/* POST /api/payment/webhook — server-to-server callback from PhonePe v2 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // v2 webhook sends merchantOrderId directly
    const merchantOrderId = body.merchantOrderId ?? body.data?.merchantOrderId
    if (!merchantOrderId) return NextResponse.json({ success: true })

    // Re-verify via status API instead of trusting webhook payload
    const result = await verifyPayment(merchantOrderId)
    const paid   = result.state === 'COMPLETED'

    await connectDB()

    if (paid) {
      const sub = await Subscription.findByIdAndUpdate(merchantOrderId, {
        $set: { status: 'Active', approved: true, approvedAt: new Date() },
      }, { new: true })

      if (sub) {
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
      }
    } else {
      await Subscription.findByIdAndUpdate(merchantOrderId, {
        $set: { status: 'Cancelled' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
