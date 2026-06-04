import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import { ThemeProvider, themeInitScript } from '@/components/design/ThemeProvider'
import CommandPalette from '@/components/design/CommandPalette'

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
  title: 'learnBEE — Basic Electrical Engineering, BGCTUB 45th',
  description: 'Lecture notes, lab manuals, past papers, animated simulators and exam-ready quizzes for the 2nd-semester BEE course at BGCTUB.',
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
