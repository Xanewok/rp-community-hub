export const HeroUriHandlerAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getStats',
    outputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'dmgMultiplier',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'partySize',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'enhancement',
            type: 'uint8',
          },
        ],
        internalType: 'struct Stats.HeroStats',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

export const FighterUriHandlerAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getStats',
    outputs: [
      {
        components: [
          {
            internalType: 'uint32',
            name: 'dmg',
            type: 'uint32',
          },
          {
            internalType: 'uint8',
            name: 'enhancement',
            type: 'uint8',
          },
        ],
        internalType: 'struct Stats.FighterStats',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
