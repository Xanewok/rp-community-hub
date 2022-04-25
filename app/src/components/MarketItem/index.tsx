import { Box, Button, Flex, Img, Text } from '@chakra-ui/react'

export const MarketItem = (props: {
  img: any
  name: any
  spots: any
  price: any
  content: any
  allocatedSpots: any
}) => {
  return (
    <Flex h="300pxw" w="500px" p="5" box-sizing="border-box" bg="black">
      <Img src={props.img} height="200" width="120" />
      <Box>
        <Text fontSize="3xl" color="white">
          {props.name}
        </Text>
        <Text fontSize="xl" color="white">
          {props.content}
        </Text>

        <Flex gap="5">
          <Text fontSize="xl" color="white">
            {props.allocatedSpots}/{props.spots}
          </Text>
          <Text fontSize="xl" color="white">
            {props.price} $CFTI
          </Text>
        </Flex>

        <Button>Participate!</Button>
      </Box>
    </Flex>
  )
}
