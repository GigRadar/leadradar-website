import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadRadar — The GTM Signal Marketplace',
  description: 'Crowd-sourced intent signals from Telegram, Upwork, Reddit and 50+ sources. Pipe directly into Clay, Apollo, HeyReach, Instantly.',
  openGraph: {
    title: 'LeadRadar — The GTM Signal Marketplace',
    description: 'The signal layer your GTM stack is missing.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
