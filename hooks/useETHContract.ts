import { api, Callback, EthAsset } from '@interfaces/index';
import { getBalanceByPaymentTokenAddress } from '@utils/index';
import { getPriceString } from '@utils/getPriceString';
import { useWeb3React } from '@web3-react/core';
import { get } from 'lodash';
import { useCallback } from 'react';
import Web3 from 'web3';

declare let window: any;

type Return = {
  signBuyAsset: (asset: any, callback: Callback) => void;
  signCreateSale: (
    asset: EthAsset,
    price: string,
    callback: Callback,
    paymentTokenAddress?: string,
    expirationTime?: number
  ) => void;
  signCancelSale: (asset: EthAsset, callback: Callback) => void;
};

export const useETHContract = (): Return => {
  const { account } = useWeb3React();

  let ethereum = null;
  let Web3Client = null;

  if (typeof window !== 'undefined') {
    ethereum = window.ethereum;
    Web3Client = new Web3(ethereum);
  }

  const signBuyAsset = useCallback(
    async (asset: any, callback: Callback) => {
      const order = asset.sell_orders[0] ||  asset.sell_orders;
      const paymentTokenAddress = get(order.payment_token_contract, 'address');

      const balance = await getBalanceByPaymentTokenAddress(account, paymentTokenAddress);
      const priceNft = getPriceString({
        amount: +asset.listing_price,
        precision: +asset.token_precision
      });
      if (balance < Number(priceNft)) {
        // addMessage('Lack of balance', 'warning');
      } else {
        await api.buyAsset({
          account_address: account,
          asset_contract_address: asset.asset_contract.address,
          token_id: asset.token_id,
          provider: Web3Client?.currentProvider,
          callback
        });
      }
    },
    [account, Web3Client?.currentProvider]
  );

  const signCreateSale = useCallback(
    async (
      asset: EthAsset,
      price: string,
      callback: Callback,
      paymentTokenAddress?: string,
      expirationTime?: number
    ) => {
      await api.sellAsset({
        account_address: account,
        asset_contract_address: asset?.asset_contract?.address,
        token_id: asset?.token_id,
        price: +price,
        schema_name: asset.asset_contract.schema_name,
        payment_token_address: paymentTokenAddress,
        provider: Web3Client?.currentProvider,
        expirationTime: expirationTime,
        callback
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, Web3Client?.currentProvider]
  );

  const signCancelSale = useCallback(
    async (asset: EthAsset, callback: Callback) => {
      try {
        await api.removeListingAsset({
          account_address: account,
          asset_contract_address: asset.asset_contract.address,
          token_id: asset.token_id,
          provider: Web3Client?.currentProvider,
          callback
        });
      } catch (error) {
        throw error;
      }
    },
    [account, Web3Client?.currentProvider]
  );

  return {
    signBuyAsset,
    signCreateSale,
    signCancelSale,
  };
};
