import { Button } from '@chakra-ui/react'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { ethers } from 'ethers'
import { useMemo } from 'react'
import { CONFETTI_CONTRACT, TOKEN_ADDRESS } from '../../constants'
import { usePendingRewards } from '../../hooks'

const SPENDER = TOKEN_ADDRESS['COLLECTOR']
const MAX_UINT256 = ethers.constants.MaxUint256

// 1. If the user has already approved the contract, just
export const ApproveCfti = (props: { owner: any }) => {
  const { owner } = props

  const { library, account } = useEthers()
  const allowance = useTokenAllowance(TOKEN_ADDRESS['CFTI'], owner, SPENDER)
  const pendingRewards = usePendingRewards(owner)

  const state = useMemo(() => {
    if (allowance?.gte(pendingRewards)) {
      return { msg: 'Approved', disabled: true }
    } else if (
      !account ||
      `${owner}`.toLowerCase() != `${account}`.toLowerCase()
    ) {
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
              MAX_UINT256
            )
          }
        },
      }
    }
  }, [allowance, pendingRewards, account, owner, library])

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
