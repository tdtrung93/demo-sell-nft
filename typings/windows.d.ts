export interface WindowEthereum {
  ethereum?: {
    isMetaMask?: true;
    request?: (...args: any[]) => void;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
  };
}
