import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, ADMIN } from '@/lib/emails/resend'
import { bulkEnquiryHtml } from '@/lib/emails/bulkEnquiry'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, pax, eventDate, message } = await req.json()

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Name and phone are required' }, { status: 400 })
    }

    await sendEmail({
      to:      ADMIN,
      subject: `Bulk Order Enquiry — ${name} (${phone})`,
      html:    bulkEnquiryHtml({ name, phone, email: email ?? '', pax: pax ?? '', eventDate: eventDate ?? '', message: message ?? '' }),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[bulk-order POST]', err)
    return NextResponse.json({ success: false, error: 'Failed to send enquiry' }, { status: 500 })
  }
}
