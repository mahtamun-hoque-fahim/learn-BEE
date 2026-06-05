import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

/** Server-side admin gate for pages. Redirects unauthenticated -> sign-in, wrong role -> dashboard. */
export async function gateAdmin(redirectTo = '/admin') {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect(`/sign-in?redirect=${redirectTo}`)
  if ((session.user as { role?: string }).role !== 'admin') redirect('/dashboard')
}
