import Web3 from 'web3';

export const formatBalance = Web3.utils.fromWei;
export const toBN = Web3.utils.toBN;

export enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect'
}
