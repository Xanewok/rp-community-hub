import { Flex, Img, Text } from '@chakra-ui/react'
import web3 from 'web3'
import { usePartyDamage } from '../../hooks/usePartyDamage'

export const ExpectedYield = (props: { owner: any }) => {
  const { owner } = props

  const damage = usePartyDamage(owner)

  // https://docs.google.com/spreadsheets/d/1RScZkbKErwh66JJGFi9LJZdJlJBWpmOJgdivg_QlFYI
  // Under "Yield calculator" sheet - based on bosses' spawn rate and rewards
  const expectedDailyYield = Math.round((damage / 830) * 100) / 100

  if (!web3.utils.isAddress(owner)) return null

  return (
    <Flex direction="row" justify={'right'}>
      <Text>{expectedDailyYield} /day</Text>
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
