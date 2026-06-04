import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// Password hashing / crypto needs the Node.js runtime.
export const runtime = 'nodejs'

export const { GET, POST } = toNextJsHandler(auth)
