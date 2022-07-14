import {
  Tr,
  Td,
  Text,
  UnorderedList,
  ListItem,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import web3 from 'web3'

interface GetNftsData {
  fighters: string[]
  heros: string[]
  partyFighters: string[]
  partyHero: string
}

type GetNftsResponse = { success: false } | { success: true; data: GetNftsData }

async function fetchAssets(account: string): Promise<GetNftsData> {
  // FIXME: Use our own deployment
  const res = await fetch(`https://rp-api.waves.gg/getNfts/${account}`)
  const response: GetNftsResponse = await res.json()
  console.log({ response })

  if (!response.success) {
    throw new Error("Couldn't fetch fighters")
  } else {
    return response.data
  }
}

export const WalletBalance = (props: { owner: string }) => {
  const { owner } = props

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
                  <ListItem>Hero: #{balance.partyHero}</ListItem>
                  {balance.partyFighters
                    .filter((id) => id != '0')
                    .map((id) => (
                      <ListItem key={`${owner}-wallet-hero-${id}`}>
                        Fighter #{id}
                      </ListItem>
                    ))}
                </UnorderedList>
              </div>
              {(balance.heros.length > 0 || balance.fighters.length > 0) && (
                <div>
                  <Text fontSize={'2xl'} mb={2}>
                    Wallet:
                  </Text>
                  <UnorderedList>
                    {balance.heros
                      .filter((id) => id != '0')
                      .map((id) => (
                        <ListItem key={`${owner}-wallet-hero-${id}`}>
                          Hero #{id}
                        </ListItem>
                      ))}
                    {balance.fighters
                      .filter((id) => id != '0')
                      .map((id) => (
                        <ListItem key={`${owner}-wallet-fighter-${id}`}>
                          Fighter #{id}
                        </ListItem>
                      ))}
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
