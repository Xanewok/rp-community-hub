import {
  Flex,
  Heading,
  Img,
  Button,
  Container,
  Box,
  Text,
  Grid,
} from '@chakra-ui/react'
import { useEthers, useGasPrice } from '@usedapp/core'
import { useState } from 'react'
import { InfoShield } from '../InfoShield'
import { MarketItem } from '../MarketItem'
import Status from '../Status'

const TabItem: React.FC<{
  value: string
  active?: boolean
  onClick: () => void
}> = (props) => (
  <Box
    px={2}
    h="40px"
    color="#5e578a"
    cursor="pointer"
    userSelect="none"
    onClick={props.onClick}
    background={props.active ? '#2b2254' : '#16112d'}
    boxShadow={
      props.active
        ? '0 -2px 0 0 #372a70,0 2px 0 0 #231b47,-2px 0 0 0 #372a70,2px 0 0 0 #372a70,0 0 0 2px #080611,0 -4px 0 0 #080611,0 4px 0 0 #080611,-4px 0 0 0 #080611,4px 0 0 0 #080611'
        : '0 -2px 0 0 #231b4c,0 2px 0 0 #231b47,-2px 0 0 0 #231b4c,2px 0 0 0 #231b4c,0 0 0 2px #080611,0 -4px 0 0 #080611,0 4px 0 0 #080611,-4px 0 0 0 #080611,4px 0 0 0 #080611'
    }
  >
    <Text
      as="span"
      fontWeight="bold"
      fontSize="2xl"
      textColor={props.active ? 'white' : undefined}
    >
      {props.value}
    </Text>
  </Box>
)

export const Marketplace: React.FC = () => {
  const gasPrice = useGasPrice()

  const { account } = useEthers()

  const [activeTab, setActiveTab] = useState<
    'raffles' | 'whitelists' | 'rewards'
  >('raffles')

  return (
    <Box position="relative" h="100%" w="100%" overflow="auto">
      <Flex position="absolute" top={10} right={10} zIndex={10}>
        <InfoShield
          value={`⛽ ${Math.trunc((Number(gasPrice) || 0) / 10 ** 9)}`}
        />
        <InfoShield type="cftiBalance" />
      </Flex>

      <Box
        w="100%"
        minHeight="100%"
        backgroundAttachment="fixed"
        backgroundSize="cover"
        p={10}
        backgroundImage="/tiles.png"
      >
        <Heading textColor="white" lineHeight="36px" mb={0}>
          Market
        </Heading>
        <Heading
          fontWeight="normal"
          textColor="#5E578A"
          lineHeight={3}
          mb={7}
          fontSize="2xl"
        >
          Spend your hard-earned CFTI on prizes!
        </Heading>
        <Flex gap={4} mb={10}>
          <TabItem
            value="Raffles"
            active={activeTab === 'raffles'}
            onClick={() => setActiveTab('raffles')}
          />
          <TabItem
            value="Whitelists"
            active={activeTab === 'whitelists'}
            onClick={() => setActiveTab('whitelists')}
          />
          <TabItem
            value="Rewards"
            active={activeTab === 'rewards'}
            onClick={() => setActiveTab('rewards')}
          />
        </Flex>
        <Grid
          gap={10}
          gridTemplateColumns="repeat(auto-fill,minmax(500px,1fr))"
        >
          {activeTab === 'raffles' ? [0, 1, 2].map(MarketItem) : []}
        </Grid>
      </Box>
    </Box>
  )
}
