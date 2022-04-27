import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useCallback } from 'react'

interface MarketItemProps {
  imgSrc: string
  name: string
  spots: number
  price: number
  allocatedSpots: number
  onRedeem: () => void
  roundsLeft: number
}

export const MarketItem: React.FC<MarketItemProps> = (props) => {
  const { name, imgSrc, spots, allocatedSpots, price, onRedeem } = props

  return (
    <Flex
      w={['325px', '500px']}
      p={5}
      bg="#16112d"
      boxShadow="0 -3px 0 0 #231b4d,0 3px 0 0 #231b4d,-3px 0 0 0 #231b4d,3px 0 0 0 #231b4d,0 0 0 3px #0a0414,0 -6px 0 0 #0a0414,0 6px 0 0 #0a0414,-6px 0 0 0 #0a0414,6px 0 0 0 #0a0414"
    >
      <Flex direction="row">
        <Box
          w={['100px', '200px']}
          h="200px"
          style={{ aspectRatio: '1/1' }}
          mr={4}
        >
          <Img
            boxShadow="0 -3px 0 0 #3e2e6c,0 3px 0 0 #3e2e6c,-3px 0 0 0 #3e2e6c,3px 0 0 0 #3e2e6c"
            src={imgSrc}
          />
        </Box>
        <Flex h="100%" direction="column">
          <Heading textColor="white" lineHeight="24px" mb={3} mt={-2}>
            {name}
          </Heading>
          <Flex h="100%" direction="column" justify="space-between">
            <Text
              noOfLines={3}
              textColor="#AE9ED1"
              fontWeight="500"
              fontSize="lg"
              wordBreak="break-word"
            >
              {props.children}
            </Text>
            <Flex direction="row" mt={1}>
              <Text
                as="span"
                textColor="#AE9ED1"
                fontWeight="500"
                fontSize="lg"
                mr={3}
              >
                {`${allocatedSpots}/${spots}`}
              </Text>
              <Flex>
                <Text
                  as="span"
                  textColor="#AE9ED1"
                  fontWeight="500"
                  fontSize="lg"
                  pb={1}
                  mr={1.5}
                >
                  {price}
                </Text>
                <Img
                  w="26px"
                  h="26px"
                  style={{ imageRendering: 'pixelated' }}
                  src="/cfti.png"
                ></Img>
              </Flex>
              <Text
                  as="span"
                  textColor="#AE9ED1"
                  fontWeight="500"
                  fontSize="lg"
                  ml={3}
                >
                  {props.roundsLeft <= 0
                    ? 'Finished'
                    : `Ends in ${props.roundsLeft} seed rounds`}
                </Text>
            </Flex>
            <Button mt="2" w="max(50%, 100px)" fontSize="xl" onClick={onRedeem}>
              Redeem
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
