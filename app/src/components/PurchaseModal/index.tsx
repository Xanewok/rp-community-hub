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
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { useEffect, useMemo, useState } from 'react'

import { supabase } from '../../utils/supabaseClient'

import { useUser } from '@supabase/supabase-auth-helpers/react'
import useErrorToast from '../../hooks/useErrorToast'
import { useContracts } from '../../constants'
import { ApproveCfti } from '../ApproveCfti'

import { BigNumber } from '@ethersproject/bignumber'
import { id } from 'ethers/utils'
import { useRaffleView } from '../../hooks/useRaffles'

const roundTo = (value: number, decimals: number) =>
  Math.floor(value * 10 ** decimals) / 10 ** decimals

const formatNumber = (value: any, decimals: number) =>
  isNaN(Number(value)) ? NaN : roundTo(Number(value) / 10 ** 18, decimals)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  raffleId?: number
  cftiCost: any
}

const PurchaseModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose } = props
  const { raffleId } = props

  // TODO: Handle this
  const raffle = useRaffleView(raffleId || 0)
  const cftiCost = raffle?.cost || NaN
  const ticketsLeft =
    Number(raffle?.maxEntries) - Number(raffle?.totalTicketsBought)

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber: itemCount,
  } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: ticketsLeft,
    precision: 0,
  })

  const showErrorToast = useErrorToast()

  const { account, library } = useEthers()
  const { RaffleParty, Confetti } = useContracts()

  const allowance = useTokenAllowance(
    Confetti.address,
    account,
    RaffleParty.address
  )

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
              You&apos;re almost done! Approve the Marketplace to spend your
              $CFTI and choose how many tickets you&apos;d like to buy. In the
              future, you will need to submit your Discord ID in order to
              participate in raffles.
            </Text>
            <Text
              mx="auto"
              py={3}
              pb={5}
              fontWeight="bold"
              alignSelf="center"
              textColor="red.400"
            >
              This transaction will cost {formatNumber(cftiCost * itemCount, 2)}{' '}
              <Img mb={-0.5} h="14px" display="inline" src="/cfti.png"></Img>
            </Text>
            <Flex direction="row" justify="space-evenly">
              {/* {!!connectedDiscordName || (
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
                ))} */}
              {
                /* !!connectedDiscordName && !!isLoggedWithEthereum && */ <>
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
                  {allowance?.lt(BigNumber.from(10).pow(27)) ? (
                    <ApproveCfti />
                  ) : (
                    <Button
                      w="33%"
                      onClick={async () => {
                        const signer = library?.getSigner()
                        if (!account || !signer || typeof raffleId !== 'number')
                          return

                        await RaffleParty.connect(signer)
                          .buyTickets(raffleId, itemCount)
                          .catch(showErrorToast)
                      }}
                    >
                      Buy tickets
                    </Button>
                  )}
                </>
              }
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PurchaseModal
