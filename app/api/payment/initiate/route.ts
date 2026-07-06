import { NextRequest, NextResponse } from 'next/server'
import { createSubscription } from '@/lib/controllers/subscription.controller'
import { initiatePayment } from '@/lib/phonepe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { customer, plan, planType, category, meals, startDate, endDate, amount, notes } = body

    if (!customer?.email) {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 })
    }

    /* 1. Create subscription in Pending state */
    const sub = await createSubscription({
      customer,
      plan,
      planType: planType ?? 'Fixed',
      category: category ?? '',
      meals,
      startDate,
      endDate,
      amount,
      notes,
    })

    const subId = (sub._id as any).toString()
    const base  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

    /* 2. Initiate PhonePe payment */
    const { redirectUrl } = await initiatePayment({
      transactionId: subId,
      amountRupees:  amount,
      redirectUrl:   `${base}/api/payment/callback?subId=${subId}`,
      callbackUrl:   `${base}/api/payment/webhook`,
      mobile:        customer?.phone,
    })

    return NextResponse.json({ success: true, redirectUrl })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
