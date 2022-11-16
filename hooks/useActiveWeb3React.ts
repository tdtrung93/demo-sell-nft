import { NetworkContextName } from '@data/config';
import { ChainId } from '@typings/ChainId';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { ethers } from 'ethers';

export function useActiveWeb3React(): Web3ReactContextInterface<ethers.providers.Web3Provider> & {
  chainId?: ChainId;
} {
  // replace with address to impersonate
  const impersonate = false;
  const context = useWeb3ReactCore<ethers.providers.Web3Provider>();
  const contextNetwork = useWeb3ReactCore<ethers.providers.Web3Provider>(NetworkContextName);
  return context.active
    ? { ...context, account: impersonate || context.account }
    : { ...contextNetwork, account: impersonate || contextNetwork.account };
}

export default useActiveWeb3React;
