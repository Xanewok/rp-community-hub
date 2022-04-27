import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export const useUserHero = (address: string | null | undefined) => {
  const { Party } = useContracts()
  const { value, error } =
    useCall(
      address && {
        contract: Party,
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
