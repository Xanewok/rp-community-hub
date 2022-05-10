import { AppProps } from 'next/app'

import { DefaultSeo } from 'next-seo'
import { ChakraProvider } from '@chakra-ui/react'
import { Mainnet, Rinkeby, DAppProvider, Config } from '@usedapp/core'
import { useRouter } from 'next/router'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'

import '../styles/css/fonts.css'

import SEO from '../../next-seo.config'
import customTheme from '../styles/customTheme'

const config: Config = {
  autoConnect: true,
  networks: [Mainnet, Rinkeby],
  multicallVersion: 2,
}

function NextApp({ Component, pageProps, router }: AppProps): JSX.Element {
  const { pathname } = useRouter()
  return (
    <DAppProvider config={config}>
      <UserProvider supabaseClient={supabaseClient} pathname={pathname}>
        <ChakraProvider resetCSS theme={customTheme}>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
        </ChakraProvider>
      </UserProvider>
    </DAppProvider>
  )
}

export default NextApp
