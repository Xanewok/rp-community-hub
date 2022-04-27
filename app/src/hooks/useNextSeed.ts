import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export const useNextSeed = () => {
  const { SeederV2 } = useContracts()
  const { value, error } =
    useCall({
      contract: SeederV2,
      method: 'getNextAvailableBatch',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
