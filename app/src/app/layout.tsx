import type { Metadata } from 'next'
import { Lexend } from 'next/font/google'
import { headers } from 'next/headers'

import './globals.css'
import { Providers } from '@/lib/providers'
import DefaultLayout from '@/components/DefaultLayout'

const appFont = Lexend({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FONK',
  description: 'have a fun, phone-like conversation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = headers()

  return (
    <html
      lang="en"
      data-theme="light"
      style={{ colorScheme: 'light' }}
    >
      <head>
        <link
          href="data:image/x-icon;base64,AAABAAEAEBACAAAAAACwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAQAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AD4AAAAiAAAAIgAAACIAAAAiAAAAI/AAACAQAAAgEAAAIBAAACPwAAAiAAAAI/gAACAIAAAgCAAAIAgAAD/4AADB/wAAwf8AAMH/AADB/wAAwf8AAMAPAADADwAAwA8AAMAPAADADwAAwf8AAMAHAADABwAAwAcAAMAHAADABwAA"
          rel="icon"
          type="image/x-icon"
        />
      </head>
      <body
        style={{ backgroundColor: '#FFF' }}
        className={`${appFont.className} chakra-ui-light`}
      >
        <Providers cookies={headersList.get('cookie')}>
          <DefaultLayout>{children}</DefaultLayout>
        </Providers>
      </body>
    </html>
  )
}
