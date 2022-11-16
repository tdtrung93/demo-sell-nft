import { BigNumber } from 'ethers';
import { provider } from 'web3-core';

import { AssetEvent, OpenSeaAssetContract, OpenSeaCollection, WyvernSchemaName } from '../services/openSeaTypes';

export type Callback = (error?: Error) => void;

export interface BuyParams extends EthParams {
  // Common
  account_address: string;
  callback: Callback;
}

export interface RemoveParams extends EthParams {
  // Common
  account_address: string;
  callback: Callback;
}

export interface SellParams extends EthParams {
  // Common
  account_address: string;
  price: number;
  payment_token_address?: string;
  schema_name?: WyvernSchemaName;
  expirationTime?: number;
  callback: Callback;
}

export interface EthParams {
  asset_contract_address?: string;
  token_id?: string;
  provider?: provider;
}

export interface FilterOptionField {
  type: string;
  name: string;
  options: any[];
}

export interface FilterOption {
  schemaName: string;
  fields: FilterOptionField[];
}

export interface FilterOptions {
  filterOptions: FilterOption[];
}

export declare type DataOption = {
  [key: string]: any;
};

export interface TemplateParams {
  collection_name?: string;
  schema_name?: string;
  authorized_account?: string;
  template_id?: string;
  max_supply?: number;
  issued_supply?: number;
  is_transferable?: boolean;
  is_burnable?: boolean;
  order?: string;
  sort?: string;
  [key: string]: any;
}

export interface SearchParams {
  order?: SortOrder;
}

export interface SaleParams extends SearchParams {
  // ETH
  sort_by?: EthOrderSort;
  asset_contract_address?: string;
  maker?: string;
  taker?: string;
  is_english?: boolean;
  bundled?: boolean;
  include_bundled?: boolean;
  include_invalid?: boolean;
  listed_after?: string;
  listed_before?: string;
  token_id?: string;
  token_ids?: string[];
  side?: number;
  sale_kind?: number;
}

export enum AssetSort {
  AssetId = 'asset_id',
  Minted = 'minted',
  Updated = 'updated',
  Transferred = 'transferred',
  TemplateMint = 'template_mint',
  Name = 'name',
  // Eth
  Price = 'price',
  Date = 'date',
  Default = 'default'
}

/**
 * @deprecated
 * TODO: Remove
 */
export enum EthAssetSort {
  TokenId = 'token_id',
  SaleDate = 'sale_date',
  SaleCount = 'sale_count',
  SalePrice = 'sale_price',
  VisitorCount = 'visitor_count'
}

/**
 * @deprecated
 * TODO: Remove
 */
