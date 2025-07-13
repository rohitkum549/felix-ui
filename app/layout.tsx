import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProviderWrapper } from '@/components/providers/auth-provider-wrapper'

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
      <body>
        <AuthProviderWrapper>
          {children}
          <Toaster />
        </AuthProviderWrapper>
      </body>
    </html>
  )
}
