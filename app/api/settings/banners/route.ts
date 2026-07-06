import { NextRequest, NextResponse } from 'next/server'
import { addBanner, removeBanner, updateBanners } from '@/lib/controllers/settings.controller'
import { requireAuth } from '@/lib/auth'

type PackageKey = 'balancedFood' | 'lowCalories' | 'bespokePackage'
const VALID_KEYS: PackageKey[] = ['balancedFood', 'lowCalories', 'bespokePackage']

/* POST /api/settings/banners — add banner to a package */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { packageKey, url, altText, order } = await req.json()
    if (!VALID_KEYS.includes(packageKey))
      return NextResponse.json({ success: false, message: 'Invalid packageKey' }, { status: 400 })
    if (!url)
      return NextResponse.json({ success: false, message: 'url is required' }, { status: 400 })

    const result = await addBanner(packageKey, { url, altText, order }, auth.id)
    return NextResponse.json({ success: true, data: result }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* PUT /api/settings/banners — replace all banners for a package */
export async function PUT(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { packageKey, banners } = await req.json()
    if (!VALID_KEYS.includes(packageKey))
      return NextResponse.json({ success: false, message: 'Invalid packageKey' }, { status: 400 })

    const result = await updateBanners(packageKey, banners ?? [], auth.id)
    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}

/* DELETE /api/settings/banners — remove single banner by url */
export async function DELETE(req: NextRequest) {
  const auth = requireAuth(req)
  if (auth instanceof NextResponse) return auth
  try {
    const { packageKey, url } = await req.json()
    if (!VALID_KEYS.includes(packageKey))
      return NextResponse.json({ success: false, message: 'Invalid packageKey' }, { status: 400 })

    const result = await removeBanner(packageKey, url, auth.id)
    return NextResponse.json({ success: true, data: result })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 })
  }
}
