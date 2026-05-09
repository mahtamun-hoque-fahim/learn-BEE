import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export type Role = 'student' | 'moderator' | 'admin'

export interface AuthResult {
  userId: string
  role: Role
  email: string
}

/** Returns the authenticated user with their DB role, or throws a Response. */
export async function requireAuth(): Promise<AuthResult> {
  const { userId } = await auth()
  if (!userId) throw new Response('Unauthorized', { status: 401 })

  const db = getDb()
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user) throw new Response('User not found', { status: 404 })

  return { userId, role: user.role as Role, email: user.email }
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
