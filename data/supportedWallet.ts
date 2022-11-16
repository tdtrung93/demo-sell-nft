import { injected } from '@connectors/index';
import { ConnectorNames } from '@utils/web3React';
import { AbstractConnector } from '@web3-react/abstract-connector';

export interface WalletInfo {
  connector?: (() => Promise<AbstractConnector>) | AbstractConnector;
  name: string;
  alt: string;
  iconName: string;
  src: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  connectorId?: ConnectorNames;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    alt: 'MetaMask',
    iconName: 'metamask.svg',
    src: '/images/wallets/metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
};
