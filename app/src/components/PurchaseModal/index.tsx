import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  Flex,
  HStack,
  Img,
  Input,
  Box,
  useNumberInput,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { useEffect, useMemo, useState } from 'react'

import { supabase } from '../../utils/supabaseClient'

import { useUser } from '@supabase/supabase-auth-helpers/react'
import useErrorToast from '../../hooks/useErrorToast'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  cftiCost: number
}

const PurchaseModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props
  const { cftiCost } = props

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber: itemCount,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: 6,
    precision: 0,
  })

  const showErrorToast = useErrorToast()

  const { account, library } = useEthers()

  const user = useUser()
  const connectedDiscordName = useMemo(
    () => user.user?.user_metadata.name,
    [user]
  )
  const [isLoggedWithEthereum, setLoggedWithEthereum] = useState(false)
  useEffect(() => {
    if (!user.user?.id) return

    supabase
      .from('profiles')
      .select('id,eth')
      .eq('id', user.user?.id)
      .eq('eth', account)
      .limit(1)
      .then((value) => {
        if (value.error) {
          showErrorToast(value.error)
        } else {
          setLoggedWithEthereum(value.data.length > 0)
        }
      })
  }, [account, connectedDiscordName, showErrorToast, user.user?.id])

  // Close the modal whenever we change accounts
  useEffect(onClose, [account, onClose])
  // Reset the state on modal open/close
  useEffect(() => {}, [connectedDiscordName, isOpen])

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
              This transaction will cost {cftiCost * itemCount}{' '}
              <Img mb={-0.5} h="14px" display="inline" src="/cfti.png"></Img>
            </Text>
            <Flex direction="row" justify="space-evenly">
              {!!connectedDiscordName || (
                <Button
                  onClick={async () => {
                    const { user, session, error } = await supabase.auth.signIn(
                      {
                        provider: 'discord',
                      }
                    )
                    console.log({ user, session, error })
                  }}
                >
                  Connect Discord
                </Button>
              )}
              {!!connectedDiscordName &&
                (!!isLoggedWithEthereum || (
                  <Button
                    onClick={async () => {
                      const signer = library?.getSigner()
                      const user = supabase.auth.user()
                      if (!signer || !library || !user) return
                      try {
                        const message = {
                          audience: 'Raid Party Marketplace',
                          user_id: user.id,
                          eth: account,
                        }
                        const signature = await signer.signMessage(
                          JSON.stringify(message)
                        )
                        await fetch('/api/ethConnect', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          credentials: 'same-origin',
                          body: JSON.stringify({
                            message,
                            signature,
                          }),
                        })
                        const { error } = await supabase
                          .from('profiles')
                          .upsert(
                            {
                              id: user?.id,
                              eth: account,
                            },
                            { returning: 'minimal' }
                          )
                        if (!error) {
                          setLoggedWithEthereum(true)
                        }
                      } catch (e) {
                        showErrorToast(e)
                      }
                    }}
                  >
                    Connect wallet
                  </Button>
                ))}
              {!!connectedDiscordName && !!isLoggedWithEthereum && (
                <>
                  <Flex direction="row">
                    <Button
                      style={{ width: '26px' }}
                      h="40px"
                      {...getDecrementButtonProps()}
                    >
                      -
                    </Button>
                    <Input
                      maxW={16}
                      mx={3}
                      textAlign="center"
                      {...getInputProps()}
                    />
                    <Button {...getIncrementButtonProps()}>+</Button>
                  </Flex>
                  <Button w="33%" onClick={() => {
                    showErrorToast(new Error("so close yet so far"))
                  }}>Redeem</Button>
                </>
              )}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PurchaseModal
