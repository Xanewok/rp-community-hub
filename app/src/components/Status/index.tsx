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
import { useState, useEffect, useCallback, useMemo } from 'react'
import web3 from 'web3'

import { logEvent } from '../../utils'
import { useLocalStorage, useSigner } from '../../hooks'
import { AddressInput } from '../AddressInput'
import { AccountList } from '../AccountTable'
import { useMultiplePendingRewards } from '../../hooks/usePendingRewards'
import { usePartyDamages } from '../../hooks/usePartyDamage'
import { ClaimButton } from '../ClaimButton'

type StatusProps = {
  connected: any
}

const Status = ({ connected }: StatusProps) => {
  const {
    network: { accounts },
  } = useNetwork()
  const [accountList, setAccountList] = useLocalStorage<string[]>('accs', [])

  const [accumulate, enableAccumulate] = useState(false)
  const [stash, setStash] = useState('')
  const [collectTax, enableCollectTax] = useState(false)
  const [taxCollector, setTaxCollector] = useState('')
  const [taxRate, setTaxRate] = useState(0)
  const [operator, setOperator] = useState('')

  const signer = useSigner()

  const damages = usePartyDamages(accountList)
  // https://docs.google.com/spreadsheets/d/1RScZkbKErwh66JJGFi9LJZdJlJBWpmOJgdivg_QlFYI
  // Under "Yield calculator" sheet - based on bosses' spawn rate and rewards
  const totalExpectedYield = useMemo(
    () =>
      Math.round(
        damages
          .map((value) => value / 650)
          .reduce((prev, curr) => prev + curr, 0) * 100
      ) / 100,
    [damages]
  )
  // TODO: Abstract that away
  const totalRewards =
    (Number(useMultiplePendingRewards(accountList || [])) || 0) / 10 ** 18
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

  return (
    <BannerBox heading="Batch claim">
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
              isInvalid={
                (accumulate || collectTax) && !web3.utils.isAddress(operator)
              }
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
            isDisabled={!connected}
            isChecked={accumulate}
            onChange={({ target }) => enableAccumulate(target.checked)}
          >
            <Text ml="2" mb="2" fontSize="xl" fontWeight="bold">
              <Tooltip label="If enabled, moves all of the pending rewards to a designated stash account">
                Accumulate
              </Tooltip>
            </Text>
          </Checkbox>
        </Flex>
        <Tooltip label="The account that will receive all of the claimed rewards">
          <Flex my="0.375em">
            <Text>Stash</Text>
            <AddressInput
              isDisabled={!connected || !accumulate}
              ml="auto"
              w="85%"
              onChange={(ev) => setStash(ev.target.value)}
              value={stash}
              isRequired={accumulate}
              isInvalid={accumulate && !web3.utils.isAddress(stash)}
            />
          </Flex>
        </Tooltip>

        <Flex>
          <Checkbox
            size="lg"
            isDisabled={!connected}
            isChecked={collectTax}
            onChange={({ target }) => enableCollectTax(target.checked)}
          >
            <Text ml="2" mb="2" fontSize="xl" fontWeight="bold">
              <Tooltip label="If enabled, collects a portion of the pending rewards to a designated collector account">
                Collect tax
              </Tooltip>
            </Text>
          </Checkbox>
        </Flex>
        <Tooltip label="The account that will receive a portion (tax) of all of the claimed rewards">
          <Flex my="0.375em">
            <Text>Collector</Text>
            <AddressInput
              isDisabled={!connected || !collectTax}
              ml="auto"
              w="85%"
              onChange={(ev) => setTaxCollector(ev.target.value)}
              value={taxCollector}
              isRequired={collectTax}
              isInvalid={collectTax && !web3.utils.isAddress(stash)}
            />
          </Flex>
        </Tooltip>
        <Tooltip label="How much of all of the claimed rewards will be sent to the Collector account">
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
        </Tooltip>

        <Flex direction="column" justify="center">
          <Img h="28px" w="28px" ml="auto" mr="auto" mt="6px" src="/cfti.png" />
          <Tooltip
            bg="transparent"
            label={<Img src="/cftirain.gif" alt="cftirain" />}
          >
            <Text color="white" fontWeight="bold">
              {totalRewards.toPrecision(4)}
            </Text>
          </Tooltip>
          <ClaimButton
            accountList={accountList}
            operator={operator}
            accumulate={{ accumulate, stash }}
            tax={{ collectTax, taxCollector, taxRate }}
          />
        </Flex>
      </Box>
      {connected && (
        <Flex justify="space-between">
          <Tooltip label="Total expected daily rewards">
            <Flex>
              <Img h="27px" ml="4px" mt="6px" src="/cfti.png" pr="10px" />
              <Text>~ {totalExpectedYield} /day</Text>
            </Flex>
          </Tooltip>
          <Tooltip
            label={
              <>
                <Text>{`Total balance: ${totalBalance.toPrecision(4)}`}</Text>
                <Text>{`Total balance with
                rewards: ${(totalBalance + totalRewards).toPrecision(
                  4
                )}`}</Text>
              </>
            }
          >
            <Flex>
              <Img h="27px" mt="6px" src="/cfti.png" pr="10px" />
              <Text>
                {totalBalance.toPrecision(4)} (
                {(totalBalance + totalRewards).toPrecision(4)})
              </Text>
            </Flex>
          </Tooltip>
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
