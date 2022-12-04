import { api, Callback, EthAsset } from '@interfaces/index';
import { getBalanceByPaymentTokenAddress } from '@utils/index';
import { getPriceString } from '@utils/getPriceString';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { get } from 'lodash';
import { useCallback } from 'react';
import Web3 from 'web3';
import { EIP_712_ORDER_TYPE } from '@interfaces/constants/ether';

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

const calculatePrices = (listing_price) => {
  try {
    const opensea_fee = (listing_price * 0.025).toFixed(18)
    const royalty_fee = (listing_price / (1/(10 / 100 / 100))).toFixed(18) // 100 cause percent comes in *100
    const listing_profit = ethers.utils.parseEther(String((+listing_price - +opensea_fee - +royalty_fee).toFixed(18)))
    return {
      listing_profit: listing_profit.toString(),
      royalty_fee: ethers.utils.parseEther(String(royalty_fee)).toString(),
      opensea_fee: ethers.utils.parseEther(String(opensea_fee)).toString()
    }
  }
  catch (error) {
      alert("Error: Listing Price")
      console.log(error)
      return -1
  }
}

export const useETHContract = (): Return => {
  const { account, library } = useWeb3React();

  let ethereum = null;
  let Web3Client = null;

  if (typeof window !== 'undefined') {
    ethereum = window.ethereum;
    Web3Client = new Web3(ethereum);
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  
  const _getSigner = (accountAddress: string) => {
    return provider.getSigner(accountAddress);
  }

  const signOrder = async (orderParameters, accountAddress) => {
    const signer = _getSigner(accountAddress);
    const { chainId } = await provider.getNetwork();

    const domainData = {
      name: "Seaport",
      version: "1.1",
      chainId,
      verifyingContract: "0x00000000006c3852cbef3e08e8df289169ede581"
    };

    const orderComponents = {...orderParameters, counter: 0};

    const signature = await signer._signTypedData(
      domainData,
      EIP_712_ORDER_TYPE,
      orderComponents
    );
    return ethers.utils.splitSignature(signature).compact;
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
      const salt = ethers.utils.solidityKeccak256(
        ['string'],
        [`${Date.now().toString()}${account}`],
      );
      const prices = calculatePrices(price);
      if (prices === -1) return;
      const parameters = {
        offerer: account,
        zone: "0x0000000000000000000000000000000000000000",
        zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        startTime: Math.floor(new Date().getTime() / 1000),
        endTime: 1671369317,
        orderType: 0,
        offer: [
          {
            itemType: 2,
            token: asset?.asset_contract?.address,
            identifierOrCriteria: asset?.token_id,
            startAmount: '1',
            endAmount: '1'
          }
        ],
        consideration: [
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: prices.listing_profit,
            endAmount: prices.listing_profit,
            recipient: account,
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: prices.opensea_fee,
            endAmount: prices.opensea_fee,
            recipient: '0x0000a26b00c1F0DF003000390027140000fAa719',
          }
        ],
        totalOriginalConsiderationItems: 2,
        salt: salt,
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        nonce: 0,
        counter: 0,
      };
      const signature = await signOrder(parameters, account)

      fetch(`https://testnets-api.opensea.io/v2/orders/goerli/seaport/listings`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parameters,
          signature: signature // TODO: should be `signature` from oreID app
        }),
      }).then((response) => {
        return response.json();
      }).then((res) => {
        console.log('create listing successfully', res)
        callback();
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
