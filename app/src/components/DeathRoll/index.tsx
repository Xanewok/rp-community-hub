import {
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  Flex,
  Img,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { JsonRpcProvider } from 'ethers/providers'

import style from './index.module.css'

// LICENSE: All right reserved to the https://raid.party for the spinner asset.
const Spinner = () => (
  <svg
    style={{
      marginTop: "5rem",
      width: '5rem',
      height: '5rem',
      color: 'white',
      animation: `${style.spin} 1s linear infinite`,
    }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      opacity="0.25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      opacity="0.75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

export type PlayerRoll = { player: string; roll: Number }

async function renderAddress(
  provider: JsonRpcProvider,
  address: any
): Promise<string> {
  const lookup = await provider.lookupAddress(address)
  return lookup ? lookup : `${address.slice(0, 6)}...${address.slice(-4)}`
}

const DeathRoll = (props: {
  pending: boolean
  startingRoll: number
  rolls: Array<PlayerRoll>
  onClosed: Function
}) => {
  const { rolls, startingRoll, pending } = props
  const [pendingCached, setPendingCached] = useState(pending)

  const { account, library } = useEthers()

  const [resolver, setResolver] = useState<Record<string, string>>({})

  const { isOpen, onOpen, onClose } = useDisclosure()
  // Open the modal if we are fed some rolls to show
  useEffect(() => {
    if (rolls.length > 0 || pending) {
      onOpen()
    }
  }, [onOpen, rolls, pending])

  // Close the modal whenever we change accounts
  useEffect(onClose, [account, onClose])
  // Reset the state on modal open/close
  useEffect(() => {
    if (!isOpen) {
      props.onClosed()
    }

    setPendingCached(false)
    setDisplayedRolls(0)
    setNeedsPlayerAction(
      rolls.length > 0 &&
        rolls[0].player.toLowerCase() == account?.toLowerCase()
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const [displayedRolls, setDisplayedRolls] = useState(0)
  const [needsPlayerAction, setNeedsPlayerAction] = useState(
    rolls.length > 0 && rolls[0].player.toLowerCase() == account?.toLowerCase()
  )
  useEffect(() => {
    if (!isOpen || rolls.length == 0) return

    const timer = setInterval(() => {
      if (!needsPlayerAction && displayedRolls < rolls.length) {
        setDisplayedRolls((count) => count + 1)
        setNeedsPlayerAction(
          displayedRolls + 1 < rolls.length &&
            rolls[displayedRolls + 1].player?.toLowerCase() ==
              account?.toLowerCase()
        )
      }
    }, 2000)
    return () => clearInterval(timer)
  }, [account, displayedRolls, isOpen, needsPlayerAction, rolls])

  useEffect(() => {
    rolls.forEach(({ player }) =>
      library?.lookupAddress(player).then((value) => {
        return value
          ? setResolver((old) => ({ [player]: value, ...old }))
          : undefined
      })
    )
  }, [library, rolls])
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        alignItems={'center'}
        alignSelf={'center'}
        minHeight="48em"
        // mt="1"
        mb="0"
        // px="16px"
        // py="16px"
        color="purple.900"
        bg="purple.100"
        borderRadius="1px"
        boxShadow="0 -3px 0 0 #352561, 0 3px 0 0 #181030, -3px 0 0 0 #2c2051, 3px 0 0 0 #2c2051, 0 0 0 3px #0b0817, 0 -6px 0 0 #0b0817, 0 6px 0 0 #0b0817, -6px 0 0 0 #0b0817, 6px 0 0 0 #0b0817"
      >
        <ModalHeader textAlign="center">
          {rolls.length > 0 ? 'Game in progress' : 'Waiting for game...'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isOpen && rolls.length == 0 && (<Spinner />)}
          {isOpen &&
            rolls
              .slice(0, displayedRolls)
              .map(({ player, roll }, idx) => (
                <Text
                  key={idx}
                  color="#FFFF00"
                  fontWeight={
                    player.toLowerCase() == account?.toLowerCase()
                      ? 'bold'
                      : undefined
                  }
                  style={{
                    animation: `${style.fadein} 1s`,
                  }}
                >
                  {player} rolls {roll} (1-
                  {idx == 0 ? `${startingRoll}` : rolls[idx - 1].roll})
                </Text>
              ))
              // Display only latest 10 rolls
              .slice(-10)}
          <Flex justify="center" mt="55px" mb="15px">
            {displayedRolls < rolls.length ? (
              <Button
                mx="20px"
                px="20px"
                disabled={!needsPlayerAction}
                onClick={() => setNeedsPlayerAction(false)}
              >
                {needsPlayerAction ? 'Roll (your turn)' : 'Roll'}
              </Button>
            ) : (
              rolls.length > 0 && (
                <Flex direction={'column'} alignItems={'center'}>
                  <Text
                    fontSize="xs"
                    mb="5px"
                    color="white"
                    style={{
                      animation: `${style.fadein} 1s`,
                    }}
                    fontWeight="bold"
                  >
                    {`You ${
                      rolls[rolls.length - 1].player?.toLowerCase() !=
                      account?.toLowerCase()
                        ? 'won!'
                        : 'lost...'
                    }`}
                  </Text>
                  <Text
                    as="span"
                    style={{
                      animation: `${style.fadein} 1s`,
                    }}
                  >
                    {rolls[rolls.length - 1].player?.toLowerCase() !=
                    account?.toLowerCase()
                      ? '🥳'
                      : '😭'}
                  </Text>
                  <Button
                    my="2rem"
                    onClick={onClose}
                    style={{
                      animation: `${style.fadein} 1s`,
                    }}
                  >
                    {rolls[rolls.length - 1].player?.toLowerCase() !=
                    account?.toLowerCase()
                      ? 'Yay!'
                      : 'Okay...'}
                  </Button>
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default DeathRoll
