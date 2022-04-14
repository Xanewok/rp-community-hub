import { Button, useToast } from '@chakra-ui/react'
import { useCall, useEthers } from '@usedapp/core'
import { useCallback, useMemo } from 'react'
import { COLLECTOR_CONTRACT } from '../../constants'
import web3 from 'web3'

export const useIsOperatorFor = (operator: any, holder: any) => {
  const { value, error } =
    useCall({
      contract: COLLECTOR_CONTRACT,
      method: 'isOperatorFor',
      args: [operator, holder],
    }) ?? {}

  if (error) {
    console.error(error.message)
    return null
  }
  return value?.[0]
}

export const AuthorizeOperator = (props: { owner: any; operator: any }) => {
  const { owner, operator } = props
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

  const { library, account } = useEthers()
  const isOperator = useIsOperatorFor(operator, owner)

  const state = useMemo(() => {
    if (isOperator) {
      return { msg: 'Authorized', disabled: true }
    } else if (
      !account ||
      !operator ||
      `${owner}`.toLowerCase() != `${account}`.toLowerCase()
    ) {
      return { msg: 'Not authorized', disabled: true }
    } else {
      return {
        msg: 'Authorize operator',
        disabled: false,
        onClick: () => {
          if (!web3.utils.isAddress(operator)) {
            showErrorToast(
              new Error('Operator is not a valid Ethereum address')
            )
            return
          }
          const signer = library?.getSigner(owner)
          if (signer) {
            COLLECTOR_CONTRACT.connect(signer).authorizeOperator(operator)
          }
        },
      }
    }
  }, [isOperator, account, owner, library, operator, showErrorToast])

  return (
    <Button
      size="xs"
      p="0 1px 6px 1px"
      onClick={state.onClick}
      disabled={state.disabled}
    >
      {state.msg}
    </Button>
  )
}
