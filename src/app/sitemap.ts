import type { MetadataRoute } from 'next'
import { SITE_URL, INDEXABLE_STATIC_ROUTES } from '@/lib/seo'
import { inScopeChapters } from '@/lib/curriculum'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const statics = INDEXABLE_STATIC_ROUTES.map(route => ({
    url: `${SITE_URL}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : route === '/learn' ? 0.9 : 0.7,
  }))
  const chapters = inScopeChapters.map(ch => ({
    url: `${SITE_URL}/learn/${ch.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  return [...statics, ...chapters]
}
