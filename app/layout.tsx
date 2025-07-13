import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Felix',
  description: 'A Next.js app powered by Felix',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
