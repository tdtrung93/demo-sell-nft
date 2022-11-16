export interface WindowChain {
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => void;
  };
}

export const switchNetwork = async (networkId: number) => {
  const provider = (window as WindowChain).ethereum;
  if (provider) {
    try {
      await provider.request?.({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${networkId.toString(16)}`
          }
        ]
      });

      return true;
    } catch (error) {
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};
