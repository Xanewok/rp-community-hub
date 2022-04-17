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
    <Flex
      direction="row"
      justifyContent={['space-evenly', 'space-evenly', 'right']}
      alignItems="end"
      h="28px"
    >
      {/* <Img
        h="28px"
        w="28px"
        mr="10px"
        my="auto"
        display={['none', 'inline']}
        src="/cfti.png"
      /> */}
      <Text mb="6px">~ {expectedDailyYield} /day</Text>
    </Flex>
  )
}
