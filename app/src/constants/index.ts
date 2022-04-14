import { Contract } from '@ethersproject/contracts'

import { ERC20 } from '@usedapp/core'
import RpYieldCollector from '../../../build/contracts/RpYieldCollector.json'
import ISeederV2 from '../../../build/contracts/ISeederV2.json'
import IRaid from '../../../build/contracts/IRaid.json'

export const TOKEN_ADDRESS = {
  CFTI: '0x9BEfb9f109ac064e4A3E629528525d3474fcF2c1',
  RAID: '0x03570874f6137509916D86002Fa68AcCe3DDcC60',
  SEEDER: '0xf34b97eAAa9cE5f9DC9F0A146cB4b2969Ee82FB8',
  COLLECTOR: '0x5027d32D205681A4e3374903A11ffEeC5e5e3402',
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
