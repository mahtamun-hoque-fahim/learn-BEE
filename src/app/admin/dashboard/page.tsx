import { gateAdmin } from '@/lib/page-guards'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  await gateAdmin('/admin/dashboard')
  return <AdminDashboardClient />
}
