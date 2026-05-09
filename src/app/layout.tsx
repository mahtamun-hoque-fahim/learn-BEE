import type { Metadata } from 'next'
import { Syne, Onest } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'learn·BEE — Basic Electrical Engineering',
  description: 'University-level BEE course: interactive theory, circuit simulators, quizzes, and certificates.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${onest.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
