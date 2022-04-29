import { supabaseWithGlobalFetch as supabase } from '../../../utils/supabaseClient'
import { NextApiRequest, NextApiResponse } from 'next'

type Erc721Metadata = {
  name: string
  description: string
  image: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Erc721Metadata | string>
) {
  const { id } = req.query
  const { data, error } = await supabase
    .from('raffles')
    .select('name,description,image')
    .eq('id', id)
    .single()

  if (error) {
    return res.status(400).send(error.message)
  } else {
    return res.status(200).json(data)
  }
}
