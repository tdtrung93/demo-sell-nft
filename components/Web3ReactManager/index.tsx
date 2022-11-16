import { network } from '@connectors/index';
import { NetworkContextName } from '@data/config';
import useAutoConnect from '@hooks/useAutoConnect';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState } from 'react';

import useInactiveListener from '../../hooks/useInactiveListener';

export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  const { active } = useWeb3React();
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedAutoConnect = useAutoConnect();

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedAutoConnect);

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    return <div>Oops! An unknown error occurred. Please refresh the page, or visit from another browser or device</div>;
  }

  return <>{children}</>;
}
