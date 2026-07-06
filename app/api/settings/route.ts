import { NextRequest, NextResponse } from 'next/server'
import {
  getSettings,
  updateSocialLinks,
  updateContact,
  updateBanners,
  addBanner,
  removeBanner,
  updateServiceArea,
  removeBulkOrderImage,
} from '@/lib/controllers/settings.controller'
import { requireAuth } from '@/lib/auth'

/* GET /api/settings — public, used by frontend */
export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json({ success: true, data: settings })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}

/* PATCH /api/settings — update social links or contact (admin only) */
export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const body = await req.json()
    const { type, ...data } = body

    let result
    if      (type === 'social')           result = await updateSocialLinks(data, auth.id)
    else if (type === 'contact')          result = await updateContact(data, auth.id)
    else if (type === 'serviceArea')      result = await updateServiceArea(data, auth.id)
    else if (type === 'removeBulkOrder')  result = await removeBulkOrderImage(auth.id)
    else return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 })

    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
