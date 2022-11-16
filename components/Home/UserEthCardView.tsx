import Button from '@mui/material/Button';
import Image from 'next/Image';
import styled from '@emotion/styled';
import { colors } from '@data/config';
import WalletModal from '@modals/WalletModal';
import { useWeb3React } from '@web3-react/core';
import { FC, useEffect, useState } from 'react';
import useActiveWeb3React from '@hooks/useActiveWeb3React';
import ItemGridOpensea from './GridOpensea';

const UserCardContainer = styled.div`
  width: 100%;
  margin-bottom: 16px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  > * + * {
    margin-left: 1rem;
  }
`;

const ConnectButton = styled(Button)<{ name: string }>`
  padding: 0.75em 1em;
  background-color: ${colors.black2};
  border: 1px ${colors.grayDark3} solid;
  border-radius: 8px;
  width: 500px;
  pointer-events: ${(p) => p.name ? 'none' : 'auto'};

  :hover {
    background-color: ${colors.black1};
    border: none;
  
    span {
      color: ${colors.white};
    }
  }
`;

const ButtonTile = styled.span<{ name: string }>`
  color: ${(p) => p.name ? colors.neutralLight2 : colors.white};
  font-family: Roboto;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.8px;
  margin-left: 16px;
`;

export type UserEthCardProps = {
  name: string;
  clickAccount: () => void;
};

export const UserEthCardView: FC<UserEthCardProps> = ({
  name,
  clickAccount,
}) => {
  const { error } = useWeb3React();

  const [isError, setIsError] = useState(false);
  const [nfts, setNfts] = useState([]);

  const handleLogin = () => {
    if (name) return;
    clickAccount();
  };

  const { account } = useActiveWeb3React(); // wallet ETH

  useEffect(() => {
    if (account) {
      fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${account}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json();
      }).then((res) => {
        setNfts(res.assets);
      });
    }
  }, [account]);

  useEffect(() => {
    if (error) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [error]);


  const contentButton = (
    <>
      <Image
        src="/images/ethereum-logo.svg"
        width="15px"
        height="24px"
        alt="ethereum-logo"
      />
      <ButtonTile name={name}>{name ? name : 'Ethereum'}</ButtonTile>
    </>
  );

  return (
    <>
      <UserCardContainer>
        <ConnectButton onClick={handleLogin} disabled={isError} name={name}>
          {contentButton}
        </ConnectButton>
      </UserCardContainer>
      <WalletModal />
      {nfts && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'space-around', maxWidth: '1200px', margin: '0 auto' }}>
          {nfts.length > 0 && nfts.map((item) => {
            return (
              <ItemGridOpensea
                key={item.id}
                nftItem={item}
              />
            )
          })}
        </div>
      )}
    </>
  );
};
