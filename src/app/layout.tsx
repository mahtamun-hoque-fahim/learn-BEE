import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import { ThemeProvider, themeInitScript } from '@/components/design/ThemeProvider'
import CommandPalette from '@/components/design/CommandPalette'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo'

// Plus Jakarta Sans serves both display (700/800) and body (400-600).
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'learnBEE — Basic Electrical Engineering, BGCTUB 2nd semester',
    template: '%s — learnBEE',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'BGCTUB Basic Electrical Engineering', 'EEE 1201', 'BEE 2nd semester',
    'basic electrical engineering notes', 'Sadiku fundamentals of electric circuits',
    'Boylestad introductory circuit analysis', 'nodal analysis', 'Thevenin theorem',
    'KVL KCL', 'RC transient', 'circuit simulator', 'BGCTUB CSE',
  ],
  authors: [{ name: 'Mahtamun Hoque Fahim' }],
  creator: 'Mahtamun Hoque Fahim',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: 'learnBEE — Basic Electrical Engineering, organised',
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'learnBEE — Basic Electrical Engineering, organised',
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  category: 'education',
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'learnBEE',
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  parentOrganization: { '@type': 'CollegeOrUniversity', name: 'BGC Trust University Bangladesh' },
}
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'en',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // --font-display reuses the Jakarta variable; both map to the same family.
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${mono.variable}`}
      style={{ ['--font-display' as string]: 'var(--font-sans)' }}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking script — set data-theme on <html> before paint. Dark is default. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  )
}
