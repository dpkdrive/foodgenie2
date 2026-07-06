/**
 * Run once to create the first admin in MongoDB:
 *   node scripts/seed-admin.mjs
 *
 * Requires MONGODB_URI in .env.local
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) { console.error('❌  MONGODB_URI not set in .env.local'); process.exit(1) }

const AdminSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, select: false },
  role:      { type: String, enum: ['superadmin','admin'], default: 'superadmin' },
  lastLogin: { type: Date, default: null },
}, { timestamps: true, collection: 'admins' })

const Admin = mongoose.models.Admin ?? mongoose.model('Admin', AdminSchema)

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false })
  console.log('✅  Connected to MongoDB')

  const email    = 'admin@foodgenie.com'
  const password = 'foodgenie@2025'
  const exists   = await Admin.findOne({ email })

  if (exists) {
    console.log('⚠️   Admin already exists:', email)
    await mongoose.disconnect()
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  await Admin.create({ name: 'Admin', email, password: hashed, role: 'superadmin' })

  console.log('✅  Admin created successfully')
  console.log('   Email   :', email)
  console.log('   Password:', password)
  await mongoose.disconnect()
}

seed().catch(err => { console.error('❌ ', err.message); process.exit(1) })
