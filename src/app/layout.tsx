import type { Metadata, Viewport } from 'next'
import { Exo_2 as Exo2 } from 'next/font/google'
import './globals.css'
import Navigation from '../components/Navigration'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Footer } from '@/components/Footer'
import NextTopLoader from 'nextjs-toploader';
import { Pool } from 'pg'
import { useServerSession } from '@/hooks/useSession'

const inter = Exo2({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'osu!lisek',
  description: 'Next-gen frontend of osu!lisek',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
})

export default async function RootLayout({
  children,
  modal
}: {
  children: React.ReactNode,
  modal: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <NextTopLoader />
        <div className={`bg-background-950 flex flex-col`}>
          <Navigation />
          <div className='flex flex-col items-center min-h-[100dvh]'>
            {children}
          </div>
          <Analytics />
          <SpeedInsights />
          <Footer />
        </div>

      {modal}
      </body>
    </html>
  )
}
