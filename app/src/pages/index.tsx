import {
  Container,
  Heading,
  Text,
  Button,
  Box,
  Img,
  Flex,
  Tooltip,
  Link,
  OrderedList,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useCall, useEthers, useGasPrice, useInterval } from '@usedapp/core'
import { TOKEN_ADDRESS, SEEDERV2_CONTRACT } from '../constants'
import Status from '../components/Status'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { useNextSeed } from '../hooks'
import { SideNavLink } from '../components/SideNavLink'

// TODO: Boss table for calculating your CFTI earnings based on boss
// TODO: Move inline styles into chakra theme
// TODO: Move more functions into separate files
// TODO: More layout changes
// TODO: Ability to track multiple wallets and aggregate the data
// TODO: Maybe on hover over each account shows pending cfti + wallet
// TODO: URL path for easy saving/sharing
// TODO: General app cleanup, constants, etc

const Home: NextPage = () => {
  const {
    activateBrowserWallet,
    active,
    deactivate,
    account,
    chainId,
    library,
  } = useEthers()

  const nextSeedBatch = Number(useNextSeed())
  const [timeTillSeed, setTimeTillSeed] = useState(NaN)
  useInterval(() => {
    setTimeTillSeed(nextSeedBatch * 1000 - new Date().getTime())
  }, 1000)

  const gasPrice = useGasPrice()

  const doSeed = useCallback(() => {
    const signer = account && library?.getSigner(account)
    if (signer) {
      SEEDERV2_CONTRACT.connect(signer).executeRequestMulti() // from SeederV2
    }
  }, [account, library])

  useEffect(() => {
    if (!active) {
      activateBrowserWallet()
    }
  })

  return (
    <>
      <Flex flexDirection={['column', 'column', 'row']} h="100%">
        <Box
          flexShrink={0}
          zIndex={50}
          position="relative"
          w={[null, null, '25%', '20%']}
          maxW={[null, null, null, '263px']}
          bg="red.500"
        >
          <Box
            as="nav"
            w="100%"
            h={[null, null, '100%']}
            bg={['indigo.800', 'indigo.800', 'indigo.600']}
            py={[null, null, 8]}
            px={[null, null, 5]}
            top={0}
          >
            <Flex
              display={[null, null, 'none']}
              h="56px"
              pr="3"
              alignItems="center"
              // justify="space-between"
            >
              <Flex alignItems="center" justify="space-between">
                <Box p={2} pt={0}>
                  <Box w="48px" h="48px" position="relative">
                    <Box
                      h="3px"
                      w="32px"
                      left="8px"
                      top="17px"
                      bg="indigo.100"
                      position="absolute"
                    ></Box>
                    <Box
                      h="3px"
                      w="32px"
                      left="8px"
                      top="29px"
                      bg="indigo.100"
                      position="absolute"
                    ></Box>
                  </Box>
                </Box>
                <Img
                  h="32px"
                  w={24}
                  position="relative"
                  // h="100%"
                  // w="100%"
                  style={{ imageRendering: 'pixelated' }}
                  src="/logo.png"
                />
                <Img
                  justifySelf="right"
                  w={12}
                  h={12}
                  rounded="full"
                  src="/hero.png"
                />
              </Flex>
            </Flex>
            <Flex
              w="100%"
              h="100%"
              flexDirection="column"
              display={['none', 'none', 'flex']}
              // justify="space-between"
            >
              <Box px={[null, null, 0]} w="66.66667%">
                <Img style={{ imageRendering: 'pixelated' }} src="/logo.png" />
              </Box>
              <UnorderedList
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                overflowX="auto"
                variant="unstyled"
                m={0}
                mt={4}
                p={0}
              >
                <SideNavLink type="raid" />
                <SideNavLink type="wallet" />
                <SideNavLink type="summon" />
                <SideNavLink type="enhance" />
                <SideNavLink type="guild" />
                <SideNavLink type="market" selected />
              </UnorderedList>
            </Flex>
          </Box>
        </Box>

        <Flex justifyContent="center" p="10px">
          <Heading
            pt="20px"
            size="lg"
            mb="50px"
            textAlign="center"
            color="white"
          >
            <Img w="16rem" src="/logo.png" /> Collect rewards
          </Heading>
          <Flex mt="25px" position="absolute" w="95%" justifyContent="right">
            <Tooltip
              bg="purple.300"
              color="white"
              placement="left"
              hasArrow
              label={
                'You can speed up hero/fighter reveal by manually updating the global random seed used by the game'
              }
            >
              <Button
                size="xs"
                pb="6px"
                mr="20px"
                isDisabled={
                  !account || isNaN(nextSeedBatch) || timeTillSeed > 0
                }
                onClick={doSeed}
              >
                Next seed{' '}
                {!account
                  ? 'unavailable'
                  : timeTillSeed <= 0
                  ? 'available'
                  : `in ${new Date(timeTillSeed).toLocaleTimeString([], {
                      minute: '2-digit',
                      second: '2-digit',
                    })}`}
              </Button>
            </Tooltip>
            <Button size="xs" pb="6px" mr="20px" isDisabled={true}>
              {`⛽ ${Math.trunc((Number(gasPrice) || 0) / 10 ** 9)} gwei`}
            </Button>
            <Tooltip
              bg="purple.300"
              color="white"
              placement="left"
              hasArrow
              label={account ? account : 'Click to connect your wallet'}
            >
              <Button
                size="xs"
                pb="6px"
                onClick={() => {
                  if (account) {
                    deactivate()
                  } else {
                    activateBrowserWallet()
                  }
                }}
              >
                {account ? 'Connected' : 'Connect Wallet'}
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
        {account && chainId !== 1 && (
          <>
            <Text color="red" textAlign="center" fontSize="xl">
              Error: Please connect to Ethereum Mainnet.
            </Text>
          </>
        )}
        <Container maxW="100%">
          <Status connected={account} />
        </Container>
      </Flex>
    </>
  )
}

export default Home
