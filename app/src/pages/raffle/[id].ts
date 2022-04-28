// TODO: Add a supabase table and an endpoint

import { supabaseWithGlobalFetch as supabase } from '../../utils/supabaseClient'
import Web3 from 'web3'

import { handleAuth } from '@supabase/supabase-auth-helpers/nextjs'
import { supabaseWithGlobalFetch as supabase } from '../../utils/supabaseClient'
import { NextApiRequest, NextApiResponse } from 'next'

type Erc721Metadata = {
  name: string
  description: string
  image: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Erc721Metadata>
) {
  const { id: queryId } = req.query
  supabase.auth.setAuth(req.cookies['sb-access-token'])
  const { error } = await supabase.from('profiles').upsert({ id: user_id, eth })
}
