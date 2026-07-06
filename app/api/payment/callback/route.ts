import { NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/phonepe'
import { connectDB } from '@/lib/db'
import Subscription from '@/lib/models/Subscription'

/* PhonePe redirects browser here after payment */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subId = searchParams.get('subId')
  const base  = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  if (!subId) {
    return NextResponse.redirect(`${base}/payment/failure?reason=missing_id`)
  }

  try {
    /* Verify with PhonePe status API */
    const result = await verifyPayment(subId)

    // v2 API returns state directly at top level
    const paid = result.state === 'COMPLETED'

    if (paid) {
      /* Activate subscription */
      await connectDB()
      await Subscription.findByIdAndUpdate(subId, {
        $set: { status: 'Active', approved: true, approvedAt: new Date() },
      })
      return NextResponse.redirect(`${base}/payment/success?id=${subId}`)
    }

    /* Payment failed / pending */
    await connectDB()
    await Subscription.findByIdAndUpdate(subId, { $set: { status: 'Cancelled' } })
    return NextResponse.redirect(`${base}/payment/failure?id=${subId}`)
  } catch {
    return NextResponse.redirect(`${base}/payment/failure?reason=error`)
  }
}
