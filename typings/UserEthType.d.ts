import { AccountType } from '@/layer';
import { CurrencyAmount } from '@types/CurrencyAmount';
import { ConnectorNames } from '@utils/web3React';
import Web3 from 'web3';

export type UserEthType = {
  isLoggedIn: boolean;
  signTransaction?: (transactions: { actions: unknown[] }) => Promise<{
    status: string;
    transactionId: string;
    error?: Error;
  }>;
  login: (() => void) | ((inConnector?: ConnectorNames) => void);
  logout: (() => void) | (() => Promise<void>);
  accountName: string;
  balance: CurrencyAmount;
  getAccountName: (() => Promise<string>) | (() => string);
  accountEthAddress: string;
  error?: Error;
  provider?: Web3;
  pureBalance?: number;
  formattedAccount?: string;
  formattedBalance?: string;
  isBalanceLoading?: boolean;
  profilePictureIpfsHash?: string;
  accountType: AccountType;
};
