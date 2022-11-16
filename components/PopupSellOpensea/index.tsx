import Image from '@components/Core/Image';
import Modal from '@components/Core/Modal';
import Svg from '@components/Core/Svg';
import OpenseaPrice from '@components/Price';
import { useETHContract } from '@hooks/useETHContract';
import { OpenSeaFungibleToken } from '@interfaces/services/openSeaTypes';
import { CircularProgress } from '@mui/material';
import { useAppDispatch } from '@store/hooks';
import { nftActions } from '@store/slices/nft';
import { configActions, selectPaymentTokensOpensea } from '@store/slices/config';
import { getImageUrl } from '@utils/images';
import { useWeb3React } from '@web3-react/core';
import cx from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDuration } from 'utils/index';
import Web3 from 'web3';

import styles from './index.module.scss';

interface Props {
  open: boolean;
  nftItem: any;
  handleClose?: (success: boolean) => void;
  isOwner: boolean;
}

const PopupSellOpensea = ({ open, nftItem, isOwner, ...props }: Props) => {
  // sell ETH
  const { signCreateSale: signCreateSaleContract } = useETHContract();
  const { account } = useWeb3React();
  const payment_tokens = useSelector(selectPaymentTokensOpensea);
  const [listingPrice, setListingPrice] = useState<string>('0');
  const [token, setToken] = useState<OpenSeaFungibleToken>();
  const dispatch = useAppDispatch();
  const options = getDuration();

  const [expirationTime, setExpirationTime] = useState(options.find((duration) => duration.value === 7));

  const [isSigning, setIsSigning] = useState(false);

  const onSelectChange = (token: OpenSeaFungibleToken) => {
    setToken(token);
  };

  const onChangeExpirationTime = (time: any) => {
    setExpirationTime(time);
  };

  const onInputChange = (listingPrice: string) => {
    setListingPrice(listingPrice);
  };

  useEffect(() => {
    try {
      dispatch(
        configActions.getPaymentTokensByNftOpenseaRequest(`${nftItem.asset_contract.address}/${nftItem.token_id}`)
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (payment_tokens.length > 0) {
      setToken(payment_tokens[0]);
    }
  }, [payment_tokens]);

  const signCreateSale = useCallback(async () => {
    setIsSigning(true);
    const timeExpiration = Math.round(Date.now() / 1000 + expirationTime.value * 60 * 60 * 24);
    signCreateSaleContract(
      nftItem,
      listingPrice,
      (e: Error) => {
        setIsSigning(false);
        if (!e) {
          dispatch(
            nftActions.setTransactionNftIdSuccess({
              wallet_type: 'ETH',
              id: nftItem.id,
              type: 'sell',
              listing_price: Number(Web3.utils.toWei(listingPrice)),
              usd_rate: 0.1,
              listing_symbol: 'ETH',
              sell_orders: { cancelled: false }
            })
          );
        }
      },
      token?.address,
      timeExpiration
    );
  }, [
    account,
    dispatch,
    expirationTime.value,
    listingPrice,
    nftItem,
    signCreateSaleContract,
    token,
  ]);

  return (
    <Modal open={open} {...props} isBtnClose>
      <div className={styles.container}>
        <Image
          src={getImageUrl(nftItem.image_url)}
          className={styles.img}
          alt={nftItem.name}
          layout="responsive"
          width={1}
          height={1}
          priority
          objectFit="contain"
          loading="eager"
        />
        <div className={styles.right}>
          <p className={styles.heading}>List NFT</p>
          <OpenseaPrice
            nftItem={nftItem}
            isOwner={isOwner}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
            onChangeExpirationTime={onChangeExpirationTime}
          />

          <button
            className={cx(styles.button, {
              [styles.buttonDisabled]: listingPrice === '0' || !listingPrice || isSigning
            })}
            disabled={listingPrice === '0'}
            onClick={signCreateSale}>
            {isSigning && <CircularProgress color="secondary" className={styles.circleProgress} size="20" />}
            <Svg name="opensea" className={styles.iconOpensea} />
            LIST ON OPENSEA
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PopupSellOpensea;
