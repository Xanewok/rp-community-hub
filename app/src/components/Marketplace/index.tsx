import {
  Flex,
  Heading,
  Img,
  Button,
  Container,
  Box,
  Text,
} from '@chakra-ui/react'
import { useEthers, useGasPrice } from '@usedapp/core'
import { InfoShield } from '../InfoShield'
import Status from '../Status'

export const Marketplace: React.FC = () => {
  const gasPrice = useGasPrice()

  const { account } = useEthers()

  return (
    <Box position="relative" h="100%" w="100%" overflow="auto">
      <Flex position="absolute" top={10} right={10} zIndex={10}>
        <InfoShield
          value={`⛽ ${Math.trunc((Number(gasPrice) || 0) / 10 ** 9)}`}
        />
        <InfoShield type="cftiBalance" />
      </Flex>

      <Flex justifyContent="center" p="10px">
        {/* <MarketItem img={'/moonbirds.png'} name={'moonbirds'} spots={50} price={500}  allocatedSpots={10} content={'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo d'}/> */}
        <Heading pt="20px" size="lg" mb="50px" textAlign="center" color="white">
          <Img w="16rem" src="/logo.png" /> Collect rewards
        </Heading>
      </Flex>
      <Container maxW="100%">
        <Status connected={account} />
      </Container>
    </Box>
  )
}
