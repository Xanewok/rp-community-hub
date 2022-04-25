import { Flex, Img, Text } from '@chakra-ui/react'
import { useEthers, useTokenBalance } from '@usedapp/core'
import { TOKEN_ADDRESS } from '../../constants'

type InfoShieldProps =
  | { type: 'cftiBalance'; value?: undefined }
  | { type?: 'value'; value: string }

export const InfoShield: React.FC<InfoShieldProps> = (props) => {
  const { account } = useEthers()
  const balance = useTokenBalance(TOKEN_ADDRESS['CFTI'], account)

  const roundTo = (value: number, decimals: number) =>
    Math.floor(value * 10 ** decimals) / 10 ** decimals

  const formatNumber = (value: any, decimals: number) =>
    isNaN(Number(value))
      ? '...'
      : `${roundTo(Number(value) / 10 ** 18, decimals)}`

  return (
    <Flex
      justify="center"
      alignItems="center"
      ml={6}
      px={3}
      h="38px"
      bg="#0A0414"
      boxShadow="0 -2px 0 0 #2b2258,0 2px 0 0 #2b2258,-2px 0 0 0 #2b2258,2px 0 0 0 #2b2258,0 0 0 2px #0a0414,0 -4px 0 0 #0a0414,0 4px 0 0 #0a0414,-4px 0 0 0 #0a0414,4px 0 0 0 #0a0414;"
    >
      <Text
        as="span"
        fontSize="2xl"
        color="white"
        pb={1}
        mr={1.5}
        lineHeight="32px"
      >
        {props.type == 'cftiBalance' ? formatNumber(balance, 2) : props.value}
      </Text>
      {props.type == 'cftiBalance' && (
        <Img
          w="26px"
          h="26px"
          style={{ imageRendering: 'pixelated' }}
          src="/cfti.png"
        ></Img>
      )}
    </Flex>
  )
}
