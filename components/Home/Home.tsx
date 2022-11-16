import { useWalletModalToggle } from '@store/application/hooks';
import { useWeb3React } from '@web3-react/core';
import { createElement, FC } from 'react';

import { UserEthCardProps, UserEthCardView } from './UserEthCardView';

export const Home: FC = () => {
  const { account } = useWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  const props: UserEthCardProps = {
    name: account,
    clickAccount: toggleWalletModal,
  };

  return createElement(UserEthCardView, props);
};
