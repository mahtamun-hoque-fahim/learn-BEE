import { buildContentRoutes } from '@/lib/content-routes'

const handlers = buildContentRoutes('books')

export const GET    = handlers.GET
export const POST   = handlers.POST
export const PATCH  = handlers.PATCH
export const DELETE = handlers.DELETE
