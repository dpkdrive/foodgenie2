import SameDayDeliveryPage from './SameDayDeliveryPage'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Same Day Delivery — FoodGenie',
  description: 'Order fresh food and get it delivered the same day.',
}

export default function Page() {
  return (
    <>
      <Navbar variant="inner" />
      <SameDayDeliveryPage />
    </>
  )
}
