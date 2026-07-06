import { NextRequest, NextResponse } from 'next/server'
import { acceptOrder } from '@/lib/controllers/samedayorder.controller'
import { requireAuth } from '@/lib/auth'
import { sendEmail, ADMIN } from '@/lib/emails/resend'
import { sameDayOrderHtml } from '@/lib/emails/sameDayOrder'

type Ctx = { params: Promise<{ id: string }> }

/* POST /api/same-day/orders/:id/accept — admin manually accepts */
export async function POST(req: NextRequest, ctx: Ctx) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { id } = await ctx.params
    const order  = await acceptOrder(id, (auth as any).id)

    const emailData = {
      orderId:      order.orderId,
      customerName: order.customer.name,
      phone:        order.customer.phone,
      email:        order.customer.email,
      address:      order.customer.address,
      timing:       order.timing,
      items:        order.items.map((i: any) => ({ title: i.title, quantity: i.quantity, subtotal: i.subtotal })),
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

    return NextResponse.json({ success: true, data: order })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
