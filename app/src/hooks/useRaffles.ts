import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export const useRaffle = (raffleId: number) => {
  const { RaffleParty } = useContracts()
  const { value, error } =
    useCall(
      raffleId && {
        contract: RaffleParty,
        method: '_raffles', // Method to be called
        args: [raffleId], // Method arguments
      }
    ) ?? {}
  if (error) {
    console.error(error.message)
    return 0
  }
  return value ? value?.[0] : 0
}

export const useRaffleCount = () => {
  const { RaffleParty } = useContracts()
  const { value, error } =
    useCall({
      contract: RaffleParty,
      method: 'getRaffleCount', // Method to be called
      args: [], // Method arguments
    }) ?? {}
  if (error) {
    console.error(error.message)
    return 0
  }
  return value ? Number(value?.[0]) : 0
}
