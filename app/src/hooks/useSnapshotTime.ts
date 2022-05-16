import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export const useSnapshotTime = () => {
  const { Raid } = useContracts()
  const { value, error } =
    useCall({
      contract: Raid as any,
      method: 'lastSnapshotTime',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0] as number
}

export const useCurrentSeedRound = () => {
  const { RpSeeder } = useContracts()
  const { value, error } =
    useCall({
      contract: RpSeeder as any,
      method: 'getBatch',
      args: [],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
