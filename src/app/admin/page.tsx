import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import AdminClient from './AdminClient'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in?redirect=/admin')
  if ((session.user as { role?: string }).role !== 'admin') redirect('/dashboard')
  return <AdminClient />
}
