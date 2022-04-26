import {
  Flex,
  Heading,
  Box,
  Text,
  Grid,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useGasPrice } from '@usedapp/core'
import { useCallback, useEffect, useState } from 'react'
import { InfoShield } from '../InfoShield'
import { MarketItem } from '../MarketItem'
import PurchaseModal from '../PurchaseModal'

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
    transitionDuration=".2s"
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

  const [activeTab, setActiveTab] = useState<
    'raffles' | 'whitelists' | 'rewards'
  >('raffles')

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {}, [])

  const toast = useToast()
  const showErrorToast = useCallback(
    (err: any) => {
      console.error(JSON.stringify(err))
      const error = err.error || err
      toast({
        description: `${error.message}`,
        status: 'error',
        duration: 3000,
      })
    },
    [toast]
  )

  const [cftiCost, setCftiCost] = useState(0)

  const onRedeem = useCallback(
    (cost: number) => {
      setCftiCost(cost)
      onOpen()
    },
    [onOpen]
  )

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
        <Text mb={7} fontSize="2xl" textColor="#5E578A" lineHeight="32px">
          Spend your hard-earned CFTI on prizes!
        </Text>
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
          {activeTab === 'raffles' ? (
            <>
              <MarketItem
                name="Moonbirds"
                imgSrc="/moonbirds.png"
                allocatedSpots={6}
                spots={30}
                price={500}
                onRedeem={() => onRedeem(500)}
              >
                A collection of 10,000 utility-enabled PFPs that feature a
                richly diverse and unique pool of rarity-powered traits.
                What&apos;s more, each Moonbird unlocks private club membership
                and additional benefits the longer you hold them.
              </MarketItem>
              <MarketItem
                name="Shinsei Galverse"
                imgSrc="/galverse.png"
                allocatedSpots={6}
                spots={30}
                price={500}
                onRedeem={() => onRedeem(500)}
              >
                Shinsei Galverse is a collection of 8,888 Gals shooting across
                space and time to bring a project of peace to all cultures and
                people.
              </MarketItem>
              <MarketItem
                name="Murakami Flowers"
                imgSrc="/murakami.png"
                allocatedSpots={6}
                spots={30}
                price={1000}
                onRedeem={() => onRedeem(1000)}
              >
                Murakami.Flowers is a work in which artist Takashi Murakami’s
                representative artwork, flowers, are expressed as dot art
                evocative of Japanese TV games created in the 1970s. Each field
                has 108 flower images, resulting in 11,664 flower images in
                total.
              </MarketItem>
              <MarketItem
                name="Zarc"
                imgSrc="/zarc.jpg"
                allocatedSpots={0}
                spots={1}
                price={9999}
                onRedeem={() => onRedeem(9999)}
              >
                ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
              </MarketItem>
              <MarketItem
                name="Everai Heroes"
                imgSrc="/everai.jpg"
                allocatedSpots={6}
                spots={10}
                price={500}
                onRedeem={() => onRedeem(500)}
              >
                Everai is a brand of Heroes. Our mission is to build a
                long-lasting metaverse brand. Built for the people, with the
                people. Everai holders will be granted exclusive access to
                drops, experiences, and much more.
              </MarketItem>
              <MarketItem
                name="ON1 Force"
                imgSrc="/oni.png"
                allocatedSpots={7}
                spots={30}
                price={500}
                onRedeem={() => onRedeem(500)}
              >
                The 0N1 Force are 7,777 generative side-profile characters with
                over 100 hand-drawn features fighting for their existence.
                Strength, spirit, and style are what you’ll need to survive in
                The Ethereal Enclave.
              </MarketItem>
            </>
          ) : (
            []
          )}
        </Grid>
      </Box>
      <PurchaseModal cftiCost={cftiCost} isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
