import { API } from '@interfaces/api';
import { OpenSeaSdk } from '@interfaces/configs/openSea';
import BigNumber from 'bignumber.js';
import {
  BuyParams,
  RemoveParams,
  SellParams,
} from '@interfaces/types/common';
import _ from 'lodash';
import { OrderSide } from '@interfaces/services/openSeaTypes';

export class EthAPI implements API {
  getCollectionImageUrl(collectionIdentifier: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async sellAsset(options: SellParams): Promise<boolean> {
    try {
      const seaport = OpenSeaSdk(options.provider);
      console.log('OPEN POPUP METAMASK FOR SIGN TRANSACTION ');
      console.log('init instance seaport from opensea-js and start call function createSellOrder', seaport);
      console.log('--- INFOR API ---', seaport?.api);
      console.log('--- _networkName ---', seaport['_networkName'] as any);
      console.log('--- OPTIONS ---', options);
      const res = await seaport.createSellOrder({
        asset: {
          tokenId: options.token_id,
          tokenAddress: options.asset_contract_address,
          schemaName: options.schema_name
        },
        startAmount: options.price,
        expirationTime: options.expirationTime,
        accountAddress: options.account_address,
        paymentTokenAddress: options.payment_token_address,
      });

      console.log('call create sell order successfully', res);
      options.callback();
      return true;
    } catch (error) {
      options.callback(error);
      console.log('call create sell order failed', error);
      return false;
    }
  }
  async removeListingAsset(options: RemoveParams): Promise<boolean> {
    try {
      // One nft can have multiple listings on OpenSea, we are using the listing with the smallest price and ignore other listings.
      // But if we want to remove asset from the market we need to clear all listings for it
      const seaport = OpenSeaSdk(options.provider);
      const { orders } = await seaport.api.getOrders({
        assetContractAddress: options.asset_contract_address,
        tokenId: options.token_id,
        side: OrderSide.Sell
      });

      await Promise.all(
        orders.map((orderInList) => {
          return seaport.cancelOrder({
            order: orderInList,
            accountAddress: options.account_address
          });
        })
      );
      options.callback();
      return true;
    } catch (error) {
      options.callback(error);
      return false;
    }
  }
  async buyAsset(options: BuyParams): Promise<boolean> {
    try {
      const seaport = OpenSeaSdk(options.provider);
      const { orders } = await seaport.api.getOrders({
        assetContractAddress: options.asset_contract_address,
        tokenId: options.token_id,
        side: OrderSide.Sell
      });

      orders.sort((orderA, orderB) => (
        new BigNumber(orderA.currentPrice).gt(new BigNumber(orderB.currentPrice)) ? 1 : -1
      ));
      const currentOrder = orders[0];

      await seaport.fulfillOrder({
        order: currentOrder,
        accountAddress: options.account_address
      });
      options.callback();
      return true;
    } catch (error) {
      options.callback(error);
      return false;
    }
  }
}
