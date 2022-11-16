import { NoBscProviderError } from '@binance-chain/bsc-connector';
import Modal from '@components/Modal';
import ModalHeader from '@components/ModalHeader';
import { injected } from '@connectors/index';
import { colors } from '@data/config';
import { SUPPORTED_WALLETS, WalletInfo } from '@data/supportedWallet';
import styled from '@emotion/styled';
import { ApplicationModal } from '@store/application/actions';
import { useModalOpen, useWalletModalToggle } from '@store/application/hooks';
import { WindowEthereum } from '@typings/windows';
import { switchNetwork } from '@utils/wallet-metamask';

import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from '@web3-react/walletconnect-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import React, { useEffect, useState } from 'react';

import Option from './Option';
import PendingView from './PendingView';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
`;

const HeaderModalContainer = styled(ModalHeader)`
  margin-bottom: 0;
  font-size: 20px;

  h3 {
    font-family: Roboto;
    margin-bottom: 0;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.8px;
    text-transform: none;
  }
`;

const Description = styled.div`
  font-family: Roboto;
  color: ${colors.neutralLight3};
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.8px;
`;

const ModalBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: space-between;
  overflow-y: auto;
  color: ${colors.white};
`;

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending'
};

export default function WalletModal() {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error, deactivate } = useWeb3React();

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>();

  const [pendingError, setPendingError] = useState<boolean>();

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET);

  const toggleWalletModal = useWalletModalToggle();

  // close on connection, when logged out before
  useEffect(() => {
    if (account && walletModalOpen) {
      toggleWalletModal();
    }
  }, [account, toggleWalletModal, walletModalOpen]);

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false);
      setWalletView(WALLET_VIEWS.ACCOUNT);
    }
  }, [walletModalOpen]);

  const tryActivation = async (connector: (() => Promise<AbstractConnector>) | AbstractConnector | undefined) => {
    let name = '';
    let conn = typeof connector === 'function' ? await connector() : connector;

    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name);
      }
      return true;
    });
    setPendingWallet(conn); // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING);

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (conn instanceof WalletConnectConnector) {
      conn.walletConnectProvider = undefined;
    }

    if (conn) {
      activate(conn, async (error: Error) => {
        const connChainId: string | number = await conn.getChainId();
        const networkChainId = process.env.NEXT_PUBLIC_ETH_CHAIN_ID as unknown as number;
        if (error instanceof UnsupportedChainIdError || connChainId != `0x${networkChainId.toString(16)}`) {
          const hasSetup = await switchNetwork(networkChainId);
          if (hasSetup) {
            activate(conn); // a little janky...can't use setError because the connector isn't set
          }
        } else {
          setPendingError(true);

          window.localStorage.removeItem('connectorName');
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
            console.log('Provider Error', 'No provider was found');
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector;
              walletConnector.walletConnectProvider = undefined;
            }
            console.log('Authorization Error', 'Please authorize to access your account');
          } else {
            console.log(error.name, error.message);
          }
        }
      });
    } else {
      console.log("Can't find connector", 'The connector config is wrong');
    }
  };

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    if (connector?.constructor?.name === 'FormaticConnector') {
      connector.on('OVERLAY_READY', () => {
        toggleWalletModal();
      });
    }
  }, [toggleWalletModal, connector]);

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    if (typeof window === 'undefined') {
      return null;
    }
    let Window = window as WindowEthereum;
    const isMetamask = Window.ethereum && Window.ethereum.isMetaMask;
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || Window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color="#E8831D"
                header="Install Metamask"
                subheader={null}
                link="https://metamask.io/"
                icon="/images/wallets/metamask.png"
              />
            );
          } else {
            return null; // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null;
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null;
        }
      }

      const handleClickLogin = (option: WalletInfo) => {
        window.localStorage.setItem('connectorName', option.alt);
        !option.href && tryActivation(option.connector);
      };

      // return rest of options
      return (
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector ? setWalletView(WALLET_VIEWS.ACCOUNT) : handleClickLogin(option);
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} // use option.descriptio to bring back multi-line
            icon={'/images/wallets/' + option.iconName}
          />
        )
      );
    });
  }

  return (
    <Modal
      isOpen={walletModalOpen}
      isWalletModal
      onDismiss={toggleWalletModal}
      maxWidth={329}
      minHeight={0}
      maxHeight={90}>
      <ModalContainer>
        <HeaderModalContainer title="Choose Wallet" onClose={toggleWalletModal} />
        {walletView !== WALLET_VIEWS.PENDING && <Description>Select wallet you want to connect</Description>}
        <ModalBodyContainer>
          {walletView === WALLET_VIEWS.PENDING ? (
            <PendingView
              connector={pendingWallet}
              error={pendingError}
              setPendingError={setPendingError}
              tryActivation={tryActivation}
            />
          ) : (
            <OptionsContainer>{getOptions()}</OptionsContainer>
          )}
          <button style={{ opacity: 0, bottom: 0 }} />
        </ModalBodyContainer>
      </ModalContainer>
    </Modal>
  );
}
