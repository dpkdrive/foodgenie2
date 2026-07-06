import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/phonepe'
import { connectDB } from '@/lib/db'
import SameDayOrder from '@/lib/models/SameDayOrder'
import { sendEmail, ADMIN } from '@/lib/emails/resend'
import { sameDayOrderHtml } from '@/lib/emails/sameDayOrder'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  const base    = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  if (!orderId) {
    return NextResponse.redirect(`${base}/payment/failure?reason=missing_id`)
  }

  try {
    const result = await verifyPayment(orderId)
    const paid   = result.state === 'COMPLETED'

    await connectDB()

    if (paid) {
      const order = await SameDayOrder.findByIdAndUpdate(orderId, {
        $set: { paymentStatus: 'Paid', transactionId: orderId },
      }, { new: true })

      if (order) {
        const emailData = {
          orderId:      order.orderId,
          customerName: order.customer.name,
          phone:        order.customer.phone,
          email:        order.customer.email,
          address:      order.customer.address,
          timing:       order.timing,
          items:        order.items.map(i => ({ title: i.title, quantity: i.quantity, subtotal: i.subtotal })),
          subtotal:     order.subtotal,
          deliveryFee:  order.deliveryFee,
          gst:          order.gst,
          total:        order.total,
        }

        sendEmail({
          to:      ADMIN,
          subject: `New Same Day Order — ${order.orderId} — ${order.customer.name}`,
          html:    sameDayOrderHtml(emailData),
        }).catch(console.error)

        if (order.customer.email) {
          sendEmail({
            to:      order.customer.email,
            subject: `Order Received — ${order.orderId} — FoodGenie`,
            html:    sameDayOrderHtml(emailData),
          }).catch(console.error)
        }
      }

      return NextResponse.redirect(`${base}/payment/success?type=order&id=${orderId}`)
    }

    await SameDayOrder.findByIdAndUpdate(orderId, {
      $set: { paymentStatus: 'Failed', status: 'Cancelled' },
    })
    return NextResponse.redirect(`${base}/payment/failure?type=order&id=${orderId}`)
  } catch {
    return NextResponse.redirect(`${base}/payment/failure?reason=error`)
  }
}
