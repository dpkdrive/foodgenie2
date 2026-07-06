import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/controllers/settings.controller'

/* Haversine formula — returns distance in km between two coordinates */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R  = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/*
 * GET /api/delivery-check?lat=28.123&lng=77.456
 * Returns { serviceable: bool, distanceKm: number, radiusKm: number, label: string }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat        = parseFloat(searchParams.get('lat') ?? '')
    const lng        = parseFloat(searchParams.get('lng') ?? '')
    const isBespoke  = searchParams.get('type') === 'bespoke'

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ success: false, message: 'lat and lng are required' }, { status: 400 })
    }

    const settings    = await getSettings()
    const serviceArea = (settings as any).serviceArea

    /* Not configured at all → block booking until admin sets it up */
    if (!serviceArea || (!serviceArea.lat && !serviceArea.lng)) {
      return NextResponse.json({ success: false, message: 'Service area not configured by admin yet.' }, { status: 503 })
    }

    /* Check explicitly disabled → allow everyone */
    if (serviceArea.enabled === false) {
      return NextResponse.json({ success: true, serviceable: true, distanceKm: 0, radiusKm: serviceArea.radiusKm ?? 5, label: serviceArea.label ?? '' })
    }

    /* Enabled but missing coords */
    if (!serviceArea.lat || !serviceArea.lng) {
      return NextResponse.json({ success: false, message: 'Service area coordinates not set. Please contact admin.' }, { status: 503 })
    }

    const distanceKm = haversine(lat, lng, serviceArea.lat, serviceArea.lng)

    if (isBespoke) {
      const bespokeRadiusKm = serviceArea.bespokeRadiusKm ?? 10
      const serviceable     = distanceKm <= bespokeRadiusKm
      return NextResponse.json({
        success:          true,
        serviceable,
        notDeliverable:   !serviceable,
        distanceKm:       Math.round(distanceKm * 10) / 10,
        radiusKm:         bespokeRadiusKm,
        label:            serviceArea.label ?? '',
        deliveryChargePerDay: 0,
      })
    }

    const serviceable         = distanceKm <= serviceArea.radiusKm
    const overAreaPricePerKm  = serviceArea.overAreaPricePerKm ?? 10
    const extraKm             = Math.max(0, distanceKm - serviceArea.radiusKm)
    const deliveryChargePerDay = serviceable ? 0 : Math.ceil(extraKm * overAreaPricePerKm)

    return NextResponse.json({
      success:              true,
      serviceable,
      distanceKm:           Math.round(distanceKm * 10) / 10,
      radiusKm:             serviceArea.radiusKm,
      label:                serviceArea.label ?? '',
      overAreaPricePerKm,
      deliveryChargePerDay,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}
