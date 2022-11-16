import { useETHUser } from '@hooks/useEthUser';
import { UserEthType } from '@typings/UserEthType';
import React, { PropsWithChildren, ReactElement, useContext } from 'react';

export type GlobalContextType = {
  userETH?: UserEthType;
};

const GlobalContext = React.createContext<GlobalContextType>({});

export const useGlobalContext = (): GlobalContextType => useContext(GlobalContext);

export const GlobalProvider = ({
  children
}: PropsWithChildren<{
  code?: string;
  scope?: string;
}>): ReactElement => {
  const userETH = useETHUser();

  return (
    <GlobalContext.Provider
      value={{ userETH }}>
      {children}
    </GlobalContext.Provider>
  );
};
