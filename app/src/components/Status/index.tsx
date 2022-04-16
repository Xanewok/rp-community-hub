import {
  Text,
  Box,
  Button,
  Img,
  Flex,
  Tooltip,
  useToast,
  createIcon,
  NumberInput,
  NumberInputField,
  Checkbox,
  Select,
} from '@chakra-ui/react'
import BannerBox from '../Global/BannerBox'
import { useEthers, useNetwork, useTokenBalance } from '@usedapp/core'
import {
  COLLECTOR_CONTRACT,
  CONFETTI_CONTRACT,
  RAID_CONTRACT,
  TOKEN_ADDRESS,
} from '../../constants'
import { useState, useEffect, useCallback } from 'react'
import web3 from 'web3'

import { logEvent } from '../../utils'
import { useLocalStorage, useSigner } from '../../hooks'
import { AddressInput } from '../AddressInput'
import { AccountList } from '../AccountTable'

type StatusProps = {
  connected: any
}

const Status = ({ connected }: StatusProps) => {
  const {
    network: { provider, chainId, accounts, errors },
    deactivate,
    activate,
  } = useNetwork()
  const [accountList, setAccountList] = useLocalStorage<string[]>('accs', [])

  const [accumulate, enableAccumulate] = useState(false)
  const [stash, setStash] = useState('')
  const [collectTax, enableCollectTax] = useState(false)
  const [taxCollector, setTaxCollector] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [operator, setOperator] = useState('')

  const signer = useSigner()

  const balance = useTokenBalance(TOKEN_ADDRESS['CFTI'], accounts[0])
  // TODO: Abstract that away
  const [totalRewards, setTotalRewards] = useState(0)
  useEffect(() => {
    if (!signer) {
      return
    }
    const raid = RAID_CONTRACT.connect(signer)
    Promise.all(
      accountList
        .filter((x) => !!x)
        .filter(web3.utils.isAddress)
        .map((acc) => raid.getPendingRewards(acc))
    )
      .then((rewards) => rewards.reduce((prev, cur) => prev + Number(cur), 0))
      .then((rewards) => setTotalRewards(rewards / 10 ** 18))
  }, [signer, accountList])
  const [totalBalance, setTotalBalance] = useState(0)
  useEffect(() => {
    if (!signer) {
      return
    }
    const confetti = CONFETTI_CONTRACT.connect(signer)
    const specifiedWallets = accountList
      .filter((x) => !!x)
      .filter(web3.utils.isAddress)
    const wallets = specifiedWallets.length > 0 ? specifiedWallets : accounts
    Promise.all(wallets.map((acc) => confetti.balanceOf(acc)))
      .then((rewards) => rewards.reduce((prev, cur) => prev + Number(cur), 0))
      .then((rewards) => setTotalBalance(rewards / 10 ** 18))
  }, [signer, accountList, accounts])

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

  const claimRewards = useCallback(async () => {
    const wallets = accountList.filter(web3.utils.isAddress)
    const signer = provider?.getSigner(accounts[0])
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
    provider,
    accounts,
    stash,
    taxRate,
    taxCollector,
    showErrorToast,
    accumulate,
    collectTax,
  ])

  return (
    <BannerBox heading="Accounts">
      <Box p="16px" textAlign="center">
        {!connected && (
          <Text fontSize="xx-large" mb="20px" color="white">
            Not connected
          </Text>
        )}

        <AccountList
          accountList={accountList}
          setAccountList={setAccountList}
          operator={operator}
          needsAuthorization={accumulate || collectTax}
        />

        <Tooltip label="The account that is authorized by the above addresses to move their $CFTI tokens for accumulation/tax">
          <Flex my="0.375em">
            <Text>Operator</Text>
            <Select
              ml="auto"
              w="85%"
              variant={
                operator != '' && web3.utils.isAddress(operator)
                  ? 'filled'
                  : undefined
              }
              _hover={{ filter: 'brightness(1.25)' }}
              background={
                operator != '' && web3.utils.isAddress(operator)
                  ? 'purple.300'
                  : 'purple.200'
              }
              border="1px"
              onChange={(ev) => setOperator(ev.target.value)}
              placeholder="Address"
              value={operator}
              isInvalid={operator != '' && !web3.utils.isAddress(operator)}
              isDisabled={!accumulate && !collectTax}
            >
              {[...new Set(accountList)]
                .filter((val) => !!val)
                .map((acc, idx) => (
                  <option key={idx} value={acc}>
                    {acc}
                  </option>
                ))}
            </Select>
          </Flex>
        </Tooltip>

        <Flex>
          <Checkbox
            size="lg"
            disabled={!connected}
            checked={accumulate}
            onChange={({ target }) => enableAccumulate(target.checked)}
          >
            <Text ml="2" mb="2" fontSize="xl" fontWeight="bold">
              <Tooltip label="If enabled, moves all of the pending rewards to a designated stash account">
                Accumulate
              </Tooltip>
            </Text>
          </Checkbox>
        </Flex>
        <Flex my="0.375em">
          <Text>Stash</Text>
          <AddressInput
            disabled={!connected || !accumulate}
            ml="auto"
            w="85%"
            onChange={(ev) => setStash(ev.target.value)}
            value={stash}
          />
        </Flex>

        <Flex>
          <Checkbox
            size="lg"
            disabled={!connected}
            checked={collectTax}
            onChange={({ target }) => enableCollectTax(target.checked)}
          >
            <Text ml="2" mb="2" fontSize="xl" fontWeight="bold">
              <Tooltip label="If enabled, collects a portion of the pending rewards to a designated collector account">
                Collect tax
              </Tooltip>
            </Text>
          </Checkbox>
        </Flex>
        <Flex my="0.375em">
          <Text>Collector</Text>
          <AddressInput
            disabled={!connected || !collectTax}
            ml="auto"
            w="85%"
            onChange={(ev) => setTaxCollector(ev.target.value)}
            value={taxCollector}
          />
        </Flex>
        <Flex my="0.375em">
          <Text>Tax rate</Text>
          <Flex ml="auto" w="85%">
            <NumberInput
              w="15%"
              format={(value) => `${value}%`}
              onChange={(str, num) => setTaxRate(num)}
              value={taxRate}
              min={0}
              max={100}
              keepWithinRange={true}
              clampValueOnBlur={true}
            >
              <NumberInputField disabled={!connected || !collectTax} />
            </NumberInput>
          </Flex>
        </Flex>

        <Flex direction="column" justify="center">
          <Img h="28px" w="28px" ml="auto" mr="auto" mt="6px" src="/cfti.png" />
          <Text color="white" fontWeight="bold">
            {totalRewards.toPrecision(4)}
          </Text>
          <Button
            disabled={
              !signer || accountList.filter(web3.utils.isAddress).length <= 0
            }
            mt="1rem"
            ml="auto"
            mr="auto"
            onClick={claimRewards}
          >
            Claim rewards
          </Button>
        </Flex>
      </Box>
      {connected && (
        <Flex justify="space-between">
          <Flex ml="auto">
            <Img h="27px" mt="6px" src="/cfti.png" pr="10px" />
            <Text>
              {totalBalance.toPrecision(4)} (
              {(totalBalance + totalRewards).toPrecision(4)})
            </Text>
          </Flex>
          {/* <DeathRoll
            startingRoll={rolls.startingRoll}
            rolls={rolls.rolls}
            pending={rolls.pending}
            onClosed={clearRolls}
          /> */}
        </Flex>
      )}
    </BannerBox>
  )
}

export const DeleteIcon = createIcon({
  displayName: 'DeleteIcon',
  path: (
    <g fill="currentColor">
      <path d="M19.452 7.5H4.547a.5.5 0 00-.5.545l1.287 14.136A2 2 0 007.326 24h9.347a2 2 0 001.992-1.819L19.95 8.045a.5.5 0 00-.129-.382.5.5 0 00-.369-.163zm-9.2 13a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zm5 0a.75.75 0 01-1.5 0v-9a.75.75 0 011.5 0zM22 4h-4.75a.25.25 0 01-.25-.25V2.5A2.5 2.5 0 0014.5 0h-5A2.5 2.5 0 007 2.5v1.25a.25.25 0 01-.25.25H2a1 1 0 000 2h20a1 1 0 000-2zM9 3.75V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v1.25a.25.25 0 01-.25.25h-5.5A.25.25 0 019 3.75z" />
    </g>
  ),
})

export const PlusIcon = createIcon({
  displayName: 'PlusIcon',
  path: (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2">
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </g>
  ),
})

export default Status
