import { Flex, Text, Tooltip, useInterval, useToast } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { useState, useCallback } from 'react'
import { useContracts } from '../../constants'
import { useSnapshotTime } from '../../hooks'

const SNAPSHOT_CADENCE_IN_SECONDS = 23 * 60 * 60

export const CommitSnapshot: React.FC = (props) => {
  const { account, library } = useEthers()
  const { Raid } = useContracts()

  const lastSnapshotTime = Number(useSnapshotTime())
  const nextSnapshotTime = lastSnapshotTime + SNAPSHOT_CADENCE_IN_SECONDS
  const [timeTillSnapshot, setTimeTillSnapshot] = useState(NaN)
  useInterval(() => {
    setTimeTillSnapshot(nextSnapshotTime * 1000 - new Date().getTime())
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

  const isDisabled = !account || isNaN(lastSnapshotTime) || timeTillSnapshot > 0

  const commitSnapshot = useCallback(() => {
    if (isDisabled) return
    const signer = account && library?.getSigner(account)
    if (signer) {
      Raid.connect(signer).commitSnapshot().catch(showErrorToast)
    }
  }, [isDisabled, account, library, Raid, showErrorToast])

  return (
    <Tooltip
      shouldWrapChildren
      label={
        <>
          <Text>
            Last snapshot:{' '}
            {new Date(lastSnapshotTime * 1000).toLocaleString([], {
              dateStyle: 'full',
              timeStyle: 'long',
            })}
          </Text>
          <Text>
            Snapshots allow players to claim their rewards with lower gas fees.
            This is done automatically by the dev team - ONLY use this if you
            know what you&apos;re doing!
          </Text>
        </>
      }
    >
      <Flex
        justify="center"
        alignItems="center"
        ml={6}
        px={3}
        h="38px"
        bg={isDisabled ? '#0A0414' : '#2b2258'}
        boxShadow="0 -2px 0 0 #2b2258,0 2px 0 0 #2b2258,-2px 0 0 0 #2b2258,2px 0 0 0 #2b2258,0 0 0 2px #0a0414,0 -4px 0 0 #0a0414,0 4px 0 0 #0a0414,-4px 0 0 0 #0a0414,4px 0 0 0 #0a0414;"
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        userSelect="none"
        onClick={commitSnapshot}
      >
        <Text
          as="span"
          fontSize="2xl"
          color="white"
          pb={1}
          mr={1.5}
          lineHeight="32px"
        >
          {isNaN(timeTillSnapshot)
            ? 'loading...'
            : `Commit snapshot ${
                !account
                  ? 'unavailable'
                  : timeTillSnapshot <= 0
                  ? 'now'
                  : `in ${new Date(timeTillSnapshot).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })} hrs`
              }`}
        </Text>
      </Flex>
    </Tooltip>
  )
}
