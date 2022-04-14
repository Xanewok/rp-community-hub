import { useEthers } from '@usedapp/core'
import { useMemo } from 'react'

export const useSigner = () => {
  const { library } = useEthers()
  return useMemo(() => library?.getSigner(), [library])
}
