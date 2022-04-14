import { useCall } from '@usedapp/core'
import { SEEDERV2_CONTRACT } from '../constants'

export const useNextSeed = () => {
  const { value, error } =
    useCall({
      contract: SEEDERV2_CONTRACT,
      method: 'getNextAvailableBatch',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
