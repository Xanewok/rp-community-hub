import { useCall } from '@usedapp/core'
import { PARTY_CONTRACT } from '../constants'

export const useUserHero = (address: string | null | undefined) => {
  const { value, error } =
    useCall(
      address && {
        contract: PARTY_CONTRACT,
        method: 'getUserHero', // Method to be called
        args: [address], // Method arguments
      }
    ) ?? {}
  if (error) {
    console.error(error.message)
    return 0
  }
  return value ? Number(value?.[0]) : 0
}
