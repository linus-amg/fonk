'use client'

import theme from '@/theme'
import { CacheProvider, Link } from '@chakra-ui/next-js'
import { ColorModeScript, cookieStorageManagerSSR, forwardRef, localStorageManager } from '@chakra-ui/react'
import { ModalsProvider, SaasProvider } from '@saas-ui/react'
import { Url } from 'next/dist/shared/lib/router/router'
import { useState } from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const NextLink = forwardRef((props, ref) => (
  <Link
    ref={ref}
    href={props.href as Url}
    {...props}
  />
))

export function Providers({
  children,

  cookies,
}: {
  children: React.ReactNode
  cookies: string | null
}) {
  const [client] = useState(new QueryClient())
  const colorModeManager = typeof cookies === 'string' ? cookieStorageManagerSSR(cookies) : localStorageManager

  return (
    <CacheProvider>
      <SaasProvider
        theme={theme}
        resetCSS
        linkComponent={NextLink}
        colorModeManager={colorModeManager}
      >
        <ModalsProvider>
          <ColorModeScript
            type="cookie"
            initialColorMode={theme.config.initialColorMode}
          />
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        </ModalsProvider>
      </SaasProvider>
    </CacheProvider>
  )
}
