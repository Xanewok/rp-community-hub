import { Contract } from '@ethersproject/contracts'

import { ChainId, ERC20, useNetwork } from '@usedapp/core'
import RaffleParty from '../../../build/contracts/RaffleParty.json'
import RpSeeder from '../../../build/contracts/RpSeeder.json'
import IConfetti from '../../../build/contracts/IConfetti.json'
import ConfettiRoll from '../../../build/contracts/ConfettiRoll.json'
import RpYieldCollector from '../../../build/contracts/RpYieldCollector.json'
import TestParty from '../../../build/contracts/TestParty.json'
import TestRaid from '../../../build/contracts/TestRaid.json'
import { useMemo } from 'react'

type KnownContracts =
  | 'Confetti'
  | 'Party'
  | 'Raid'
  | 'RpSeeder'
  | 'RaffleParty'
  | 'ConfettiRoll'
  | 'RpYieldCollector'

export const CONTRACT_ABI = {
  Confetti: IConfetti.abi,
  Party: TestParty.abi,
  Raid: TestRaid.abi,
  RpSeeder: RpSeeder.abi,
  RaffleParty: RaffleParty.abi,
  ConfettiRoll: ConfettiRoll.abi,
  RpYieldCollector: RpYieldCollector.abi,
} as const

export const CONTRACT_ADDRESS = {
  [ChainId.Mainnet]: {
    Confetti: '0xCfef8857E9C80e3440A823971420F7Fa5F62f020',
    Party: '0xd311bDACB151b72BddFEE9cBdC414Af22a5E38dc',
    Raid: '0xFa209a705a4DA0A240AA355c889ed0995154D7Eb',
    RpSeeder: '0x2ed251752da7f24f33cfbd38438748bb8eeb44e1',
    RaffleParty: '0xd3babf32a741b03e5c72a3def7961cb6f43746e7',
    ConfettiRoll: '0x1fAaC523223fBf79667ab621653bd378093E8693',
    RpYieldCollector: '0xecd1c195192782Cd7c343aD8171C183aC93277D6',
  },
  [ChainId.Rinkeby]: {
    Confetti: '0x0B4f94A0a8ad26F3f151AC581ac7156eB04Ab61C',
    Party: '0x5749066892804Dc9cD8049bd8290EA62C9b711E8',
    Raid: '0x03570874f6137509916D86002Fa68AcCe3DDcC60',
    RpSeeder: '0x1E69143e45906D0240d7Ad214B866A2A3f9A239f',
    RaffleParty: '0xC0325482668d71f25f35D7f032aeA83c616176Bb',
    ConfettiRoll: '0x1fAaC523223fBf79667ab621653bd378093E8693',
    RpYieldCollector: '0x5027d32D205681A4e3374903A11ffEeC5e5e3402',
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
        Raid: { address: null },
        RpSeeder: { address: null },
        RaffleParty: { address: null },
        ConfettiRoll: { address: '' },
        RpYieldCollector: { address: '' },
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
