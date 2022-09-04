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

function partition<T>(
  arr: T[],
  filter: (val: T, index: number, arr: T[]) => boolean
) {
  return arr.reduce(
    (r, e, i, a) => {
      r[filter(e, i, a) ? 0 : 1].push(e)
      return r
    },
    [[] as T[], [] as T[]]
  )
}

interface GetNftsData {
  fighters: Array<{ tokenId: string; class: string }>
  heros: Array<{ tokenId: string }>
  partyFighters: string[]
  partyHero: string
}

interface Balance {
  fighters: {
    party: Array<{ tokenId: number; class: string }>
    wallet: Array<{ tokenId: number; class: string }>
  }
  heroes: {
    party: number | null
    wallet: Array<number>
  }
}

type GetNftsResponse = { success: false } | { success: true; data: GetNftsData }

async function fetchAssets(account: string): Promise<GetNftsData> {
  const res = await fetch(`https://api-mainnet.raid.party/getNfts/${account}`)
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
  const [data, setData] = useState<Record<string, 'loading' | Balance>>({})
  const [lastUpdate, setLastUpdate] = useState(new Date(0))

  const fetchAndUpdate = useCallback(async (owner) => {
    setData((old) => ({ ...old, [owner]: 'loading' }))
    const assets = await fetchAssets(owner)

    const fighters = assets.fighters.map((fighter) => ({
      ...fighter,
      tokenId: Number(fighter.tokenId),
    }))
    const [partyFighters, walletFighters] = partition(fighters, ({ tokenId }) =>
      assets.partyFighters.includes(tokenId.toString())
    )

    setData((old) => ({
      ...old,
      [owner]: {
        fighters: { party: partyFighters, wallet: walletFighters },
        heroes: {
          party: assets.partyHero === '0' ? null : Number(assets.partyHero),
          wallet: assets.heros
            .map((hero) => hero.tokenId)
            .filter((hero) => hero != assets.partyHero),
        },
      },
    }))
    setLastUpdate(new Date())
  }, [])

  useEffect(() => {
    if (!owner || !web3.utils.isAddress(owner)) return

    const sinceUpdate = new Date().getTime() - lastUpdate.getTime()
    const DEBOUNCE_MS = 1500
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
            balance.heroes.wallet.concat(balance.heroes.party ?? []),
            balance.fighters.wallet.concat(balance.fighters.party),
          ],

    [balance]
  )

  useEffect(() => {
    if (!signer) return

    const uriHandler = HeroURIHandler.connect(signer)
    Promise.all(
      heroes.map((id) =>
        uriHandler.getStats(id).then((stats: any) => [id, stats])
      )
    )
      .then((entries) => Object.fromEntries(entries))
      .then(setHeroStats)
  }, [HeroURIHandler, heroes, signer])

  useEffect(() => {
    if (!signer) return

    const uriHandler = FighterURIHandler.connect(signer)
    Promise.all(
      fighters.map(({ tokenId }) =>
        uriHandler.getStats(tokenId).then((stats: any) => [tokenId, stats])
      )
    )
      .then((entries) => Object.fromEntries(entries))
      .then(setFighterStats)
  }, [FighterURIHandler, fighters, signer])

  const renderHero = useCallback(
    (tokenId: number) => {
      const { enhancement, dmgMultiplier, partySize } = heroStats[tokenId] ?? {}
      const aux = heroStats[tokenId]
        ? `+${enhancement} (${dmgMultiplier}/${partySize})`
        : ''

      return (
        <ListItem fontSize="xl" key={`${owner}-hero-${tokenId}`}>
          Hero #{tokenId} {aux}
        </ListItem>
      )
    },
    [heroStats, owner]
  )

  const renderFighter = useCallback(
    (fighter: { tokenId: number; class: string }) => {
      // Inspired by https://wowpedia.fandom.com/wiki/Quality
      const rarityColors = [
        [1400, '#e6cc80'],
        [1395, '#ff8000'],
        [1371, '#a335ee'],
        [1311, '#0070dd'],
        [1161, '#1eff00'],
        [1160, 'white'],
      ] as const

      const { enhancement, dmg } = fighterStats[fighter.tokenId] ?? {}
      const aux = fighterStats[fighter.tokenId]
        ? `+${enhancement} (${dmg})`
        : ''
      const [, textColor] = (dmg &&
        rarityColors.find(([threshold]) => dmg >= threshold)) || [null, 'white']

      return (
        <ListItem
          fontSize={'xl'}
          key={`${owner}-fighter-${fighter.tokenId}`}
          textColor={textColor}
          filter={'saturate(0.7)'}
        >
          {fighter.class} #{fighter.tokenId} {aux}
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
                <UnorderedList>
                  {balance.heroes.party && renderHero(balance.heroes.party)}
                </UnorderedList>
                <OrderedList>
                  {balance.fighters.party.map(renderFighter)}
                </OrderedList>
              </div>
              {(balance.heroes.wallet.length > 0 ||
                balance.fighters.wallet.length > 0) && (
                <div>
                  <Text fontSize={'2xl'} mb={2}>
                    Wallet:
                  </Text>
                  <UnorderedList>
                    {balance.heroes.wallet.map(renderHero)}
                    {balance.fighters.wallet
                      .sort((a, b) =>
                        fighterStats[a.tokenId] && fighterStats[b.tokenId]
                          ? fighterStats[b.tokenId].dmg -
                            fighterStats[a.tokenId].dmg
                          : b.tokenId - a.tokenId
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
