import { Box, Button, Flex, Heading, Img, Text } from '@chakra-ui/react'

export const MarketItem = (props: {
  img: any
  name: any
  spots: any
  price: any
  content: any
  allocatedSpots: any
}) => {
  return (
    <Flex
      h="300pxw"
      w={['325px', '500px']}
      p={5}
      bg="#16112d"
      boxShadow="0 -3px 0 0 #231b4d,0 3px 0 0 #231b4d,-3px 0 0 0 #231b4d,3px 0 0 0 #231b4d,0 0 0 3px #0a0414,0 -6px 0 0 #0a0414,0 6px 0 0 #0a0414,-6px 0 0 0 #0a0414,6px 0 0 0 #0a0414"
    >
      <Flex direction="row">
        <Box w="165px" h="165px" style={{ aspectRatio: '1/1' }} mr={4}>
          <Img
            // maxH="100%"
            // maxW="100%"
            // objectFit="scale-down"
            boxShadow="0 -3px 0 0 #3e2e6c,0 3px 0 0 #3e2e6c,-3px 0 0 0 #3e2e6c,3px 0 0 0 #3e2e6c"
            src="/moonbirds.png"
          />
        </Box>
      </Flex>
      <Flex direction="column">
        <Heading textColor="white" lineHeight="24px" mb={3}>
          Moonbirds
        </Heading>
        <Text textColor="#AE9ED1" fontWeight="500">
          A collection of 10,000 utility-enabled PFPs that feature a richly
          diverse and unique pool of rarity-powered traits. What's more, each
          Moonbird unlocks private club membership and additional benefits the
          longer you hold them.
        </Text>
        <Flex direction="row">
          <Text as="span" textColor="#AE9ED1" fontWeight="500" mr={3}>
            7/30
          </Text>
          <Flex>
            <Text
              as="span"
              textColor="#AE9ED1"
              fontWeight="500"
              pb={1}
              mr={1.5}
            >
              500
            </Text>
            <Img
              w="26px"
              h="26px"
              style={{ imageRendering: 'pixelated' }}
              src="/cfti.png"
            ></Img>
          </Flex>
        </Flex>
        <Button mt="2" w="max(50%, 100px)" fontSize="xl">
          Redeem
        </Button>
      </Flex>

      <Box>
        <Text fontSize="3xl" color="white">
          {props.name}
        </Text>
        <Text fontSize="xl" color="white">
          {props.content}
        </Text>
      </Box>
    </Flex>
  )
}
