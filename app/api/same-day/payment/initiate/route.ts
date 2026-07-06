import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/controllers/samedayorder.controller'
import { initiatePayment } from '@/lib/phonepe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer, items, timing, subtotal, deliveryFee, gst, total, notes } = body

    if (!customer?.phone) {
      return NextResponse.json({ success: false, message: 'Phone is required' }, { status: 400 })
    }

    const order = await createOrder({
      customer,
      items,
      timing,
      subtotal,
      deliveryFee: deliveryFee ?? 0,
      total,
      paymentMethod: 'Online',
      notes,
    })

    const orderId = (order._id as any).toString()
    const base    = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    const { redirectUrl } = await initiatePayment({
      transactionId: orderId,
      amountRupees:  total,
      redirectUrl:   `${base}/api/same-day/payment/callback?orderId=${orderId}`,
      callbackUrl:   `${base}/api/payment/webhook`,
      mobile:        customer?.phone,
    })

    return NextResponse.json({ success: true, redirectUrl })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
