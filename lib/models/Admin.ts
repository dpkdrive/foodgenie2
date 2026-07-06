import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmin extends Document {
  name:       string
  email:      string
  password:   string       // bcrypt hashed
  role:       'superadmin' | 'admin'
  lastLogin:  Date | null
  createdAt:  Date
  updatedAt:  Date
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: 6,
      select:   false,   // never returned in queries by default
    },
    role: {
      type:    String,
      enum:    ['superadmin', 'admin'],
      default: 'admin',
    },
    lastLogin: {
      type:    Date,
      default: null,
    },
  },
  {
    timestamps: true,     // createdAt, updatedAt auto-managed
    collection: 'admins',
  }
)

const Admin: Model<IAdmin> =
  mongoose.models.Admin ?? mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
