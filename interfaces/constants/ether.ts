export const ETHER_NETWORK = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42
} as const;

export const ETHER_NETWORKS_NAMES = {
  [ETHER_NETWORK.MAINNET]: 'main',
  [ETHER_NETWORK.RINKEBY]: 'rinkeby',
  [ETHER_NETWORK.GOERLI]: 'goerli'
} as const;
