/**
 * Seed same-day delivery products (2hrs - 4hrs slot)
 *   node scripts/seed-sameday-2hrs.mjs
 *
 * Added in REVERSE order so newest-first sort shows them in original sequence.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'

config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('❌  MONGODB_URI not set in .env.local'); process.exit(1) }

const SameDayProductSchema = new mongoose.Schema(
  {
    productId:   { type: String, unique: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price:       { type: Number, required: true },
    image:       { type: String, default: '' },
    unit:        { type: String, default: '', trim: true },
    timing:      { type: String, required: true, trim: true },
    status:      { type: String, enum: ['Published', 'Draft', 'Pending'], default: 'Published' },
    featured:    { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'samedayproducts' }
)

SameDayProductSchema.pre('save', async function () {
  if (this.isNew) {
    const last = await mongoose.model('SameDayProduct')
      .findOne({ productId: /^SDP-/ })
      .sort({ productId: -1 })
      .select('productId')
      .lean()
    const lastNum = last?.productId ? parseInt(last.productId.replace('SDP-', ''), 10) : 0
    this.productId = `SDP-${String(lastNum + 1).padStart(3, '0')}`
  }
})

const SameDayProduct = mongoose.models.SameDayProduct || mongoose.model('SameDayProduct', SameDayProductSchema)

const TIMING = '2hrs - 4hrs'

// Listed in DISPLAY order — script reverses before inserting
const products = [
  /* ── Indian Mains ── */
  { title: 'Matar Paneer',          description: '',               unit: '1 plate', price: 449 },
  { title: 'Shahi Paneer',          description: '',               unit: '1 plate', price: 449 },
  { title: 'Paneer Butter Masala',  description: '',               unit: '1 plate', price: 459 },
  { title: 'Daal Makhanwali',       description: '',               unit: '1 bowl',  price: 429 },
  { title: 'Daal Ghee Tadka',       description: '',               unit: '1 bowl',  price: 329 },
  { title: 'Rajma',                 description: '',               unit: '1 bowl',  price: 349 },
  { title: 'Cholay',                description: '',               unit: '1 bowl',  price: 359 },
  { title: 'Palak Paneer',          description: '',               unit: '1 plate', price: 429 },
  { title: 'Matar Mushroom',        description: '',               unit: '1 plate', price: 419 },

  /* ── International & Salads ── */
  { title: 'Tofu Edamame Salad',    description: 'With teriyaki sauce',                              unit: '1 bowl',  price: 429 },
  { title: 'Asparagus Sushi',       description: '4 pcs',                                            unit: '4 pc',    price: 625 },
  { title: 'Mango Sticky Rice',     description: '',                                                 unit: '1 plate', price: 550 },
  { title: 'Paneer Bowl',           description: 'Jasmine rice, chunks of paneer and vegetables',   unit: '1 bowl',  price: 629 },
  { title: 'Mango & Avocado Salad', description: '',                                                 unit: '1 plate', price: 379 },

  /* ── Staples ── */
  { title: 'Basmati Rice',          description: 'Full portion',   unit: '1 plate', price: 239 },
  { title: 'Dry Fruits Ghee Rice',  description: '',               unit: '1 plate', price: 299 },
  { title: 'Plain Parathas',        description: '8 pieces',       unit: '8 pc',    price: 299 },

  /* ── Chicken ── */
  { title: 'Chicken Curry',         description: '4 pieces',       unit: '4 pc',    price: 559 },
  { title: 'Chicken Curry',         description: '8 pieces',       unit: '8 pc',    price: 999 },
  { title: 'Butter Chicken (Half)', description: '4 pieces',       unit: '4 pc',    price: 669 },
  { title: 'Butter Chicken (Full)', description: '8 pieces',       unit: '8 pc',    price: 1200 },

  /* ── Combos ── */
  {
    title:       'Tadka Daal Combo',
    description: 'With 3 parathas, 2 ghee chapati or rice only. Please mention your choice in note section.',
    unit:        '1 plate', price: 299,
  },
  {
    title:       'Rajma Combo',
    description: 'With 3 parathas, 2 ghee chapati and rice or rice only. Please mention your choice in note section.',
    unit:        '1 plate', price: 299,
  },
  {
    title:       'Matar Paneer Combo',
    description: 'With 3 parathas, 2 ghee chapati or rice only. Please mention your choice in note section.',
    unit:        '1 plate', price: 349,
  },
  {
    title:       'Shahi Paneer Combo',
    description: 'With 3 parathas, 2 ghee chapati and rice or rice only. Please mention your choice in note section.',
    unit:        '1 plate', price: 359,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to MongoDB')

  // Reverse so newest-first display matches original list order
  const reversed = [...products].reverse()

  let added = 0, skipped = 0

  for (const p of reversed) {
    const exists = await SameDayProduct.findOne({ title: p.title, timing: TIMING, price: p.price })
    if (exists) { console.log(`⏭   Skip: ${p.title} ₹${p.price}`); skipped++; continue }

    const doc = new SameDayProduct({ ...p, timing: TIMING, status: 'Published' })
    await doc.save()
    console.log(`✅  Added: ${doc.productId} — ${p.title} ₹${p.price}`)
    added++
  }

  console.log(`\n🎉  Done — ${added} added, ${skipped} skipped`)
  await mongoose.disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
