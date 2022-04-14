import { Flex, Img, Text } from '@chakra-ui/react'
import { usePendingRewards } from '../../hooks'

export const PendingRewards = (props: { owner: any }) => {
  const { owner } = props

  const pendingRewards = usePendingRewards(owner)

  return (
    <Flex justifyContent={'space-around'}>
      <Text>
        {isNaN(Number(pendingRewards))
          ? '...'
          : `${(Number(pendingRewards) / 10 ** 18).toPrecision(4)}`}
      </Text>
      <Img src="/cfti.png" />
    </Flex>
  )
}
