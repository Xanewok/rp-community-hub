import { Text, Box, Img, Flex } from '@chakra-ui/react'

type BannerBoxProps = {
  heading: string
  children?: JSX.Element | JSX.Element[]
}

const BannerBox = ({ heading, children }: BannerBoxProps) => (
  <Flex justify="center" w="100%">
    <Box
      mt="48px"
      px="16px"
      py="16px"
      pt="48px"
      color="purple.900"
      bg="purple.100"
      borderRadius="1px"
      boxShadow="0 -3px 0 0 #352561, 0 3px 0 0 #181030, -3px 0 0 0 #2c2051, 3px 0 0 0 #2c2051, 0 0 0 3px #0b0817, 0 -6px 0 0 #0b0817, 0 6px 0 0 #0b0817, -6px 0 0 0 #0b0817, 6px 0 0 0 #0b0817"
    >
      <Flex mt="-76px" justify="center">
        <Img h="48px" src="/banner-l.png" />
        <Box
          bgImage="/banner-m.png"
          bgSize="48px"
          h="48px"
          w="150px"
          textAlign="center"
        >
          <Text fontSize="lg" mt="-5px" color="white" fontWeight="bold">
            {heading}
          </Text>
        </Box>
        <Img h="48px" src="/banner-r.png" />
      </Flex>
      {children}
    </Box>
  </Flex>
)

export default BannerBox
