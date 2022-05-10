import type { NextPage } from 'next'
import { ChainId, useEthers, useGasPrice, useNetwork } from '@usedapp/core'
import { useEffect } from 'react'
import { WithNavigation } from '../components/WithNavigation'
import {
  Box,
  Flex,
  Heading,
  Text,
  Link,
  ListItem,
  OrderedList,
} from '@chakra-ui/react'
import ConfettiRoll from '../components/ConfettiRoll'
import { InfoShield } from '../components/InfoShield'
import { NextSeed } from '../components/NextSeed'
import { useContracts } from '../constants'
import BatchClaim from '../components/BatchClaim'

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

const CollectInner: React.FC = (props) => {
  const gasPrice = useGasPrice()
  const {
    network: { chainId },
  } = useNetwork()

  const { RpYieldCollector } = useContracts()

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
          Collect rewards
        </Heading>
	<BatchClaim connected={true} />
        {/* <ConfettiRoll connected={true} /> */}
        <Box mt="80px" mx="2em" textAlign="center" textColor="white">
          <Heading textAlign="center" color="white">
            Overview
          </Heading>

          <Text mb="1em" fontSize="2xl" color="white">
            This tool lets you claim your CFTI rewards from multiple wallets
            with just one transaction.
            <Text mt="0.3em" fontSize="2xl" color="white">
              In addition to a simple batch rewards claim, it also supports (for
              a 0.5% service fee):
            </Text>
            <Flex justify={'center'}>
              <OrderedList textAlign="left">
                <ListItem>
                  collecting all the rewards to a single address of your
                  choosing
                </ListItem>
                <ListItem>
                  collecting a reward tax and sending it to another account
                  (e.g. guild wallet)
                </ListItem>
              </OrderedList>
            </Flex>
            <Heading mt="1em" textAlign="center" color="white">
              Instructions
            </Heading>
            <Flex justify={'center'}>
              <OrderedList mt="-0.5em" fontSize="2xl" textAlign="left">
                <ListItem>
                  For each wallet, approve our contract to move the
                  wallet&apos;s $CFTI
                  <Text fontSize="lg" color="white">
                    (make sure it&apos;s active in your MetaMask/Web3 provider)
                  </Text>
                </ListItem>
                <ListItem>
                  For each wallet, authorize an operator that will manage its
                  funds via this contract
                  <Text fontSize="lg" color="white">
                    (make sure it&apos;s active and select the operator from the
                    drop-down that you wish to authorize)
                  </Text>
                </ListItem>
                <ListItem>
                  Optionally, enable the accumulate and/or the tax feature and
                  fill the addresses
                </ListItem>
                <ListItem>
                  Claim the rewards!{' '}
                  <Text fontSize="lg" as="span" color="white">
                    (make sure that your connected Web3 account matches the
                    selected operator)
                  </Text>
                </ListItem>
              </OrderedList>
            </Flex>
          </Text>
          <Heading
            mt="2em"
            mb="0.3em"
            fontSize="2xl"
            textAlign="center"
            color="white"
          >
            Disclaimer
          </Heading>
          <Text color="white">
            Important: This an unofficial utility for{' '}
            <Link color="purple.900" href="https://raid.party/">
              Raid Party
            </Link>
            .
          </Text>
          <Text color="white">
            This is not officially endorsed, but you can review the source code
            yourself{' '}
            <Link
              color="purple.900"
              href="https://github.com/Xanewok/rpyieldcollector"
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
              }etherscan.io/address/${RpYieldCollector.address}`}
            >
              {`${RpYieldCollector.address.slice(
                0,
                6
              )}...${RpYieldCollector.address.slice(-4)}`}
            </Link>
            .
          </Text>
          <Text color="white">
            You&apos;re interacting with the contract at your own
            responsibility.
          </Text>
          <Text color="white">
            Accumulation or collecting tax includes a 0.5% service fee.
          </Text>
        </Box>
        <Box mt="20px" mb="5px" textAlign="center">
          <Text color="white">
            Theme based on RP{' '}
            <Link
              color="purple.900"
              href="https://tracker.roll.party"
              target="_blank"
            >
              tracker
            </Link>{' '}
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
