import { Contract } from '@ethersproject/contracts'

import { ERC20 } from '@usedapp/core'
import RpYieldCollector from '../../../build/contracts/RpYieldCollector.json'
import ISeederV2 from '../../../build/contracts/ISeederV2.json'
import IRaid from '../../../build/contracts/IRaid.json'

export const TOKEN_ADDRESS = {
  CFTI: '0xCfef8857E9C80e3440A823971420F7Fa5F62f020',
  RAID: '0xFa209a705a4DA0A240AA355c889ed0995154D7Eb',
  SEEDER: '0x2ed251752da7f24f33cfbd38438748bb8eeb44e1',
  COLLECTOR: '0xecd1c195192782Cd7c343aD8171C183aC93277D6',
}

export const CONFETTI_CONTRACT = new Contract(TOKEN_ADDRESS['CFTI'], ERC20.abi)


export const COLLECTOR_CONTRACT = new Contract(
  TOKEN_ADDRESS['COLLECTOR'],
  RpYieldCollector.abi
)

export const RAID_CONTRACT = new Contract(TOKEN_ADDRESS['RAID'], IRaid.abi)

export const SEEDERV2_CONTRACT = new Contract(
  TOKEN_ADDRESS['SEEDER'],
  ISeederV2.abi
)
