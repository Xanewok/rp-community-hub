import { useCall } from '@usedapp/core'
import { RAID_CONTRACT } from '../constants'

export const usePendingRewards = (account: any) => {
  const { value, error } =
    useCall({
      contract: RAID_CONTRACT,
      method: 'getPendingRewards',
      args: [account],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
