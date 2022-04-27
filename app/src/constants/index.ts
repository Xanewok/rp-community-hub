import { Contract } from '@ethersproject/contracts'

import { ChainId, ERC20, useNetwork } from '@usedapp/core'
import RaffleParty from '../../../build/contracts/RaffleParty.json'
import ISeederV2 from '../../../build/contracts/ISeederV2.json'
import IParty from '../../../build/contracts/IParty.json'
import { useMemo } from 'react'

type KnownContracts = 'Confetti' | 'Party' | 'SeederV2' | 'RaffleParty'

const CONTRACT_ABI = {
  Confetti: ERC20.abi,
  Party: IParty.abi,
  SeederV2: ISeederV2.abi,
  RaffleParty: RaffleParty.abi,
} as const

const CONTRACT_ADDRESS = {
  [ChainId.Mainnet]: {
    Confetti: '0xCfef8857E9C80e3440A823971420F7Fa5F62f020',
    Party: '0xd311bDACB151b72BddFEE9cBdC414Af22a5E38dc',
    SeederV2: '0x2ed251752da7f24f33cfbd38438748bb8eeb44e1',
    RaffleParty: '0x0000000000000000000000000000000000000000',
  },
  [ChainId.Rinkeby]: {
    Confetti: '0x0B4f94A0a8ad26F3f151AC581ac7156eB04Ab61C',
    Party: '0x5749066892804Dc9cD8049bd8290EA62C9b711E8',
    SeederV2: '0xb9a8667C46Ffc9f1eD6e334Af76fcc8b58dD5Bb3',
    RaffleParty: '0xB2DAa2fF1f58E1aF2499F65AEfaefb9484C48F34',
  },
} as const

export function useContracts(): Record<KnownContracts, Contract> {
  const {
    network: { chainId },
  } = useNetwork()
  const contracts = useMemo(() => {
    if (chainId !== ChainId.Mainnet && chainId !== ChainId.Rinkeby) {
      // Needed for initial static site generation when the chain is undefined
      return {
        Confetti: { address: null },
        Party: { address: null },
        SeederV2: { address: null },
        RaffleParty: { address: null },
      }
    } else {
      const addresses = CONTRACT_ADDRESS[chainId]
      return Object.fromEntries(
        Object.entries(addresses).map(([k, v]) => [
          k,
          new Contract(v, CONTRACT_ABI[k as KnownContracts]),
        ])
      )
    }
  }, [chainId])
  return contracts as { [C in KnownContracts]: Contract }
}
