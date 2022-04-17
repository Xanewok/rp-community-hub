import { Flex, Img, Text } from '@chakra-ui/react'
import { useTokenBalance } from '@usedapp/core'
import { TOKEN_ADDRESS } from '../../constants'
import { usePendingRewards } from '../../hooks'
import web3 from 'web3'

const roundTo = (value: number, decimals: number) =>
  Math.floor(value * 10 ** decimals) / 10 ** decimals

const formatNumber = (value: any, decimals: number) =>
  isNaN(Number(value))
    ? '...'
    : `${roundTo(Number(value) / 10 ** 18, decimals)}`

export const PendingRewards = (props: { owner: any }) => {
  const { owner } = props

  const balance = useTokenBalance(TOKEN_ADDRESS['CFTI'], owner)
  const pendingRewards = usePendingRewards(owner)

  if (!web3.utils.isAddress(owner)) return null

  return (
    <Flex direction="row" justifyContent={'right'}>
      <Text>{`${formatNumber(balance, 2)} + ${formatNumber(pendingRewards, 3)}`}</Text>
      <Img
        h="28px"
        w="28px"
        ml="10px"
        my="auto"
        display={['none', 'yes']}
        src="/cfti.png"
      />
    </Flex>
  )
}
