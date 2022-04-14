import { Button } from '@chakra-ui/react'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { CONFETTI_CONTRACT, TOKEN_ADDRESS } from '../../constants'

const SPENDER = TOKEN_ADDRESS['COLLECTOR']

// 1. If the user has already approved the contract, just
export const ApproveCfti = (props: { owner: any }) => {
  const { owner } = props

  const { library, account } = useEthers()
  const allowance = useTokenAllowance(TOKEN_ADDRESS['CFTI'], owner, SPENDER)
  // TODO: Support allowing less money than infinite
  const requiredAllowance = ethers.constants.MaxUint256.toString()

  const state = useMemo(() => {
    if (allowance?.gte(requiredAllowance)) {
      return { msg: 'Approved', disabled: true }
    } else if (!account || `${owner}`.toLowerCase() != `${account}`.toLowerCase()) {
      return { msg: 'Not approved', disabled: true }
    } else {
      return {
        msg: 'Approve $CFTI',
        disabled: false,
        onClick: () => {
          const signer = library?.getSigner(account)
          if (signer) {
            CONFETTI_CONTRACT.connect(signer).approve(
              TOKEN_ADDRESS['COLLECTOR'],
              requiredAllowance
            )
          }
        },
      }
    }
  }, [allowance, requiredAllowance, account, owner, library])

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
