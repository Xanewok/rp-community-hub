import type { NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { useEffect } from 'react'
import { WithNavigation } from '../components/WithNavigation'
import { Marketplace } from '../components/Marketplace'

const Home: NextPage = () => {
  const { activateBrowserWallet, active } = useEthers()

  useEffect(() => {
    if (!active) {
      activateBrowserWallet()
    }
  })

  return (
    <WithNavigation>
      <Marketplace />
    </WithNavigation>
  )
}

export default Home
