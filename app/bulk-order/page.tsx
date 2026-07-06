import { getSettings } from '@/lib/controllers/settings.controller'
import BulkOrderBody from './BulkOrderBody'

export const dynamic = 'force-dynamic'

export default async function BulkOrderPage() {
  const settings = await getSettings()
  const imageUrl = settings?.bulkOrderImage?.url ?? ''
  return <BulkOrderBody imageUrl={imageUrl} />
}
