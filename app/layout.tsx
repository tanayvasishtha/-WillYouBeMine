import type { Metadata } from 'next'
import Script from 'next/script'
import { Quicksand, Nunito } from 'next/font/google'

import './globals.css'

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'Will You Be My Valentine? 💕',
  description: 'A special Valentine\'s Day message for someone special',
  openGraph: {
    title: 'Will You Be My Valentine? 💕',
    description: 'A special Valentine\'s Day message for someone special',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunito.variable}`}>
      <body className="font-nunito antialiased">
        <Script
          src="https://open.spotify.com/embed/iframe-api/v1"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  )
}
