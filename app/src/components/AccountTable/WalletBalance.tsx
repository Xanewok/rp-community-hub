import {
  Tr,
  Td,
  Text,
  UnorderedList,
  ListItem,
  Flex,
  Spinner,
  OrderedList,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import web3 from 'web3'
import { useContracts } from '../../constants'
import { useSigner } from '../../hooks'

interface GetNftsData {
  fighters: string[]
  heros: string[]
  partyFighters: string[]
  partyHero: string
}

type GetNftsResponse = { success: false } | { success: true; data: GetNftsData }

async function fetchAssets(account: string): Promise<GetNftsData> {
  // FIXME: Use our own deployment
  const res = await fetch(`https://payaio.co/getNfts/${account}`)
  const response: GetNftsResponse = await res.json()

  if (!response.success) {
    throw new Error("Couldn't fetch fighters")
  } else {
    return response.data
  }
}

// Defined in IFighterURIHandler.sol
interface FighterStats {
  dmg: number
  enhancement: number
}

// Defined in IHeroURIHandler.sol
interface HeroStats {
  dmgMultiplier: number
  partySize: number
  enhancement: number
}

export const WalletBalance = (props: { owner: string }) => {
  const { owner } = props
  const signer = useSigner()
  const { HeroURIHandler, FighterURIHandler } = useContracts()

  const [fighterStats, setFighterStats] = useState<
    Record<number, FighterStats>
  >({})
  const [heroStats, setHeroStats] = useState<Record<number, HeroStats>>({})
  const [data, setData] = useState<Record<string, 'loading' | GetNftsData>>({})
  const [lastUpdate, setLastUpdate] = useState(new Date(0))

  const fetchAndUpdate = useCallback(async (owner) => {
    setData((old) => ({ ...old, [owner]: 'loading' }))
    const assets = await fetchAssets(owner)
    setData((old) => ({ ...old, [owner]: assets }))
    setLastUpdate(new Date())
  }, [])

  const DEBOUNCE_MS = 1500
  useEffect(() => {
    if (!owner || !web3.utils.isAddress(owner)) return

    const sinceUpdate = new Date().getTime() - lastUpdate.getTime()
    if (sinceUpdate < DEBOUNCE_MS) {
      setTimeout(() => fetchAndUpdate(owner), DEBOUNCE_MS - sinceUpdate)
    } else {
      fetchAndUpdate(owner)
    }
    // NOTE: Don't include lastUpdate, since this would perpetually update;
    // whereas we only need a debounce-like mechanism here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAndUpdate, owner])

  const balance = data[owner]
  const [heroes, fighters] = useMemo(
    () =>
      !balance || balance === 'loading'
        ? [[], []]
        : [
            [balance.partyHero].concat(balance.heros).filter((id) => id != '0'),
            balance.partyFighters
              .concat(balance.fighters)
              .filter((id) => id != '0'),
          ],

    [balance]
  )

  useEffect(() => {
    if (!signer) return

    const uriHandler = HeroURIHandler.connect(signer)
    Promise.all(
      heroes.map((id) =>
        uriHandler.getStats(id).then((stats: any) => [Number(id), stats])
      )
    )
      .then((entries) => Object.fromEntries(entries))
      .then(setHeroStats)
  }, [HeroURIHandler, heroes, signer])

  useEffect(() => {
    if (!signer) return

    const uriHandler = FighterURIHandler.connect(signer)
    Promise.all(
      fighters.map((id) =>
        uriHandler.getStats(id).then((stats: any) => [Number(id), stats])
      )
    )
      .then((entries) => Object.fromEntries(entries))
      .then(setFighterStats)
  }, [FighterURIHandler, fighters, signer])

  const renderHero = useCallback(
    (tokenId: string) => {
      const [id, stats] = [Number(tokenId), heroStats[Number(tokenId)]] as const
      const aux = stats
        ? `+${stats.enhancement} (${stats.dmgMultiplier}/
      ${stats.partySize})`
        : ''

      return (
        <ListItem fontSize="xl" key={`${owner}-hero-${id}`}>
          Hero #{id} {aux}
        </ListItem>
      )
    },
    [heroStats, owner]
  )

  const renderFighter = useCallback(
    (tokenId: number) => {
      // Inspired by https://wowpedia.fandom.com/wiki/Quality
      const rarityColors = [
        [1400, '#e6cc80'],
        [1395, '#ff8000'],
        [1371, '#a335ee'],
        [1311, '#0070dd'],
        [1161, '#1eff00'],
        [1160, 'white'],
      ] as const

      const stats = fighterStats[tokenId]
      const aux = stats ? `+${stats.enhancement} (${stats.dmg})` : ''
      const [, textColor] = (stats?.dmg &&
        rarityColors.find(([dmg]) => stats?.dmg >= dmg)) || [null, 'white']

      return (
        <ListItem
          fontSize={'xl'}
          key={`${owner}-fighter-${tokenId}`}
          textColor={textColor}
          filter={'saturate(0.7)'}
        >
          Fighter #{tokenId} {aux}
        </ListItem>
      )
    },
    [fighterStats, owner]
  )

  return (
    <Tr borderBottom={'1px solid'}>
      <Td>
        {!balance ? null : balance === 'loading' ? (
          <Flex justify={'center'}>
            <Spinner />
          </Flex>
        ) : (
          <>
            <Flex justifyContent={'space-between'}>
              <div>
                <Text fontSize={'2xl'} mb={2}>
                  Party:
                </Text>
                <UnorderedList>{renderHero(balance.partyHero)}</UnorderedList>
                <OrderedList>
                  {balance.partyFighters
                    .filter((id) => id != '0')
                    .map(Number)
                    .map(renderFighter)}
                </OrderedList>
              </div>
              {(balance.heros.length > 0 || balance.fighters.length > 0) && (
                <div>
                  <Text fontSize={'2xl'} mb={2}>
                    Wallet:
                  </Text>
                  <UnorderedList>
                    {balance.heros.filter((id) => id != '0').map(renderHero)}
                    {balance.fighters
                      .filter((id) => id != '0')
                      .map(Number)
                      .sort((a, b) =>
                        fighterStats[a] && fighterStats[b]
                          ? fighterStats[b].dmg - fighterStats[a].dmg
                          : b - a
                      )
                      .map(renderFighter)}
                  </UnorderedList>
                </div>
              )}
            </Flex>
          </>
        )}
      </Td>
      <Td />
      <Td />
      <Td />
      <Td />
    </Tr>
  )
}
