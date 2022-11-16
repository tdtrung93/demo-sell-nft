import { NetworkContextName } from '@data/config';
import { createWeb3ReactRoot } from '@web3-react/core';

function Web3ProviderNetwork({ children, getLibrary }) {
  try {
    const Web3ReactRoot = createWeb3ReactRoot(NetworkContextName);
    return <Web3ReactRoot getLibrary={getLibrary}>{children}</Web3ReactRoot>;
  } catch (error) {
    return <>{children}</>;
  }
}

export default Web3ProviderNetwork;
