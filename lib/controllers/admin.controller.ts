import bcrypt from 'bcryptjs'
import { connectDB } from '../db'
import Admin from '../models/Admin'
import { signToken } from '../auth'

/* ── Login ── */
export async function loginAdmin(email: string, password: string) {
  await connectDB()

  const admin = await Admin.findOne({ email }).select('+password')
  if (!admin) throw new Error('Invalid email or password')

  const match = await bcrypt.compare(password, admin.password)
  if (!match) throw new Error('Invalid email or password')

  await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() })

  const token = signToken({ id: admin._id.toString(), email: admin.email, role: admin.role })
  return {
    token,
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  }
}

/* ── Get all admins ── */
export async function getAllAdmins() {
  await connectDB()
  return Admin.find().select('-password').sort({ createdAt: -1 })
}

/* ── Get single admin ── */
export async function getAdminById(id: string) {
  await connectDB()
  const admin = await Admin.findById(id).select('-password')
  if (!admin) throw new Error('Admin not found')
  return admin
}

/* ── Create admin ── */
export async function createAdmin(data: {
  name: string; email: string; password: string; role?: 'admin' | 'superadmin'
}) {
  await connectDB()
  const exists = await Admin.findOne({ email: data.email })
  if (exists) throw new Error('Email already registered')

  const hashed = await bcrypt.hash(data.password, 12)
  const admin  = await Admin.create({ ...data, password: hashed })
  const { password: _, ...safe } = admin.toObject()
  return safe
}

/* ── Change password ── */
export async function changePassword(id: string, currentPassword: string, newPassword: string) {
  await connectDB()
  const admin = await Admin.findById(id).select('+password')
  if (!admin) throw new Error('Admin not found')

  const match = await bcrypt.compare(currentPassword, admin.password)
  if (!match) throw new Error('Current password is incorrect')

  admin.password = await bcrypt.hash(newPassword, 12)
  await admin.save()
  return { message: 'Password updated successfully' }
}

/* ── Delete admin ── */
export async function deleteAdmin(id: string) {
  await connectDB()
  const admin = await Admin.findByIdAndDelete(id)
  if (!admin) throw new Error('Admin not found')
  return { message: 'Admin deleted' }
}
