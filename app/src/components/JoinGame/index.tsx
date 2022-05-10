import { Button, Flex, Img, Text, useToast } from '@chakra-ui/react'
import {
  useEthers,
  useInterval,
  useTokenAllowance,
  useTokenBalance,
} from '@usedapp/core'
import { useCallback, useMemo, useState } from 'react'
import { useContracts } from '../../constants'
import { useConfettiRoll, useNextSeed, useSigner } from '../../hooks'

type JoinGameProps = { game: any }

export const JoinGame = (props: JoinGameProps) => {
  const game = useMemo(() => props.game || {}, [props.game])

  const { account } = useEthers()
  const { Confetti, ConfettiRoll } = useContracts()
  const allowance = useTokenAllowance(
    Confetti.address,
    account,
    ConfettiRoll.address
  )
  const balance = useTokenBalance(Confetti.address, account)

  const nextSeedBatch = Number(useNextSeed())
  const [timeTillSeed, setTimeTillSeed] = useState(NaN)
  useInterval(() => {
    setTimeTillSeed(nextSeedBatch * 1000 - new Date().getTime())
  }, 1000)

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

  const signer = useSigner()
  const defaultBet = useConfettiRoll('defaultBet')
  const defaultMaxParticipants = useConfettiRoll('defaultMaxParticipants')

  const poolBet = (game.poolBet?.eq(0) ? defaultBet : game.poolBet) || 0
  const maxParticipants = game.maxParticipants || defaultMaxParticipants
  // The flow is as follows
  // 1. $CFTI not yet approved
  // 2. Game is accepting new sign-ups:
  //    - the maximum participants limit is not yet met
  //    - enough time before seeding happens (we respect the frontrunning safeguard)
  //    - we have enough money
  const approved = allowance?.gte(poolBet)
  const gameIsFull =
    game?.participants?.length && game.participants.length >= maxParticipants
  const alreadyJoined =
    account &&
    game?.participants?.length &&
    game.participants.some(
      (player: any) => account.toLowerCase() == player.toString().toLowerCase()
    )
  const seedImminent = timeTillSeed <= 90 * 1000
  const timeTillClose = timeTillSeed - 90 * 1000

  const onClick = useCallback(() => {
    if (!game || !signer) {
      /* no-op */
    } else if (!approved) {
      Confetti.connect(signer).approve(
        ConfettiRoll.address,
        '2000000000000000000000000'
      )
    } else {
      ConfettiRoll.connect(signer).joinGlobalGame().catch(showErrorToast)
    }
  }, [game, signer, approved, Confetti, ConfettiRoll, showErrorToast])
  const disabled =
    !signer ||
    !allowance ||
    (approved &&
      (gameIsFull || seedImminent || alreadyJoined || balance?.lt(poolBet)))
  const label = !game ? (
    'Loading'
  ) : allowance && !approved ? (
    'Approve $CFTI'
  ) : gameIsFull ? (
    'Game is full'
  ) : seedImminent || alreadyJoined ? (
    'Pending next seed'
  ) : (
    <Flex justifyItems={'right'}>
      <Text fontSize="2xl">Sign up:</Text>
      <Text fontSize="2xl" ml="min(0.5em, 5vw)">
        {(Number(defaultBet) / 10 ** 18).toPrecision(4).replace('.00', '')}
      </Text>
      <Img
        style={{ transform: 'scale(0.85)' }}
        h="27px"
        mt="6px"
        src="/cfti.png"
      />
      {timeTillClose < 15 * 1000 && (
        <Text fontSize="2xl" ml="0.5rem">
          ({`${Math.round(timeTillClose / 1000)}`}s)
        </Text>
      )}
    </Flex>
  )
  return (
    <Button
      size="xs"
      fontSize="md"
      pb="6px"
      m="1em 3em 0.5em 3em"
      isDisabled={!account || disabled}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}
