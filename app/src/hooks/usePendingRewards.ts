import { useCall } from '@usedapp/core'
import { COLLECTOR_CONTRACT, RAID_CONTRACT } from '../constants'

export const usePendingRewards = (account: any) => {
  const { value, error } =
    useCall(
      account && {
        contract: RAID_CONTRACT,
        method: 'getPendingRewards',
        args: [account],
      }
    ) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}

export const useMultiplePendingRewards = (accounts: any[]) => {
  const { value, error } =
    useCall({
      contract: COLLECTOR_CONTRACT,
      method: 'getPendingRewards',
      args: [accounts.filter(acc => !!acc)],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
