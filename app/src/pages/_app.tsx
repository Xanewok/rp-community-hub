import { AppProps } from 'next/app'

import { DefaultSeo } from 'next-seo'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mainnet, Rinkeby, DAppProvider, Config } from '@usedapp/core'

import '../styles/css/fonts.css'

import SEO from '../../next-seo.config'
import GlobalStyle from '../styles'
import customTheme from '../styles/customTheme'

const MotionBox = motion(Box)

const config: Config = {
  autoConnect: true,
  networks: [Mainnet, Rinkeby],
}

function NextApp({ Component, pageProps, router }: AppProps): JSX.Element {
  return (
    <DAppProvider config={config}>
      <ChakraProvider resetCSS theme={customTheme}>
        <DefaultSeo {...SEO} />
        <GlobalStyle>
          <AnimatePresence exitBeforeEnter>
            <MotionBox
              key={router.route}
              animate="enter"
              as="main"
              exit="exit"
              flexGrow={1}
              initial="initial"
              variants={{
                initial: { opacity: 0, y: -10 },
                enter: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 10 },
              }}
            >
              <Component {...pageProps} />
            </MotionBox>
          </AnimatePresence>
        </GlobalStyle>
      </ChakraProvider>
    </DAppProvider>
  )
}

export default NextApp
