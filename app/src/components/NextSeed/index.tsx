import { Flex, Text, useInterval } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { useState, useCallback } from 'react'
import { useContracts } from '../../constants'
import { useNextSeed } from '../../hooks'

export const NextSeed: React.FC = (props) => {
  const { account, library } = useEthers()
  const { RpSeeder } = useContracts()

  const nextSeedBatch = Number(useNextSeed())
  const [timeTillSeed, setTimeTillSeed] = useState(NaN)
  useInterval(() => {
    setTimeTillSeed(nextSeedBatch * 1000 - new Date().getTime())
  }, 1000)

  const isDisabled = !account || isNaN(nextSeedBatch) || timeTillSeed > 0

  const doSeed = useCallback(() => {
    if (isDisabled) return
    const signer = account && library?.getSigner(account)
    if (signer) {
      RpSeeder.connect(signer).executeRequestMulti()
    }
  }, [isDisabled, RpSeeder, account, library])

  return (
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
      onClick={doSeed}
    >
      <Text
        as="span"
        fontSize="2xl"
        color="white"
        pb={1}
        mr={1.5}
        lineHeight="32px"
      >
        {isNaN(timeTillSeed)
          ? 'loading...'
          : `Next seed  ${
              !account
                ? 'unavailable'
                : timeTillSeed <= 0
                ? 'available'
                : `in ${new Date(timeTillSeed).toLocaleTimeString([], {
                    minute: '2-digit',
                    second: '2-digit',
                  })}`
            }`}
      </Text>
    </Flex>
  )
}