export enum EthOrderSort {
  EthPrice = 'eth_price',
  CreatedDate = 'created_date'
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export enum SaleSort {
  Created = 'created',
  SaleId = 'sale_id',
  Price = 'price',
  Date = 'date',
  Updated = 'updated',
  TemplateMint = 'template_mint',
  TemplateId = 'template_id'
}

export enum ExtendedChainNetwork {
  EthGoerli = "eth_goerli",
}

export interface AssetParams extends SearchParams {
  // Common
  owner?: string;
  collection_name?: string;
  // ETH
  /**
   * @deprecated
   * TODO: Remove
   */
  sort_by?: EthAssetSort;
  has_sell_orders?: boolean;
  asset_contract_address?: string;
}

/**
 * Update this might affect the Firebase query
 * @typedef {object} FilterParams
 * @property {string} id - The key of trait. For example 'Speed'
 * @property {string} value - The value of trait. For example '10'
 */
export interface FilterParams {
  id: string;
  value: string | number;
}

export enum SaleState {
  Waiting = 0,
  Listed = 1,
  Canceled = 2,
  Sold = 3,
  Invalid = 4
}

/**
 * Not to use directly
 */
export interface BaseCollection {
  collection_name: string;
  name: string;
  img: string;
  author: string;
  allow_notify: boolean;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  created_at_block: string;
  created_at_time: string;
}

export interface Collection {
  contract: string;
  data: { [key: string]: any };
}

/**
 *
 */
export interface BaseSchema {
  schema_name: string;
  format: SchemaFormat[];
  created_at_block: string;
  created_at_time: string;
}

export interface SchemaFormat {
  name: string;
  type: string;
}

export interface Schema extends BaseSchema {
  contract: string;
  collection: BaseCollection;
}

export interface BaseTemplate {
  template_id: string;
  is_transferable: boolean;
  is_burnable: boolean;
  issued_supply: string;
  max_supply: string;
  immutable_data: {
    [key: string]: any;
  };
  created_at_time: string;
  created_at_block: string;
}

/**
 *
 */
export interface Template extends BaseTemplate {
  contract: string;
  collection: BaseCollection;
  schema: BaseSchema;
}

/**
 * An NFT.
 */
export interface Asset {
  // Common
  asset_id: string;
  owner: string;
  image_url?: string;
  name: string;
  collection_name?: string;
  current_price?: string;
  description?: string;
  data?: any;
  num_sales?: number;
  animation_url?: string;
  creator?: any;
  ownerObj?: any;
}

export interface ListingAsset extends Asset {
  sales?: Pick<Sale, 'market_contract' | 'sale_id'>[];
  auctions?: Pick<Auction, 'market_contract' | 'auction_id'>[];
  wallet_type: any;
}

export interface EthAsset extends Asset {
  id: number | string;
  token_id: string;
  background_color: string;
  external_link: string;
  image_thumbnail_url: string;
  permalink: string;
  asset_contract: OpenSeaAssetContract;
  last_sale: AssetEvent;
  traits: Record<string, unknown>[];
  sell_orders?: any | null;
  opensea_collection?: OpenSeaCollection;
  media_type: string;
  price: Price;
  sales?: any;
  creator: any;
  sale_timestamp?: Date;
  timestamp?: Date;
  traits_for_query: string[];
}

export declare enum AuctionState {
  Waiting = 0,
  Listed = 1,
  Canceled = 2,
  Sold = 3,
  Invalid = 4
}

export declare enum OfferState {
  Pending = 0,
  Invalid = 1,
  Unknown = 2,
  Accepted = 3,
  Declined = 4,
  Canceled = 5
}

export interface Auction {
  market_contract: string;
  asset_contract: string;
  auction_id: string;
  seller: string;
  buyer: string;
  price: Price;
  assets: Asset[];
  bids: Bid[];
  maker_marketplace: string;
  taker_marketplace: string;
  collection: BaseCollection;
  state: AuctionState;
  collection_blacklisted: boolean;
  collection_whitelisted: boolean;
  seller_blacklisted: boolean;
  seller_whitelisted: boolean;
  end_time: string;
  updated_at_block: string;
  updated_at_time: string;
  created_at_block: string;
  created_at_time: string;
  created_at_txid: string;
}

export interface Bid {
  number: string;
  account: string;
  amount: string;
  txid: string;
  created_at_block: string;
  created_at_time: string;
}

export interface Sale {
  //Common
  price: Price;
  asset_id: string;
  market_contract?: string;
  asset_contract?: string;
  sale_id?: string;
  seller?: string;
  buyer?: string;
  offer_id?: string;
  listing_symbol?: string;
  assets?: Asset[];
  maker_marketplace?: string;
  taker_marketplace?: string;
  collection?: BaseCollection;
  sale_state?: SaleState;
  offer_state?: OfferState;
  collection_blacklisted?: boolean;
  collection_whitelisted?: boolean;
  seller_blacklisted?: boolean;
  seller_whitelisted?: boolean;
  updated_at_block?: string;
  updated_at_time?: string;
  created_at_block?: string;
  created_at_time?: string;
  created_at_txid?: string;
  wallet_type: any;
  price_median?: number;
  listing_price?: string;
}

export interface EthSale extends Sale {}

/**
 *
 */
export interface ApiTemplateStats {
  assets: string;
}

/**
 *
 */
export interface ILog {
  log_id: string;
  name: string;
  data: {
    [key: string]: any;
  };
  txid: string;
  created_at_block: string;
  created_at_time: string;
}

// interface.ts

/**
 *
 */
export interface Token {
  // Common
  token_symbol: string;
  /**
   * token_precision number or string?
   */
  token_precision: number;
}

export interface Price extends Token {
  // Common
  amount: string;
  amount_raw?: string;
  amount_number?: number;
}

export interface SaleHistoryEntry {
  // Common
  seller: string;
  seller_address?: string;
  buyer: string;
  buyer_address?: string;
  date: string;
  asset?: Asset | EthAsset;
  price: Price;

  // ETH
  event_id?: number;
  buyer_raw?: any;
  seller_raw?: any;
  block_hash?: string;
  transaction_hash?: string;
  block_number?: string;
}

export interface TransferParams extends EthParams {
  // asset: EthAsset | Asset | any;
  fromAddress: string;
  quantity?: number | BigNumber;
  toAddress: string;
  callback: Callback;
  schemaName?: WyvernSchemaName;
}

export interface PriceStats extends Token {
  collection_name?: string;
  template_id?: string;
  average?: number;
  median?: number;
  suggested_average?: number;
  suggested_median?: number;
  min?: number;
  max?: number;
  sales?: number;
}

export interface PriceSales extends Token {
  average?: number;
  median?: number;
  time?: number;
  sales?: number;
}

// Type.ts

export type RowEntry = {
  id: number;
  owner: string;
  value: number;
  median: number;
  timestamp: string;
};

export interface IAccountCollectionStats {
  schemas: Array<{
    schema_name: ICollection;
    assets: string;
  }>;
  templates: Array<{
    template_id: string;
    assets: string;
  }>;
}

export interface ICollection extends ILightCollection {
  contract: string;
}

export interface ILightCollection {
  contract: string;
  collection_name: string;
  name: string;
  img: string;
  author: string;
  allow_notify: boolean;
  authorized_accounts: string[];
  notify_accounts: string[];
  market_fee: number;
  data: {
    [key: string]: any;
  };
  created_at_block: string;
  created_at_time: string;
}

export type AccountType =
  // Eth
  | 'metamask'
  | 'walletConnect'

export type Currency =
  // Eth
  | 'ETH';

export type Network =
  // Common
  | 'mainnet'
  // Eth
  | 'rinkeby'
  // Goerli Eth
  | 'goerli';
