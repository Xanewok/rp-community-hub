import { Button, Tooltip, useToast } from '@chakra-ui/react'
import { useNetwork } from '@usedapp/core'
import { useCallback } from 'react'
import web3 from 'web3'

import { COLLECTOR_CONTRACT } from '../../constants'
import { useSigner } from '../../hooks/useSigner'

interface ClaimButtonProps {
  accountList: string[]
  operator: string
  accumulate: { accumulate: boolean; stash: string }
  tax: { collectTax: boolean; taxCollector: string; taxRate: number }
}

export const ClaimButton = (props: ClaimButtonProps) => {
  const {
    accountList,
    operator,
    accumulate: { accumulate, stash },
    tax: { collectTax, taxCollector, taxRate },
  } = props

  const {
    network: { provider, accounts },
  } = useNetwork()

  const toast = useToast()
  const showErrorToast = useCallback(
    (err: any) => {
      console.error(JSON.stringify(err))
      const error = err.error || err
      toast({
        description: [`${error.message}`, `(${err.code})`].join(' '),
        status: 'error',
        duration: 3000,
      })
    },
    [toast]
  )

  const signer = provider?.getSigner(accounts[0])

  const claimRewards = useCallback(async () => {
    const wallets = accountList.filter(web3.utils.isAddress)
    if (!signer || wallets.length <= 0) {
      return
    }

    try {
      const contract = COLLECTOR_CONTRACT.connect(signer)

      if (!accumulate && !collectTax) {
        await contract.claimMultipleRewards(wallets)
      } else if (!collectTax) {
        await contract.claimMultipleRewardsTo(wallets, stash)
      } else if (!accumulate) {
        const taxBasisPoints = Math.round(taxRate * 100)

        await contract.taxedClaimMultipleRewards(
          wallets,
          taxBasisPoints,
          taxCollector
        )
      } else {
        const taxBasisPoints = Math.round(taxRate * 100)

        await contract.taxedClaimMultipleRewardsTo(
          wallets,
          stash,
          taxBasisPoints,
          taxCollector
        )
      }
    } catch (e) {
      showErrorToast(e)
    }
  }, [
    accountList,
    signer,
    accumulate,
    collectTax,
    stash,
    taxRate,
    taxCollector,
    showErrorToast,
  ])
  // Whether the user needs to execute the action as the operator but the active
  // signer account is different
  const hasToBeOperator = accumulate || collectTax
  const isOperator = operator.toLowerCase() == (accounts[0] || '').toLowerCase()

  return (
    <Tooltip
      label={
        hasToBeOperator && !isOperator
          ? 'You need to be the Operator to submit this transaction'
          : !accumulate
          ? 'Rewards will be claimed to their respective wallets'
          : 'Rewards will be claimed and sent to the Stash account'
      }
      shouldWrapChildren
    >
      <Button
        disabled={
          !signer ||
          accountList.filter(web3.utils.isAddress).length <= 0 ||
          (hasToBeOperator && !isOperator)
        }
        mt="1rem"
        ml="auto"
        mr="auto"
        onClick={claimRewards}
      >
        {hasToBeOperator && !isOperator ? 'Switch account' : 'Claim rewards'}
      </Button>
    </Tooltip>
  )
}
