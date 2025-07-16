import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Belka - Galleria di Viaggio',
  description: 'Carica e visualizza le tue foto di viaggio con informazioni aggiuntive',
  keywords: ['viaggio', 'foto', 'galleria', 'memoria', 'ricordi'],
  authors: [{ name: 'Belka Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Belka - Galleria di Viaggio',
    description: 'Carica e visualizza le tue foto di viaggio con informazioni aggiuntive',
    type: 'website',
    locale: 'it_IT',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-current">
          {children}
        </div>
      </body>
    </html>
  )
} 