import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import ModClient from './ModClient'

export default async function ModPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in?redirect=/mod')
  const role = (session.user as { role?: string }).role
  if (role !== 'moderator' && role !== 'admin') redirect('/dashboard')
  return <ModClient />
}
