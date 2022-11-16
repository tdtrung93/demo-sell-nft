import {
  Currency,
  ETHER ,
  Token,
  WETH,
  ChainId,
} from '@uniswap/sdk'


export function wrappedCurrency(
  currency: Currency | undefined,
  chainId: ChainId | undefined
): Token | undefined {
  if (chainId && currency === ETHER) {
    return WETH[chainId]
  }

  return currency instanceof Token ? currency : undefined
}
