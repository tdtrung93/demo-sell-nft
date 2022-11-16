import { ETHER_NETWORKS_NAMES } from '@interfaces/constants/ether';
import { UserEthType } from '@typings/UserEthType';
import { formatEthAddress } from '@utils/formatters';
import { formatBalance, toBN } from '@utils/web3React';
import { useWeb3React as useWeb3ReactLib } from '@web3-react/core';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { useState, useCallback, useEffect } from 'react';

type CurrencyAmount = {
  amount: number;
  currency: string;
  precision: number;
};

export const useETHUser = (): UserEthType => {
  const { library, connector, account, deactivate, error } = useWeb3ReactLib();
  const router = useRouter();
  const [balance, setBalance] = useState<CurrencyAmount>();
  const [accountType, setAccountType] = useState<Extract<UserEthType['accountType'], 'metamask' | 'walletConnect'>>();
  const [pureBalance, setPureBalance] = useState<number>();
  const [formattedBalance, setFormattedBalance] = useState<string>();
  const [formattedAccount, setFormattedAccount] = useState<string>('');
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);

  const [accountName, setAccountName] = useState<string>();
  const [activeUser, setActiveUser] = useState<Boolean>(false);
  const [activeSigner, setActiveSigner] = useState<ethers.providers.JsonRpcSigner>();

  const signTransaction = useCallback(async () => account && library?.eth.signTransaction(account), [account, library]);

  useEffect(() => {
    setFormattedAccount(formatEthAddress(account));
  }, [account]);
  const login = useCallback(async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.enable();

        const provider = new ethers.providers.Web3Provider((window as any).ethereum, 'any');
        const providerNetwork = await provider.getNetwork();

        const network = ETHER_NETWORKS_NAMES[process.env.NEXT_PUBLIC_ETH_CHAIN_ID];

        const properProvider = new ethers.providers.EtherscanProvider(network);
        const properNetwork = await properProvider.getNetwork();

        if (providerNetwork.chainId !== properNetwork.chainId) {
          await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${properNetwork.chainId.toString(16)}` }]);
        }

        const acceptConnection = await provider.send('eth_requestAccounts', []);

        if (acceptConnection) {
          const signer = provider.getSigner();

          const name = await signer.getAddress();

          if (name) {
            setActiveSigner(signer);
            setAccountName(name);
            setActiveUser(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Metamask extensions not detected!');
    }
  }, []);

  useEffect(() => {
    if (balance?.amount) {
      const formatedBalance = formatBalance(toBN(balance?.amount));
      setPureBalance(balance?.amount);
      setFormattedBalance(formatedBalance);
    }
  }, [balance]);

  /*
   * Get Account Type
   * */
  const getAccountType = useCallback(() => {
    if (!localStorage) {
      return;
    }

    const localAuthType = localStorage.getItem('connectedWalletV2');

    switch (localAuthType) {
      case 'injected':
        setAccountType('metamask');
        break;
      case 'walletconnect':
        setAccountType('walletConnect');
        break;
      default:
        setAccountType(undefined);
    }
  }, []);

  useEffect(() => {
    if (account) {
      getAccountType();
    } else {
      setAccountType(null);
    }
  }, [account, getAccountType]);

  const handleLogout = useCallback(() => {
    if ((connector as any).close) {
      (connector as any).close();
    }
    deactivate();
    sessionStorage.removeItem('connectorName');
  }, [deactivate, connector]);

  useEffect(() => {
    if (accountName) {
      getAccountType();
    } else {
      setAccountType(null);
    }
  }, [accountName, getAccountType]);

  const getAccountName = useCallback(async () => {
    if (!activeUser) return;

    if (accountName) return accountName;

    const name = activeSigner._address;
    setAccountName(name);

    return name;
  }, [accountName, activeUser, activeSigner?._address]);

  useEffect(() => {
    getAccountName();
  }, [getAccountName]);

  return {
    isLoggedIn: !!account,
    signTransaction,
    login,
    logout: handleLogout,
    accountName: account,
    balance,
    pureBalance,
    provider: library,
    getAccountName: () => account,
    accountEthAddress: account,
    error,
    formattedAccount,
    formattedBalance,
    isBalanceLoading,
    accountType
  };
};
