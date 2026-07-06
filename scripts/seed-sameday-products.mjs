/**
 * Seed same-day delivery products (35min - 60min slot)
 *   node scripts/seed-sameday-products.mjs
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
  },
  { timestamps: true, collection: 'samedayproducts' }
)

SameDayProductSchema.pre('save', async function () {
  if (this.isNew) {
    const count    = await mongoose.model('SameDayProduct').countDocuments()
    this.productId = `SDP-${String(count + 1).padStart(3, '0')}`
  }
})

const SameDayProduct = mongoose.models.SameDayProduct || mongoose.model('SameDayProduct', SameDayProductSchema)

const TIMING = '35min - 60min'

const products = [
  /* ── Parathas & Breads ── */
  {
    title:       'Bharwan Tawa Paratha',
    description: '2pc Potato or cauliflower or cottage cheese stuffed Indian bread served with pickle, Amul butter and yoghurt',
    unit:        '2 pc',
    price:       199,
  },
  /* ── Pancakes & Uttapam ── */
  {
    title:       'Green Gram Pancakes',
    description: '2pc moong daal chilla with condiment rich in protein and taste',
    unit:        '2 pc',
    price:       249,
  },
  {
    title:       'Onion Uttapam',
    description: '2pcs with green chutney',
    unit:        '2 pc',
    price:       199,
  },
  {
    title:       'Vegetable Uttapam',
    description: '2pc with loaded vegetables',
    unit:        '2 pc',
    price:       259,
  },
  /* ── Toast & Oats ── */
  {
    title:       'Avocado Toast',
    description: 'Creamy guacamole on sour dough bread finished with cherry tomato and herbs',
    unit:        '1 plate',
    price:       379,
  },
  {
    title:       'Blueberry / Cranberry Oatmeal',
    description: 'Oatmeal in Mamra almond milk with dry fruits and your choice of berry',
    unit:        '1 bowl',
    price:       399,
  },
  /* ── Poha ── */
  {
    title:       'Indori Kanda Poha',
    description: 'Gluten free Indori savoury',
    unit:        '1 plate',
    price:       299,
  },
  {
    title:       'Vegetable Poha',
    description: 'Nutritious, tasty and gluten free savoury',
    unit:        '1 plate',
    price:       299,
  },
  /* ── Salad ── */
  {
    title:       'Blueberry / Cranberry Sprout Salad',
    description: '',
    unit:        '1 bowl',
    price:       349,
  },
  /* ── Maggi ── */
  {
    title:       'Chilly Garlic Maggi',
    description: '',
    unit:        '1 plate',
    price:       199,
  },
  {
    title:       'Mix Veg Butter Maggi',
    description: 'Vegetable Maggi loaded with Mushroom, bell pepper, green peas, onion, tomato',
    unit:        '1 plate',
    price:       299,
  },
  {
    title:       'Butter Fried Vegetable Maggi',
    description: '',
    unit:        '1 plate',
    price:       299,
  },
  /* ── Rice & Noodles ── */
  {
    title:       'Fried Rice',
    description: '',
    unit:        '1 plate',
    price:       249,
  },
  {
    title:       'Veg Chowmein',
    description: '',
    unit:        '1 plate',
    price:       259,
  },
  /* ── Eggs ── */
  {
    title:       'Boiled Eggs',
    description: '4 eggs with side of onion and tomato. Complimentary two wheat toast.',
    unit:        '4 eggs',
    price:       179,
  },
  {
    title:       'Omelette — Classic',
    description: '3 eggs | onions and green chilly. Complimentary two wheat toast.',
    unit:        '3 eggs',
    price:       199,
  },
  {
    title:       'Omelette — Exotic Veg',
    description: '3 eggs | exotic vegetables. Complimentary two wheat toast.',
    unit:        '3 eggs',
    price:       249,
  },
  {
    title:       'Scrambled Eggs',
    description: '4 eggs | onions, green chilly. Complimentary two wheat toast.',
    unit:        '4 eggs',
    price:       249,
  },
  /* ── Combos ── */
  {
    title:       'Tadka Dahi with Basmati Rice',
    description: 'Satisfying wholesome food',
    unit:        '1 plate',
    price:       299,
  },
  {
    title:       'Veg Pulao with Raita',
    description: '',
    unit:        '1 plate',
    price:       299,
  },
  {
    title:       'Paneer Bhurji with 3 Parathas',
    description: '',
    unit:        '1 plate',
    price:       259,
  },
  {
    title:       'Churchur Paratha with Pickle and Curd',
    description: '',
    unit:        '1 plate',
    price:       229,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅  Connected to MongoDB')

  let added = 0, skipped = 0

  for (const p of products) {
    const exists = await SameDayProduct.findOne({ title: p.title })
    if (exists) { console.log(`⏭   Skip (exists): ${p.title}`); skipped++; continue }

    const doc = new SameDayProduct({ ...p, timing: TIMING, status: 'Published' })
    await doc.save()
    console.log(`✅  Added: ${doc.productId} — ${p.title} ₹${p.price}`)
    added++
  }

  console.log(`\n🎉  Done — ${added} added, ${skipped} skipped`)
  await mongoose.disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
