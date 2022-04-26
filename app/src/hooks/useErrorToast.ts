import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'

export default function useErrorToast() {
  const toast = useToast()
  const showErrorToast = useCallback(
    (err: any) => {
      console.error(JSON.stringify(err))
      const error = err.error || err
      toast({
        description: `${error.message}`,
        status: 'error',
        duration: 3000,
      })
    },
    [toast]
  )
  return showErrorToast
}
