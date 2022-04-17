import { useCall, useCalls } from '@usedapp/core'
import { Contract } from 'ethers'
import { PARTY_CONTRACT } from '../constants'

export const usePartyDamage = (address: string | null | undefined) => {
  const { value, error } =
    useCall(
      address && {
        contract: PARTY_CONTRACT,
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
  const calls = addresses.map((address) => ({
    contract: PARTY_CONTRACT,
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
