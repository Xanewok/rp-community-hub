import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Text,
  Tooltip,
} from '@chakra-ui/react'

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
      maxHeight={[null, null, '500px']}
      p={3}
      bg="#16112d"
      justify="center"
      boxShadow="0 -3px 0 0 #231b4d,0 3px 0 0 #231b4d,-3px 0 0 0 #231b4d,3px 0 0 0 #231b4d,0 0 0 3px #0a0414,0 -6px 0 0 #0a0414,0 6px 0 0 #0a0414,-6px 0 0 0 #0a0414,6px 0 0 0 #0a0414"
    >
      <Flex direction="column" alignItems="center">
        <Heading
          textColor="white"
          fontSize="3xl"
          mb={3}
          mt={-3}
          wordBreak="break-word"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {name}
        </Heading>
        <Box w="175px" style={{ aspectRatio: '1/1' }}>
          <Img
            boxShadow="0 -3px 0 0 #3e2e6c,0 3px 0 0 #3e2e6c,-3px 0 0 0 #3e2e6c,3px 0 0 0 #3e2e6c"
            src={imgSrc}
          />
        </Box>
        <Text
          my={2}
          h="100%"
          textColor="#AE9ED1"
          fontWeight="500"
          fontSize="lg"
          wordBreak="break-word"
          align="justify"
          overflowY="auto"
          pt={2}
        >
          {props.children}
        </Text>
        <Flex direction="row" my={2}>
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
          <Button
            my={1}
            minH="40px"
            fontSize="xl"
            isDisabled={allocatedSpots >= spots || props.roundsLeft <= 0}
            onClick={onRedeem}
          >
            {allocatedSpots >= spots ? 'Sold out' : 'Buy tickets'}
          </Button>
      </Flex>
    </Flex>
  )
}
