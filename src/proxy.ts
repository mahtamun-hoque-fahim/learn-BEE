import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Optimistic, edge-safe gate: checks the session cookie only (no DB).
// Role enforcement happens server-side in the route handlers / pages.
export function proxy(req: NextRequest) {
  const cookie = getSessionCookie(req)
  if (!cookie) {
    const url = new URL('/sign-in', req.url)
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/mod/:path*'],
}
