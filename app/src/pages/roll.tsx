import type { NextPage } from 'next'
import { ChainId, useEthers, useGasPrice, useNetwork } from '@usedapp/core'
import { useEffect } from 'react'
import { WithNavigation } from '../components/WithNavigation'
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react'
import ConfettiRoll from '../components/ConfettiRoll'
import { InfoShield } from '../components/InfoShield'
import { NextSeed } from '../components/NextSeed'
import { useContracts } from '../constants'

const Roll: NextPage = () => {
  const { activateBrowserWallet, active } = useEthers()

  useEffect(() => {
    if (!active) {
      activateBrowserWallet()
    }
  })

  return (
    <WithNavigation>
      <RollInner />
    </WithNavigation>
  )
}

export default Roll

const RollInner: React.FC = (props) => {
  const gasPrice = useGasPrice()
  const {
    network: { chainId },
  } = useNetwork()

  const { ConfettiRoll: ConfettiRollContract } = useContracts()

  return (
    <Box position="relative" h="100%" w="100%" overflow="auto">
      <Flex position="absolute" top={10} right={10} zIndex={10}>
        <NextSeed />
        <InfoShield
          value={`⛽ ${Math.trunc((Number(gasPrice) || 0) / 10 ** 9)}`}
        />
        <InfoShield type="cftiBalance" />
      </Flex>

      <Box
        w="100%"
        minHeight="100%"
        p={10}
        backgroundAttachment="fixed"
        backgroundSize="cover"
        backgroundImage="/tiles.png"
      >
        <Heading textColor="white" lineHeight="36px" mb={0}>
          Roll party
        </Heading>
        <ConfettiRoll connected={true} />
        <Box mt="80px" textAlign="center" textColor="white.50">
          <Text color="white">
            Important: This an unofficial game for{' '}
            <Link color="purple.900" href="https://raid.party/">
              Raid Party
            </Link>
            .{' '}
          </Text>
          <Text color="white">
            This is not officially endorsed, but you can review the source code
            yourself{' '}
            <Link
              color="purple.900"
              href="https://github.com/Xanewok/cfti-shop"
            >
              here
            </Link>
            .
          </Text>
          <Text color="white">
            Please{' '}
            <Text as="span" fontWeight="bold">
              do read
            </Text>{' '}
            the contract yourself, it&apos;s at{' '}
            <Link
              color="purple.900"
              href={`https://${
                chainId == ChainId.Rinkeby ? 'rinkeby.' : ''
              }etherscan.io/address/${ConfettiRollContract.address}#code`}
            >
              {`${ConfettiRollContract.address.slice(
                0,
                6
              )}...${ConfettiRollContract.address.slice(-4)}`}
            </Link>
            .
          </Text>
          <Text color="white">
            You&apos;re interacting with the contract at your own
            responsibility.
          </Text>
          <Text color="white">Game entry bets include a 0.5% service fee.</Text>
        </Box>
        <Box mt="20px" mb="5px" textAlign="center">
          <Text color="white">
            Based on RP{' '}
            <Link
              color="purple.900"
              href="https://raidpartytracker.eth.limo"
              target="_blank"
            >
              tracker{' '}
            </Link>
            by:{' '}
            <Link
              color="purple.900"
              href="https://oktal.eth.link"
              target="_blank"
            >
              oktal.eth
            </Link>
          </Text>
          <Text color="white">
            Made by:{' '}
            <Link
              color="purple.900"
              href="https://github.com/Xanewok"
              target="_blank"
            >
              xanewok.eth
            </Link>
          </Text>
          <Text color="white">
            Twitter:{' '}
            <Link
              color="purple.900"
              href="https://twitter.com/xanecrypto"
              target="_blank"
            >
              @xanecrypto
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
