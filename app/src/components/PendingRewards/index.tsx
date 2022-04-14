import { Flex, Img, Text } from '@chakra-ui/react'
import { useTokenBalance } from '@usedapp/core'
import { TOKEN_ADDRESS } from '../../constants'
import { usePendingRewards } from '../../hooks'
import web3 from 'web3'

const formatNumber = (value: any) =>
  isNaN(Number(value)) ? '...' : `${(Number(value) / 10 ** 18).toPrecision(4)}`

export const PendingRewards = (props: { owner: any }) => {
  const { owner } = props

  const balance = useTokenBalance(TOKEN_ADDRESS['CFTI'], owner)
  const pendingRewards = usePendingRewards(owner)

  if (!web3.utils.isAddress(owner)) return null

  return (
    <Flex justifyContent={'space-around'}>
      <Text>{[balance, pendingRewards].map(formatNumber).join(' + ')}</Text>
      <Img ml="5px" src="/cfti.png" />
    </Flex>
  )
}
