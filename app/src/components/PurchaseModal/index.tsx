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
  Box,
  Input,
  useToast,
  Link,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { JsonRpcProvider } from 'ethers/providers'

import style from './index.module.css'

// LICENSE: All right reserved to the https://raid.party for the spinner asset.
const Spinner = () => (
  <svg
    style={{
      marginTop: '5rem',
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

async function renderAddress(
  provider: JsonRpcProvider,
  address: any
): Promise<string> {
  const lookup = await provider.lookupAddress(address)
  return lookup ? lookup : `${address.slice(0, 6)}...${address.slice(-4)}`
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  cftiCost: number
}

const DISCORD_REGEX = /@?[^#@:]{2,32}#[0-9]{4}$/

const PurchaseModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props
  const { cftiCost } = props

  const toast = useToast()
  const showErrorToast = useCallback(
    (err: any) => {
      console.error(JSON.stringify(err))
      const error = err.error || err
      toast({
        description: `${error.message}`,
        status: 'error',
        duration: 3000,
      })
    },
    [toast]
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.endsWith('/auth/callback')) {
        // We're using Implicit Grant, which returns the token in a hash rather
        // than query params
        // See: https://discord.com/developers/docs/topics/oauth2#implicit-grant
        // window.location.replace(window.location.toString().replace('#', '?'))
        const params = new URLSearchParams(
          window.location.hash.replace('#', '?')
        )
        const tokenType = params.get('token_type')
        const accessToken = params.get('access_token')
        console.log({ tokenType, accessToken })
        fetch('https://discord.com/api/users/@me', {
          headers: { authorization: `${tokenType} ${accessToken}` },
        })
          .then((res) => res.json())
          .then((user) => {
            console.log(
              'Got response from the Discord API: ',
              JSON.stringify(user)
            )
            console.log({ user })
          })
      }
    }
  }, [])

  const { account, library } = useEthers()

  const [discordName, setDiscordName] = useState('Zarc#2492')
  const isDiscordNameValid = useMemo(
    () => DISCORD_REGEX.test(discordName),
    [discordName]
  )

  const onClick = useCallback(async () => {
    const signer = library?.getSigner()
    if (!signer) return
    else {
      try {
        await signer.signMessage(`Discord: ${discordName}`)
      } catch (e) {
        showErrorToast(e)
      }
    }
  }, [library, discordName, showErrorToast])

  const raffleId = 1

  // https://discord.com/api/oauth2/authorize?response_type=token&client_id=968298862294995017&state=15773059ghq9183habn&scope=identify&redirect_uri=https%3A%2F%2Fmarket.roll.party
  // https://discord.com/api/oauth2/authorize?response_type=token&client_id=968298862294995017&state=15773059ghq9183nabn&scope=identify

  // Close the modal whenever we change accounts
  useEffect(onClose, [account, onClose])
  // Reset the state on modal open/close
  useEffect(() => {
    setDiscordName('Zarc#2493')
  }, [isOpen])

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        alignSelf="center"
        color="purple.900"
        bg="purple.100"
        borderRadius="1px"
        boxShadow="0 -3px 0 0 #352561, 0 3px 0 0 #181030, -3px 0 0 0 #2c2051, 3px 0 0 0 #2c2051, 0 0 0 3px #0b0817, 0 -6px 0 0 #0b0817, 0 6px 0 0 #0b0817, -6px 0 0 0 #0b0817, 6px 0 0 0 #0b0817"
      >
        <ModalCloseButton />
        <ModalBody
          w="100%"
          p={0}
          display="flex"
          flexDirection="column"
          backgroundImage="/tiles.png"
          backgroundSize="cover"
          backgroundAttachment="fixed"
        >
          <Flex w="100%" justify="center" position="absolute" top={-6}>
            <Box w={16}>
              <Img src="/banner-l.png"></Img>
            </Box>
            <Flex
              w="60%"
              backgroundRepeat="repeat-x"
              backgroundSize="contain"
              backgroundImage="/banner-m.png"
              justify="center"
              fontWeight="bold"
              textColor="white"
            >
              Confirm your purchase
            </Flex>
            <Box w={16}>
              <Img src="/banner-r.png"></Img>
            </Box>
          </Flex>
          <Flex pt={8} pb={5} px={10} direction="column" justify="center">
            <Text mx="auto" px="15%" textAlign="center" fontWeight="500">
              You&apos;re almost done! Please submit your Discord ID to verify
              eligibility and complete your purchase. Make sure to include your
              unique 4-digit identifier as seen below!
            </Text>
            <Text
              mx="auto"
              py={3}
              pb={5}
              fontWeight="bold"
              alignSelf="center"
              textColor="red.400"
            >
              This transaction will cost {cftiCost}{' '}
              <Img mb={-0.5} h="14px" display="inline" src="/cfti.png"></Img>
            </Text>
            <Flex direction="row">
              <Input
                rounded={0}
                mr={3}
                border={0}
                h="26px"
                background="indigo.600"
                boxShadow="0 -2px 0 0 #352561, 0 2px 0 0 #181030, -2px 0 0 0 #2c2051, 2px 0 0 0 #2c2051, 0 0 0 2px #0b0817, 0 -4px 0 0 #0b0817, 0 4px 0 0 #0b0817, -4px 0 0 0 #0b0817, 4px 0 0 0 #0b0817"
                value={discordName}
                onChange={(ev) => setDiscordName(ev.target.value)}
                isInvalid={!isDiscordNameValid}
              />
              <Link
                href={`https://discord.com/api/oauth2/authorize?response_type=token&client_id=968298862294995017&state=15773059ghq9183habn&scope=identify&redirect_uri=https%3A%2F%2Fmarket.roll.party%2Fauth%2Fcallback`}
              >
                WIP
              </Link>
              <Button ml={3} h="26px" w="33%" onClick={onClick}>
                Redeem
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PurchaseModal
