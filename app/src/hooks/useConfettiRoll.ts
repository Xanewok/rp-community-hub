import { useCall } from '@usedapp/core'
import { useContracts } from '../constants'

export function useConfettiRoll(method: string, ...args: Array<any>) {
  const { ConfettiRoll } = useContracts()
  const { value, error } =
    useCall({
      contract: ConfettiRoll as any,
      method,
      args: [...args],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}
