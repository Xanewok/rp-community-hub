import { Flex, Img, Text } from '@chakra-ui/react'
import { useTokenBalance } from '@usedapp/core'
import { useContracts } from '../../constants'
import web3 from 'web3'

const roundTo = (value: number, decimals: number) =>
  Math.floor(value * 10 ** decimals) / 10 ** decimals

const formatNumber = (value: any, decimals: number) =>
  isNaN(Number(value))
    ? '...'
    : `${roundTo(Number(value) / 10 ** 18, decimals)}`

export const Balance = (props: { owner: any }) => {
  const { owner } = props
  const { Confetti } = useContracts()

  const balance = useTokenBalance(Confetti.address, owner)

  if (!web3.utils.isAddress(owner)) return null

  return (
    <Flex
      direction="row"
      justifyContent={['space-evenly', 'space-evenly', 'left']}
      alignItems="end"
      h="28px"
    >
      <Img
        h="28px"
        w="28px"
        mr="10px"
        display={['none', 'none', 'block']}
        src="/cfti.png"
      />
      <Text fontSize="2xl" mb="6px">
        {formatNumber(balance, 2)}
      </Text>
    </Flex>
  )
}
