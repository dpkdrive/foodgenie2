import mongoose, { Schema, Document, Model } from 'mongoose'

/* ── Sub-schemas ── */
interface IBanner {
  url:      string    // Cloudinary / local path
  altText:  string
  order:    number    // display order
}

interface ISocialLinks {
  facebook:  string
  instagram: string
  youtube:   string
  twitter:   string
}

interface IPackageBanners {
  balancedFood:   IBanner[]
  lowCalories:    IBanner[]
  bespokePackage: IBanner[]
}

export interface IServiceArea {
  enabled:            boolean
  lat:                number
  lng:                number
  radiusKm:           number
  bespokeRadiusKm:    number   // delivery radius for Bespoke plan (km)
  label:              string   // human-readable name e.g. "Sector 18, Noida"
  overAreaPricePerKm: number   // ₹ per km charged outside free radius
}

export interface ISettings extends Document {
  banners:          IPackageBanners
  socialLinks:      ISocialLinks
  contactPhone:     string
  contactEmail:     string
  serviceArea:      IServiceArea
  bulkOrderImage:   { url: string; altText: string }
  updatedBy:        mongoose.Types.ObjectId
  updatedAt:        Date
  createdAt:        Date
}

const BannerSchema = new Schema<IBanner>(
  {
    url:     { type: String, required: true },
    altText: { type: String, default: '' },
    order:   { type: Number, default: 0 },
  },
  { _id: false }
)

const SettingsSchema = new Schema<ISettings>(
  {
    banners: {
      balancedFood: {
        type:    [BannerSchema],
        default: [],
      },
      lowCalories: {
        type:    [BannerSchema],
        default: [],
      },
      bespokePackage: {
        type:    [BannerSchema],
        default: [],
      },
    },

    socialLinks: {
      facebook:  { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube:   { type: String, default: '' },
      twitter:   { type: String, default: '' },
    },

    contactPhone: {
      type:    String,
      default: '+91 99580 93268',
    },

    contactEmail: {
      type:    String,
      default: 'admin@foodgenie.com',
    },

    serviceArea: {
      enabled:            { type: Boolean, default: true },
      lat:                { type: Number,  default: 0 },
      lng:                { type: Number,  default: 0 },
      radiusKm:           { type: Number,  default: 5 },
      bespokeRadiusKm:    { type: Number,  default: 10 },
      label:              { type: String,  default: '' },
      overAreaPricePerKm: { type: Number,  default: 10 },
    },

    bulkOrderImage: {
      url:     { type: String, default: '' },
      altText: { type: String, default: '' },
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Admin',
    },
  },
  {
    timestamps: true,
    collection: 'settings',
  }
)

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as any).Settings
}

const Settings: Model<ISettings> =
  (mongoose.models.Settings as Model<ISettings>) ??
  mongoose.model<ISettings>('Settings', SettingsSchema)

export default Settings
