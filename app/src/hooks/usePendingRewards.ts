import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export const usePendingRewards = (account: any) => {
  const { Raid } = useContracts()
  const { value, error } =
    useCall(
      account && {
        contract: Raid,
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
  const { RpYieldCollector } = useContracts()
  const { value, error } =
    useCall({
      contract: RpYieldCollector as any,
      method: 'getPendingRewards',
      args: [accounts.filter((acc) => !!acc)],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
