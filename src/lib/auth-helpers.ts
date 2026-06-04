import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export type Role = 'student' | 'moderator' | 'admin'

export interface AuthResult {
  userId: string
  role: Role
  email: string
}

/** Returns the authenticated user (with role from the session), or throws a Response. */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Response('Unauthorized', { status: 401 })
  const u = session.user as { id: string; email: string; role?: string | null }
  return { userId: u.id, role: (u.role ?? 'student') as Role, email: u.email }
}

/** Requires moderator OR admin. */
export async function requireMod(): Promise<AuthResult> {
  const result = await requireAuth()
  if (result.role !== 'moderator' && result.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 })
  }
  return result
}

/** Requires admin only. */
export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth()
  if (result.role !== 'admin') {
    throw new Response('Forbidden', { status: 403 })
  }
  return result
}
