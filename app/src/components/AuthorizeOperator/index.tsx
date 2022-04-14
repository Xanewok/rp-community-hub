import { Button } from '@chakra-ui/react'
import { useCall, useEthers } from '@usedapp/core'
import { useMemo } from 'react'
import { COLLECTOR_CONTRACT } from '../../constants'

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

  const { library, account } = useEthers()
  const isOperator = useIsOperatorFor(operator, owner)

  const state = useMemo(() => {
    if (isOperator) {
      return { msg: 'Authorized', disabled: true }
    } else if (
      !account ||
      `${owner}`.toLowerCase() != `${account}`.toLowerCase()
    ) {
      return { msg: 'Not authorized', disabled: true }
    } else {
      return {
        msg: 'Authorize',
        disabled: false,
        onClick: () => {
          const signer = library?.getSigner(owner)
          if (signer) {
            COLLECTOR_CONTRACT.connect(signer).authorizeOperator(operator)
          }
        },
      }
    }
  }, [isOperator, account, owner, library, operator])

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
