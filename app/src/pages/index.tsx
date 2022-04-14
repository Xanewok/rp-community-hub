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
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useCall, useEthers, useInterval } from '@usedapp/core'
import { TOKEN_ADDRESS, SEEDERV2_CONTRACT } from '../constants'
import Status from '../components/Status'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { useNextSeed } from '../hooks'

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
      <Flex justifyContent="center" p="10px">
        <Heading pt="20px" size="lg" mb="50px" textAlign="center" color="white">
          <Img w="16rem" src="/logo.png" /> Yield collector
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
              isDisabled={!account || isNaN(nextSeedBatch) || timeTillSeed > 0}
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
      {account && chainId !== 4 && (
        <>
          <Text color="red" textAlign="center" fontSize="xl">
            Error: Please connect to Ethereum Rinkeby Testnet.
          </Text>
        </>
      )}
      <Container maxW="100%">
        <Status connected={account} />
      </Container>
      <Box mt="80px" textAlign="center" textColor="white.50">
        <Heading fontSize="2xl" textAlign="center" color="white">
          Overview
        </Heading>
        <Text mx="2em" mb="1em" fontSize="lg" color="white">
          This tool lets you claim your CFTI rewards from multiple wallets with
          just one transaction. <br />
          In addition to a simple batch rewards claim, it also supports (for a
          small fee):
          <ol>
            <li>accumulating the rewards to any address of your choosing</li>
            <li>
              collecting a reward tax and sending it to another account (e.g.
              guild treasury wallet)
            </li>
          </ol>
        </Text>
        <Heading fontSize="2xl" textAlign="center" color="white">
          Instructions
        </Heading>
        <Text mx="2em" mb="1em" fontSize="lg" color="white">
          <ol>
            <li>
              For each wallet, approve our contract to move the wallet&apos;s
              $CFTI
              <Text fontSize="xs">
                (make sure it&apos;s active in your MetaMask/Web3 provider)
              </Text>
            </li>
            <li>
              For each wallet, authorize an <b>operator</b> that will manage its
              funds via this contract
              <Text fontSize="xs">
                (make sure it&apos;s active and <b>select</b> the operator
                from the drop-down that you wish to authorize)
              </Text>
            </li>
            <li>
              Optionally, enable the accumulate and/or the tax feature and fill
              the addresses
            </li>
            <li>
              Claim the rewards!
              <Text fontSize="xs">
                (make sure that your connected Web3 account matches the selected
                operator)
              </Text>
            </li>
          </ol>
        </Text>
        <Heading mt="2.5em" mb="0.3em" fontSize="lg" textAlign="center" color="white">
          Disclaimer
        </Heading>
        <Text fontSize="xs" color="white">
          Important: This an unofficial utility for{' '}
          <Link color="purple.900" href="https://raid.party/">
            Raid Party
          </Link>
          .{' '}
        </Text>
        <Text fontSize="xs" color="white">
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
        <Text fontSize="xs" color="white">
          Please{' '}
          <Text as="span" fontWeight="bold">
            do read
          </Text>{' '}
          the contract yourself, it&apos;s at{' '}
          <Link
            color="purple.900"
            href={`https://rinkeby.etherscan.io/address/${TOKEN_ADDRESS['COLLECTOR']}`}
          >
            {`${TOKEN_ADDRESS['COLLECTOR'].slice(0, 6)}...${TOKEN_ADDRESS[
              'COLLECTOR'
            ].slice(-4)}`}
          </Link>
          .
        </Text>
        <Text fontSize="xs" color="white">
          You&apos;re interacting with the contract at your own responsibility.
        </Text>
        <Text fontSize="xs" color="white">
          Accumulation or collecting tax includes a 0.5% service fee.
        </Text>
      </Box>
      <Box mt="20px" mb="5px" textAlign="center">
        <Text fontSize="xs" color="white">
          Theme based on RP{' '}
          <Link
            color="purple.900"
            href="https://raidpartytracker.eth.limo"
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
        <Text fontSize="xs" color="white">
          Made by:{' '}
          <Link
            color="purple.900"
            href="https://github.com/Xanewok"
            target="_blank"
          >
            xanewok.eth
          </Link>
        </Text>
        <Text fontSize="xs" color="white">
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
    </>
  )
}

export default Home
