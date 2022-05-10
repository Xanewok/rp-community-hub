import { useCall, useCalls } from '@usedapp/core'
import { useContracts } from '../constants'

export const usePartyDamage = (address: string | null | undefined) => {
  const { Party } = useContracts()
  const { value, error } =
    useCall(
      address && {
        contract: Party as any,
        method: 'getDamage', // Method to be called
        args: [address], // Method arguments
      }
    ) ?? {}
  if (error) {
    console.error(error.message)
    return 0
  }
  return value ? Number(value?.[0]) : 0
}

export const usePartyDamages = (addresses: string[]) => {
  const { Party } = useContracts()
  const calls = addresses
    .filter((addr) => !!addr)
    .map((address) => ({
      contract: Party as any,
      method: 'getDamage',
      args: [address],
    }))

  const results = useCalls(calls)

  const err = results.find((result) => !!result?.error)
  if (err) {
    console.error(err.error?.message)
    return []
  } else {
    return results.map((result) =>
      result?.value ? Number(result?.value?.[0]) : 0
    )
  }
}
