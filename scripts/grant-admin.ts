/**
 * Grant a role to a user by email.
 *
 *   DATABASE_URL=postgres://...  npx tsx scripts/grant-admin.ts you@email.com
 *   DATABASE_URL=postgres://...  npx tsx scripts/grant-admin.ts you@email.com moderator
 *
 * Role defaults to "admin". Valid: student | moderator | admin.
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import { users } from '../src/lib/db/schema'

const email = process.argv[2]
const role = (process.argv[3] ?? 'admin') as 'student' | 'moderator' | 'admin'

if (!email) {
  console.error('Usage: npx tsx scripts/grant-admin.ts <email> [student|moderator|admin]')
  process.exit(1)
}
if (!['student', 'moderator', 'admin'].includes(role)) {
  console.error(`Invalid role "${role}". Use student | moderator | admin.`)
  process.exit(1)
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!url) {
  console.error('Set DATABASE_URL (or DATABASE_URL_UNPOOLED) in the environment.')
  process.exit(1)
}

const db = drizzle(neon(url))

const updated = await db
  .update(users)
  .set({ role })
  .where(eq(users.email, email))
  .returning({ id: users.id, email: users.email, role: users.role })

if (updated.length === 0) {
  console.error(`No user found with email "${email}". Sign up first, then re-run.`)
  process.exit(1)
}
console.log('Updated:', updated[0])
