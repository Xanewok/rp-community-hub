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
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { CONFETTI_CONTRACT, RAID_CONTRACT } from '../../constants'
import { AddressInput } from '../AddressInput'
import { ApproveCfti } from '../ApproveCfti'
import { AuthorizeOperator } from '../AuthorizeOperator'
import { PendingRewards } from '../PendingRewards'
import web3 from 'web3'

export const AccountList = (props: {
  accountList: string[]
  setAccountList: Dispatch<SetStateAction<string[]>>
  operator: string
}) => {
  const { accountList, setAccountList, operator } = props

  const { library, account } = useEthers()

  const handleChange = useCallback(
    (e: any) =>
      setAccountList((list) => {
        const idx = Number(e.target.id.replace('account-', ''))
        return [...list.slice(0, idx), e.target.value, ...list.slice(idx + 1)]
      }),
    [setAccountList]
  )
  const removeItem = useCallback(
    (idx: any) =>
      setAccountList((list) => {
        return [...list.slice(0, idx), ...list.slice(idx + 1)]
      }),
    [setAccountList]
  )

  const [totalTokens, setTotalTokens] = useState<[number, number]>([0, 0])
  function formatTotalTokens(tokens: [number, number]) {
    const [balance, rewards] = tokens.map((x) => x / 10 ** 18)
    const sum = balance + rewards
    return `${balance.toPrecision(4)} + ${rewards.toPrecision(4)} (${Math.floor(
      sum
    )})`
  }
  useEffect(() => {
    const signer = library?.getSigner()
    if (!signer) {
      return
    }
    const confetti = CONFETTI_CONTRACT.connect(signer)
    const raid = RAID_CONTRACT.connect(signer)
    Promise.all(
      accountList
        .filter((x) => !!x)
        .filter(web3.utils.isAddress)
        .map((acc) =>
          Promise.all([confetti.balanceOf(acc), raid.getPendingRewards(acc)])
        )
    ).then((data) => {
      const totalBalance = data
        .map(([balance]) => balance)
        .reduce((prev, curr) => prev + Number(curr), 0)
      const totalPending = data
        .map(([, pending]) => pending)
        .reduce((prev, curr) => prev + Number(curr), 0)
      console.log({ totalBalance, totalPending })
      setTotalTokens([totalBalance, totalPending])
    })
  }, [library, accountList])

  return (
    <Table mb="0.6em">
      <Thead>
        <Tr>
          <Th w="32rem">Address</Th>
          <Tooltip label="Whether a given address has approved this contract to transfer $CFTI">
            <Th>Approved</Th>
          </Tooltip>
          <Tooltip label="Whether a given address has authorized the selected Operator account to move $CFTI on their behalf">
            <Th>Authorized</Th>
          </Tooltip>
          <Th>Balance + Yield</Th>
          <Th>
            <IconButton
              disabled={!account}
              size="sm"
              aria-label="Create"
              icon={<PlusIcon />}
              onClick={() => setAccountList((old) => [...old, ''])}
            />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {accountList.map((acc, idx) => {
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
              <Td>
                <AuthorizeOperator owner={acc} operator={operator} />
              </Td>
              <Td>
                <PendingRewards owner={acc} />
              </Td>
              <Td>
                <IconButton
                  disabled={!account}
                  size="sm"
                  aria-label="Delete"
                  icon={<DeleteIcon />}
                  onClick={() => removeItem(idx)}
                />
              </Td>
            </Tr>
          )
        })}
        {accountList.filter((x) => !!x).filter(web3.utils.isAddress).length >
          0 && (
          <Tr key="sum">
            <Td />
            <Td />
            <Td />
            <Td>
              <Text fontSize="xs">Total: {formatTotalTokens(totalTokens)}</Text>
            </Td>
            <Td />
          </Tr>
        )}
        <Tr></Tr>
      </Tbody>
    </Table>
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
