import { Button } from '@chakra-ui/react'
import { useEthers, useTokenAllowance } from '@usedapp/core'
import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import { useContracts } from '../../constants'

import { BigNumber } from '@ethersproject/bignumber'

const MAX_UINT256 = ethers.constants.MaxUint256

// 1. If the user has already approved the contract, just
export const ApproveCfti = (props: { owner?: any }) => {
  const { Confetti, RaffleParty } = useContracts()

  const { library, account } = useEthers()
  const owner = props.owner || account
  const spender = RaffleParty.address
  const allowance = useTokenAllowance(Confetti.address, owner, spender)
  // TODO: Set that up in a smarter way
  const requiredAllowance = BigNumber.from(10).pow(27)
  const [loading, setLoading] = useState(false)

  const state = useMemo(() => {
    if (allowance?.gte(requiredAllowance) && allowance?.gt(0)) {
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
        onClick: async () => {
          const signer = library?.getSigner(account)
          if (signer) {
            try {
              const tx = await Confetti.connect(signer).approve(
                spender,
                MAX_UINT256
              )
              setLoading(true)
              await tx.wait()
            } catch (e) {
            } finally {
              setLoading(false)
            }
          }
        },
      }
    }
  }, [allowance, requiredAllowance, account, owner, library, Confetti, spender])

  return (
    <Button
      isLoading={loading}
      onClick={state.onClick}
      disabled={state.disabled}
    >
      {state.msg}
    </Button>
  )
}
