import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { ChainId } from '@usedapp/core'
import { ethers } from 'ethers'

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../../../constants'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE || ''

const supabase = createClient(supabaseUrl, supabaseKey, {
  fetch: fetch.bind(globalThis),
})

const INFURA_URL = `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
const WEB3_PROVIDER = new ethers.providers.JsonRpcProvider(INFURA_URL)
const RAFFLE_PARTY = new ethers.Contract(
  CONTRACT_ADDRESS[ChainId.Rinkeby].RaffleParty,
  CONTRACT_ABI.RaffleParty,
  WEB3_PROVIDER
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[] | string>
) {
  const { id } = req.query

  let winners: string[]
  try {
    const raffleWinners = await RAFFLE_PARTY.raffleWinners(id)
    if (Array.isArray(raffleWinners)) {
      winners = raffleWinners
    } else {
      throw new Error('Results are not a list of winners')
    }
  } catch (e: any) {
    if (e.code === 'CALL_EXCEPTION') {
      return res.status(400).send(`${e.errorArgs}`)
    } else {
      return res.status(400).send(`${e}`)
    }
  }
  // The values are iterable in the insertion order, see
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  const winnersSet = new Set(winners)

  const { data, error } = await supabase
    .from('profiles')
    .select('discord_id, eth')
    .in('eth', [...winnersSet])

  if (error) {
    return res.status(400).send(error.message)
  } else {
    return res.status(200).json(data || [])
  }
}
