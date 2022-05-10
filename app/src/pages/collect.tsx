import type { NextPage } from 'next'
import { useEthers } from '@usedapp/core'
import { useEffect } from 'react'
import { WithNavigation } from '../components/WithNavigation'
import { Box, Heading } from '@chakra-ui/react'

const Collect: NextPage = () => {
  const { activateBrowserWallet, active } = useEthers()

  useEffect(() => {
    if (!active) {
      activateBrowserWallet()
    }
  })

  return (
    <WithNavigation>
      <CollectInner />
    </WithNavigation>
  )
}

export default Collect

const CollectInner: React.FC = (props) => (
  <Box position="relative" h="100%" w="100%" overflow="auto">
    <Box
      w="100%"
      minHeight="100%"
      p={10}
      backgroundAttachment="fixed"
      backgroundSize="cover"
      backgroundImage="/tiles.png"
    >
      <Heading textColor="white" lineHeight="36px" mb={0}>
        Collect rewards
      </Heading>
    </Box>
  </Box>
)