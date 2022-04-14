import {
  Text,
  Box,
  Button,
  Img,
  Flex,
  Tooltip,
  useToast,
  Table,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
  IconButton,
  createIcon,
  Input,
  NumberInput,
  NumberInputField,
  Checkbox,
} from '@chakra-ui/react'
import BannerBox from '../Global/BannerBox'
import { useEthers, useNetwork, useTokenBalance } from '@usedapp/core'
import { TOKEN_ADDRESS } from '../../constants'
import { useState, useEffect, useCallback } from 'react'

import { logEvent } from '../../utils'
import { useSigner } from '../../hooks'
import { ApproveCfti } from '../ApproveCfti'
import { AddressInput } from '../AddressInput'

type StatusProps = {
  connected: any
}

const Status = ({ connected }: StatusProps) => {
  const {
    network: { provider, chainId, accounts, errors },
    deactivate,
    activate,
  } = useNetwork()
  const [accountList, setAccountList] = useState<string[]>([])
  console.log({ accountList: JSON.stringify(accountList) })

  const [accumulateEnabled, enableAccumulate] = useState(false)
  const [collectTaxEnabled, enableCollectTax] = useState(false)
  console.log({ accumulateEnabled })

  const balance = useTokenBalance(TOKEN_ADDRESS['CFTI'], accounts[0])

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

  const handleChange = useCallback(
    (e: any) =>
      setAccountList((list) => {
        console.log({ target: e.target })
        const idx = Number(e.target.id.replace('account-', ''))
        console.log({
          idx,
          prev: list.slice(0, idx),
          val: e.target.value,
          after: list.slice(idx + 1),
        })

        return [...list.slice(0, idx), e.target.value, ...list.slice(idx + 1)]
      }),
    []
  )
  const removeItem = useCallback(
    (idx: any) =>
      setAccountList((list) => {
        return [...list.slice(0, idx), ...list.slice(idx + 1)]
      }),
    []
  )

  const signer = useSigner()

  return (
    <BannerBox heading="Accounts">
      <Box p="16px" textAlign="center">
        {!connected && (
          <Text fontSize="xx-large" mb="20px" color="white">
            Not connected
          </Text>
        )}

        <Table mb="0.6em">
          <Thead>
            <Tr>
              <Th w="32rem">Address</Th>
              <Tooltip label="Whether a given address has approved this contract to transfer $CFTI">
                <Th>Approved</Th>
              </Tooltip>
              <Tooltip label="Whether a given address has authorized the selected Controller account to move $CFTI on their behalf">
                <Th>Authorized</Th>
              </Tooltip>
              <Th>Pending</Th>
              <Th>
                <IconButton
                  disabled={!connected}
                  size="sm"
                  aria-label="Create"
                  icon={<PlusIcon />}
                  onClick={() => setAccountList((old) => [...old, ''])}
                />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.from(accountList.values())
              .map((element) => {
                console.log('inspect - ' + element)
                return element
              })
              .map((acc, idx) => {
                return (
                  <Tr key={idx}>
                    <Td w="32rem">
                      <AddressInput
                        id={`account-${idx}`}
                        onChange={handleChange}
                        value={acc}
                      />
                    </Td>
                    <Td>
                      <ApproveCfti owner={acc} />
                    </Td>
                    <Td>TODO</Td>
                    <Td>
                      <Flex justifyContent={'space-around'}>
                        <Text>fds</Text>
                        <Img src="/cfti.png" />
                      </Flex>
                    </Td>
                    <Td>
                      <IconButton
                        disabled={!connected}
                        size="sm"
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => removeItem(idx)}
                      />
                    </Td>
                  </Tr>
                )
              })}
            <Tr></Tr>
          </Tbody>
        </Table>
        <Flex my="0.375em">
          <Tooltip label="The account that is authorized by the above addresses to move their $CFTI tokens">
            <Text>Controller</Text>
          </Tooltip>
          <AddressInput disabled ml="auto" w="85%" value={accounts[0]} />
        </Flex>
        <Flex>
          <Checkbox
            size="lg"
            disabled={!connected}
            checked={accumulateEnabled}
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
            disabled={!connected || !accumulateEnabled}
            ml="auto"
            w="85%"
          />
        </Flex>
        <Flex>
          <Checkbox
            size="lg"
            disabled={!connected}
            checked={collectTaxEnabled}
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
            disabled={!connected || !collectTaxEnabled}
            ml="auto"
            w="85%"
          />
        </Flex>
        <Flex my="0.375em">
          <Text>Tax rate</Text>
          <Flex ml="auto" w="85%">
            <NumberInput
              w="15%"
              format={(value) => `${value}%`}
              defaultValue={3}
              min={0}
              max={100}
              keepWithinRange={true}
              clampValueOnBlur={true}
            >
              <NumberInputField disabled={!connected || !collectTaxEnabled} />
            </NumberInput>
          </Flex>
        </Flex>
        <Button mt="1rem">Claim rewards</Button>
      </Box>
      {connected && (
        <Flex justify="space-between">
          <Flex ml="auto">
            <Img h="27px" mt="6px" src="/cfti.png" pr="10px" />
            <Text>
              {isNaN(Number(balance))
                ? '...'
                : `${(Number(balance) / 10 ** 18).toPrecision(4)}`}
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
