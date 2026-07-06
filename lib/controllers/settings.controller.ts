import { connectDB } from '../db'
import Settings from '../models/Settings'

/* ── Get settings (always single doc) ── */
export async function getSettings() {
  await connectDB()
  let settings = await Settings.findOne()
  if (!settings) settings = await Settings.create({})   // seed defaults on first call
  return settings
}

/* ── Update banners for a package ── */
export async function updateBanners(
  packageKey: 'balancedFood' | 'lowCalories' | 'bespokePackage',
  banners: { url: string; altText?: string; order?: number }[],
  adminId: string
) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    {
      $set: {
        [`banners.${packageKey}`]: banners,
        updatedBy: adminId,
      },
    },
    { new: true, upsert: true }
  )
  return settings
}

/* ── Add single banner to a package ── */
export async function addBanner(
  packageKey: 'balancedFood' | 'lowCalories' | 'bespokePackage',
  banner: { url: string; altText?: string; order?: number },
  adminId: string
) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    {
      $push:  { [`banners.${packageKey}`]: banner },
      $set:   { updatedBy: adminId },
    },
    { new: true, upsert: true }
  )
  return settings
}

/* ── Remove banner from a package by url ── */
export async function removeBanner(
  packageKey: 'balancedFood' | 'lowCalories' | 'bespokePackage',
  url: string,
  adminId: string
) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    {
      $pull: { [`banners.${packageKey}`]: { url } },
      $set:  { updatedBy: adminId },
    },
    { new: true }
  )
  return settings
}

/* ── Update social links ── */
export async function updateSocialLinks(
  links: { facebook?: string; instagram?: string; youtube?: string; twitter?: string },
  adminId: string
) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: { socialLinks: links, updatedBy: adminId } },
    { new: true, upsert: true }
  )
  return settings
}

/* ── Update contact info ── */
export async function updateContact(
  data: { contactPhone?: string; contactEmail?: string },
  adminId: string
) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: { ...data, updatedBy: adminId } },
    { new: true, upsert: true }
  )
  return settings
}

/* ── Update bulk order image ── */
export async function updateBulkOrderImage(
  url: string,
  altText: string,
  adminId: string
) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: { bulkOrderImage: { url, altText }, updatedBy: adminId } },
    { new: true, upsert: true }
  )
  return settings
}

/* ── Remove bulk order image ── */
export async function removeBulkOrderImage(adminId: string) {
  await connectDB()
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: { 'bulkOrderImage.url': '', 'bulkOrderImage.altText': '', updatedBy: adminId } },
    { new: true, upsert: true }
  )
  return settings
}

/* ── Update service area ── */
export async function updateServiceArea(
  data: { enabled?: boolean; lat?: number; lng?: number; radiusKm?: number; bespokeRadiusKm?: number; label?: string; overAreaPricePerKm?: number },
  adminId: string
) {
  await connectDB()
  const $set: Record<string, any> = { updatedBy: adminId }
  if (data.enabled             !== undefined) $set['serviceArea.enabled']             = data.enabled
  if (data.lat                 !== undefined) $set['serviceArea.lat']                 = data.lat
  if (data.lng                 !== undefined) $set['serviceArea.lng']                 = data.lng
  if (data.radiusKm            !== undefined) $set['serviceArea.radiusKm']            = data.radiusKm
  if (data.bespokeRadiusKm     !== undefined) $set['serviceArea.bespokeRadiusKm']     = data.bespokeRadiusKm
  if (data.label               !== undefined) $set['serviceArea.label']               = data.label
  if (data.overAreaPricePerKm  !== undefined) $set['serviceArea.overAreaPricePerKm']  = data.overAreaPricePerKm

  const settings = await Settings.findOneAndUpdate(
    {},
    { $set },
    { new: true, upsert: true, strict: false }
  )
  return settings
}
