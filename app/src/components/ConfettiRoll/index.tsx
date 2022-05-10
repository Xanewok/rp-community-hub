import {
  Text,
  Box,
  Button,
  Img,
  Flex,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import BannerBox from '../BannerBox/BannerBox'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { useContracts } from '../../constants'
import { useState, useEffect, useCallback } from 'react'

import DeathRoll, { PlayerRoll } from '../DeathRoll'
import { ethers } from 'ethers'
import { logEvent } from '../../utils'
import { useConfettiRoll, useSigner } from '../../hooks'
import { JoinGame } from '../JoinGame'

type StatusProps = {
  connected: any
}

const Status = ({ connected }: StatusProps) => {
  const { account, library } = useEthers()

  const { Confetti, ConfettiRoll } = useContracts()

  const balance = useTokenBalance(Confetti.address, account)

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

  const globalGameId = useConfettiRoll('currentGlobalGameId')
  const globalGame = useConfettiRoll('getGame', globalGameId)
  const currentRound = useConfettiRoll('currentRound')
  const defaultMaxParticipants = useConfettiRoll('defaultMaxParticipants')
  const pendingRewards = useConfettiRoll('getPendingRewards', account)
  const internalGames = useConfettiRoll('getPendingGames', account)

  type GameState =
    | { t: 'Pending' }
    | { t: 'Reveal' }
    | { t: 'Finished'; lost: boolean }

  type PendingGame = GameState & { id: any }
  const [pendingGames, setPendingGames] = useState<Array<PendingGame>>([])

  useEffect(() => {
    if (!account) {
      setPendingGames([])
    }
    if (!signer || !account) return
    const confettiRoll = ConfettiRoll.connect(signer)

    async function fetchPendingGames() {
      const pendingGames = (await confettiRoll.getPendingGames(account)) || []
      return await Promise.all(
        pendingGames.map(async (gameId: any) => {
          const [game, results] = await Promise.all([
            confettiRoll.getGame(gameId),
            confettiRoll.getGameResults(gameId),
          ])
          const seed = await confettiRoll.getSeed(game.roundNum)
          const loser = results.loser

          const state: GameState = seed.eq(0)
            ? { t: 'Pending' }
            : loser == ethers.constants.AddressZero
            ? { t: 'Reveal' }
            : { t: 'Finished', lost: loser == account }

          return { id: gameId, ...state }
        })
      )
    }

    fetchPendingGames().then(setPendingGames)
  }, [signer, account, internalGames, ConfettiRoll])
  const [rolls, setRolls] = useState<{
    startingRoll: number
    rolls: Array<PlayerRoll>
    pending: boolean
  }>({ startingRoll: 100, rolls: [], pending: false })
  // Used by the nested dialog to pass the data to display
  const clearRolls = useCallback(() => {
    setRolls({ startingRoll: 0, rolls: [], pending: false })
  }, [])

  return (
    <BannerBox mt={20} heading={`Round #${currentRound || 0}`}>
      <Box p="16px" textAlign="center">
        {!connected && (
          <Text fontSize="xx-large" mb="20px" color="white">
            Not connected
          </Text>
        )}

        <Flex direction="column">
          <Text fontSize="xl" fontWeight="bold" color={connected ? '' : 'gray'}>
            Registration
          </Text>
          <Text fontSize="xl">
            Game ID:{' '}
            {globalGameId
              ? `${globalGameId.slice(0, 6)}...${globalGameId.slice(-4)}`
              : 'Unknown'}
          </Text>
          <Text fontSize="xl">
            Participants:{' '}
            {`${(globalGame?.participants || []).length}/${
              defaultMaxParticipants || 0
            }`}
          </Text>

          <JoinGame game={globalGame} />

          {pendingGames.length > 0 && (
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={connected ? '' : 'gray'}
            >
              Pending games
            </Text>
          )}
          <ul>
            {pendingGames.map((game) => (
              <li style={{ fontSize: '1.25rem' }} key={game.id}>
                {`${game.id.slice(0, 6)}...${game.id.slice(-4)}`}
                <Button
                  size="xs"
                  ml="1rem"
                  p="0 0 7px 0"
                  opacity={game.t === 'Reveal' ? '1' : '0.7'}
                  isDisabled={game.t === 'Pending'}
                  onClick={async () => {
                    if (!signer || game.t === 'Pending') {
                      return
                    }
                    const confettiRoll = ConfettiRoll.connect(signer)

                    // If the game is not yet finished and needs to be triggered,
                    // make sure to call the contract and wait for the game
                    // conclusion event
                    if (game.t === 'Reveal') {
                      await confettiRoll.commenceGame(game.id)
                      const willGameProceed = await confettiRoll
                        .getGame(game.id)
                        .then((game: any) => game.participants.length >= 2)
                      // Trigger modal display to inform the user that the game
                      // will commence
                      setRolls({
                        startingRoll: 0,
                        rolls: [],
                        pending: willGameProceed,
                      })
                      // Wait until the game is registered by our provider
                      // TODO: Clean up and modularize this mess
                      await logEvent(
                        library,
                        ConfettiRoll.filters.PlayerLost(game.id)
                      )
                    }

                    const [game_, players, rolls] = await Promise.all([
                      confettiRoll.getGame(game.id),
                      confettiRoll.getRollingPlayers(game.id),
                      confettiRoll.getRolls(game.id),
                    ])

                    const playerRolls = rolls.map((roll: any, idx: number) => ({
                      player: players[idx % players.length],
                      roll: Number(roll),
                    }))
                    setRolls({
                      startingRoll: game_.startingRoll,
                      rolls: playerRolls,
                      pending: true,
                    })
                  }}
                >
                  {game.t}
                </Button>
              </li>
            ))}
          </ul>
        </Flex>
      </Box>
      {connected && (
        <Flex justify="space-between">
          <Flex>
            <Tooltip
              bg="purple.300"
              color="white"
              placement="left"
              hasArrow
              label="Withdraw rewards"
            >
              <Button
                isDisabled={!account || !pendingRewards || pendingRewards <= 0}
                onClick={() => {
                  if (signer) {
                    ConfettiRoll.connect(signer)
                      .withdrawRewards()
                      .catch(showErrorToast)
                  }
                }}
              >
                <Img h="27px" mt="6px" src="/cfti.png" pr="10px" />
                <Text fontSize="xl">
                  {isNaN(Number(pendingRewards))
                    ? '...'
                    : `${(Number(pendingRewards) / 10 ** 18).toPrecision(3)}`}
                </Text>
              </Button>
            </Tooltip>
          </Flex>
          <Flex>
            <Img h="27px" mt="6px" src="/cfti.png" pr="10px" />
            <Text fontSize="2xl">
              {isNaN(Number(balance))
                ? '...'
                : `${(Number(balance) / 10 ** 18).toPrecision(4)}`}
            </Text>
          </Flex>
          <DeathRoll
            startingRoll={rolls.startingRoll}
            rolls={rolls.rolls}
            pending={rolls.pending}
            onClosed={clearRolls}
          />
        </Flex>
      )}
    </BannerBox>
  )
}

export default Status
