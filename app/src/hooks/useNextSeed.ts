import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export const useNextSeed = () => {
  const { RpSeeder } = useContracts()
  const { value, error } =
    useCall({
      contract: RpSeeder,
      method: 'getNextAvailableBatch',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}

export const useCurrentSeedRound = () => {
  const { RpSeeder } = useContracts()
  const { value, error } =
    useCall({
      contract: RpSeeder,
      method: 'getBatch',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
