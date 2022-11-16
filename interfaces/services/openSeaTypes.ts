/**
 * @deprecated
 * TODO: Move all used type to layer/types
 */

import BigNumber from 'bignumber.js'
import {
  ECSignature,
  HowToCall,
  Order as WyvernOrder,
} from 'wyvern-js/lib/types'
import { Token } from 'wyvern-schemas/dist/types'
/**
 * Events emitted by the SDK. There are five types:
 * 1. Transaction events, which tell you when a new transaction was
 *    created, confirmed, denied, or failed.
 * 2. pre-transaction events, which are named (like "WrapEth") and indicate
 *    that Web3 is asking for a signature on a transaction that needs to occur before
 *    an order is made or fulfilled. This includes approval events and account
 *    initialization.
 * 3. Basic actions: matching, cancelling, and creating orders.
 *    The "CreateOrder" event fires when a signature is being prompted
 *    to create an off-chain order. The "OrderDenied" event fires when a signature
 *    request is denied by the user.
 * 4. The "TransferAll" event, which fires when a user is about to directly
 *    transfer one or more assets to another account
 */
export enum EventType {
  transaction_created = 'TransactionCreated',
  transaction_confirmed = 'TransactionConfirmed',
  transaction_denied = 'TransactionDenied',
  transaction_failed = 'TransactionFailed',
  initialize_account = 'InitializeAccount',
  wrap_eth = 'WrapEth',
  unwrap_weth = 'UnwrapWeth',
  approve_currency = 'ApproveCurrency',
  approve_asset = 'ApproveAsset',
  approve_all_assets = 'ApproveAllAssets',
  unapprove_currency = 'UnapproveCurrency',
  match_orders = 'MatchOrders',
  cancel_order = 'CancelOrder',
  approve_order = 'ApproveOrder',
  create_order = 'CreateOrder',
  order_denied = 'OrderDenied',
  transfer_all = 'TransferAll',
  transfer_one = 'TransferOne',
  wrap_assets = 'WrapAssets',
  unwrap_assets = 'UnwrapAssets',
  liquidate_assets = 'LiquidateAssets',
  purchase_assets = 'PurchaseAssets',
}
/**
 * Data that gets sent with each EventType
 */
export interface EventData {
  account_address?: string
  to_address?: string
  proxy_address?: string
  amount?: BigNumber
  contract_address?: string
  assets?: WyvernAsset[]
  asset?: WyvernAsset
  transaction_hash?: string
  event?: EventType
  error?: Error
  order?: Order | UnsignedOrder
  buy?: Order
  sell?: Order
  match_metadata?: string
}

/**
 * Wyvern order side: buy or sell.
 */
export enum OrderSide {
  Buy = 'bid',
  Sell = 'ask',
}
/**
 * Wyvern fee method
 * ProtocolFee: Charge maker fee to seller and charge taker fee to buyer.
 * SplitFee: Maker fees are deducted from the token amount that the maker receives. Taker fees are extra tokens that must be paid by the taker.
 */
export enum FeeMethod {
  ProtocolFee = 0,
  SplitFee = 1,
}
/**
 * Wyvern: type of sale. Fixed or Dutch auction
 * Note: not imported from wyvern.js because it uses
 * EnglishAuction as 1 and DutchAuction as 2
 */
export enum SaleKind {
  FixedPrice = 0,
  DutchAuction = 1,
}
/**
 * Types of asset contracts
 * Given by the asset_contract_type in the OpenSea API
 */
export enum AssetContractType {
  Fungible = 'fungible',
  SemiFungible = 'semi-fungible',
  NonFungible = 'non-fungible',
  Unknown = 'unknown',
}
export enum WyvernSchemaName {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  LegacyEnjin = 'Enjin',
  ENSShortNameAuction = 'ENSShortNameAuction',
}
/**
 * The NFT version that this contract uses.
 * ERC721 versions are:
 * 1.0: CryptoKitties and early 721s, which lack approve-all and
 *      have problems calling `transferFrom` from the owner's account.
 * 2.0: CryptoSaga and others that lack `transferFrom` and have
 *      `takeOwnership` instead
 * 3.0: The current OpenZeppelin standard:
 *      https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721.sol
 * Special cases:
 * locked: When the transfer function has been locked by the dev
 */
export enum TokenStandardVersion {
  Unsupported = 'unsupported',
  Locked = 'locked',
  Enjin = '1155-1.0',
  ERC721v1 = '1.0',
  ERC721v2 = '2.0',
  ERC721v3 = '3.0',
}
export enum WyvernAssetLocation {
  Account = 'account',
  Proxy = 'proxy',
  Other = 'other',
}
export interface WyvernNFTAsset {
  id: string
  address: string
}
export interface WyvernFTAsset {
  id?: string
  address: string
  quantity: string
}
export type WyvernAsset = WyvernNFTAsset | WyvernFTAsset
export interface WyvernBundle {
  assets: WyvernAsset[]
  schemas: WyvernSchemaName[]
  name?: string
  description?: string
  external_link?: string
}
export type WyvernAtomicMatchParameters = [
  string[],
  BigNumber[],
  Array<number | BigNumber>,
  string,
  string,
  string,
  string,
  string,
  string,
  Array<number | BigNumber>,
  string[],
]

/**
 * Simple, unannotated asset spec
 */
export interface Asset {
  token_id: string | null
  token_address?: string
  schema_name?: WyvernSchemaName
  version?: TokenStandardVersion
  name?: string
  decimals?: number
}
/**
 * Annotated asset contract with OpenSea metadata
 */
export interface OpenSeaAssetContract extends OpenSeaFees {
  name: string
  address: string
  asset_contract_type: AssetContractType
  schema_name: WyvernSchemaName
  seller_fee_basis_points: number
  buyer_fee_basis_points: number
  description: string
  symbol: string
  image_url: string
  stats?: Record<string, unknown>
  traits?: Record<string, unknown>[]
  external_link?: string
  wiki_link?: string
  created_date: Date
  nft_version?: any
  opensea_version: string
  owner: number
  total_supply?: any
  default_to_fiat: boolean
  only_proxied_transfers: boolean
  payout_address?: string
}
interface NumericalTraitStats {
  min: number
  max: number
}
interface StringTraitStats {
  [key: string]: number
}
/**
 * Annotated collection with OpenSea metadata
 */
export interface OpenSeaCollection extends OpenSeaFees {
  name: string
  slug: string
  editors?: string[]
  hidden: boolean
  featured: boolean
  created_date: Date
  description: string
  image_url: string
  large_image_url: string
  featured_image_url: string
  stats?: Record<string, unknown>
  display_data: Record<string, unknown>
  payment_tokens?: OpenSeaFungibleToken[]
  payout_address?: string
  trait_stats?: OpenSeaTraitStats
  external_link?: string
  wiki_link?: string
  banner_image_url?: string
  chat_url?: string
  default_to_fiat?: boolean
  discord_url?: string
  external_url?: string
  safelist_request_status?: string
  is_subject_to_whitelist?: boolean
  medium_username?: any
  only_proxied_transfers?: boolean
  require_email?: boolean
  short_description?: string
  telegram_url?: string
  twitter_username?: string
  instagram_username?: string
  wiki_url?: string
}
export interface OpenSeaTraitStats {
  [traitName: string]: NumericalTraitStats | StringTraitStats
}
/**
 * Annotated asset spec with OpenSea metadata
 */
export interface OpenSeaAsset extends Asset {
  asset_contract: OpenSeaAssetContract
  collection: OpenSeaCollection
  name: string
  description: string
  owner: any
  orders?: Order[] | null
  buy_orders?: Order[] | null
  sell_orders?: Order[] | null
  is_presale?: boolean
  image_url?: string
  image_preview_url: string
  image_url_original?: string
  image_url_thumbnail?: string
  opensea_link?: string
  external_link: string
  traits?: Record<string, unknown>[]
  num_sales: number
  last_sale?: AssetEvent | null
  background_color: string | null
  transfer_fee?: BigNumber | string | null
  transfer_fee_payment_token?: OpenSeaFungibleToken | null
  permalink: string
  image_thumbnail_url: string
  id: number
  animation_url: string | null
  image_original_url?: string
  animation_original_url?: string
  token_metadata?: string
  creator?: any
  top_bid?: any
  listing_date?: Date
}
/**
 * Defines a AssetEvent type which contains details about an event that occurred
 */
export interface AssetEvent {
  event_type: AssetEventType
  event_timestamp: Date
  auction_type: AuctionType
  total_price: string
  transaction: Transaction | null
  payment_token: OpenSeaFungibleToken | null
  asset?: any
  asset_bundle?: any
  created_date?: Date
  quantity: string
}
/**
 * Defines set of possible auctions types
 */
export enum AuctionType {
  Dutch = 'dutch',
  English = 'english',
  MinPrice = 'min_price',
}
/**
 * Defines the possible types of asset events that can take place
 */
export enum AssetEventType {
  AuctionCreated = 'created',
  AuctionSuccessful = 'successful',
  AuctionCancelled = 'cancelled',
  OfferEntered = 'offer_entered',
  BidEntered = 'bid_entered',
  BidWithdraw = 'bid_withdraw',
  AssetTransfer = 'transfer',
  AssetApprove = 'approve',
  CompositionCreated = 'composition_created',
  Custom = 'custom',
  Payout = 'payout',
}
/**
 * Defines a Transaction type.
 */
export interface Transaction {
  from_account: any
  to_account: any
  created_date?: Date
  modified_date?: Date
  transaction_hash: string
  transaction_index: string
  block_number: string
  block_hash: string
  timestamp: Date
  id?: number
}
/**
 * Full annotated Fungible Token spec with OpenSea metadata
 */
export interface OpenSeaFungibleToken extends Token {
  id?: number
  symbol?: string
  address?: string
  name?: string | null
  decimals?: number
  image_url?: string
  eth_price?: string
  usd_price?: string
}
export type FungibleToken = OpenSeaFungibleToken
/**
 * Bundles of assets, grouped together into one OpenSea order
 * URLs for bundles are auto-generated from the name
 */
export interface OpenSeaAssetBundle {
  maker: any
  assets: OpenSeaAsset[]
  name: string
  slug: string
  permalink: string
  sell_orders: Order[] | null
  asset_contract?: OpenSeaAssetContract
  description?: string
  external_link?: string
}
export interface OpenSeaAssetBundleJSON {
  assets: OpenSeaAsset[]
  name: string
  description?: string
  external_link?: string
  maker?: any
}
/**
 * Query interface for Bundles
 */
export interface OpenSeaAssetBundleQuery
  extends Partial<OpenSeaAssetBundleJSON> {
  asset_contract_address?: string
  token_ids?: Array<number | string>
  on_sale?: boolean
  owner?: string
  offset?: number
  limit?: number
  search?: string
}
/**
 * The basis point values of each type of fee
 */
export interface OpenSeaFees {
  opensea_seller_fee_basis_points: number
  opensea_buyer_fee_basis_points: number
  dev_seller_fee_basis_points: number
  dev_buyer_fee_basis_points: number
}
/**
 * Fully computed fees including bounties and transfer fees
 */
export interface ComputedFees extends OpenSeaFees {
  total_buyer_fee_basis_points: number
  total_seller_fee_basis_points: number
  transfer_fee: BigNumber
  transfer_fee_token_address: string | null
  seller_bounty_basis_points: number
}
export interface ExchangeMetadataForAsset {
  asset: WyvernAsset
  schema: WyvernSchemaName
  referrer_address?: string
}
export interface ExchangeMetadataForBundle {
  bundle: WyvernBundle
  referrer_address?: string
}
export type ExchangeMetadata =
  | ExchangeMetadataForAsset
  | ExchangeMetadataForBundle
// @ts-ignore
export interface UnhashedOrder extends WyvernOrder {
  fee_method: FeeMethod
  side: OrderSide
  sale_kind: SaleKind
  how_to_call: HowToCall
  quantity: BigNumber
  maker_referrer_fee: BigNumber
  waiting_for_best_counter_order?: boolean
  english_auction_reserve_price?: BigNumber
  metadata: ExchangeMetadata
}
export interface UnsignedOrder extends UnhashedOrder {
  hash?: string
}
/**
 * Orders don't need to be signed if they're pre-approved
 * with a transaction on the contract to approveOrder_
 */
export interface Order extends UnsignedOrder, Partial<ECSignature> {
  created_time?: BigNumber
  current_price?: BigNumber
  current_bounty?: BigNumber
  maker_account?: any
  taker_account?: any
  payment_token_contract?: OpenSeaFungibleToken
  fee_recipient_account?: any
  cancelled_or_finalized?: boolean
  marked_invalid?: boolean
  asset?: OpenSeaAsset
  asset_bundle?: OpenSeaAssetBundle
}
/**
 * Order attributes, including orderbook-specific query options
 * See https://docs.opensea.io/reference#retrieving-orders for the full
 * list of API query parameters and documentation.
 */
export interface OrderJSON extends Partial<ECSignature> {
  exchange: string
  maker: string
  taker: string
  maker_relayer_fee: string
  taker_relayer_fee: string
  maker_protocol_fee: string
  taker_protocol_fee: string
  maker_referrer_fee: string
  fee_recipient: string
  fee_method: number
  side: number
  sale_kind: number
  target: string
  how_to_call: number
  calldata: string
  replacement_pattern: string
  static_target: string
  static_extradata: string
  payment_token: string
  quantity: string
  base_price: string
  english_auction_reserve_price: string | undefined
  extra: string
  created_time?: number | string
  listing_time: number | string
  expiration_time: number | string
  salt: string
  metadata: ExchangeMetadata
  hash: string
}
/**
 * Query interface for Orders
 * Includes `maker`, `taker` and `side` from above
 * See https://docs.opensea.io/reference#retrieving-orders for
 * full docs.
 */
export interface OrderQuery extends Partial<OrderJSON> {
  owner?: string
  sale_kind?: SaleKind
  asset_contract_address?: string
  payment_token_address?: string
  is_english?: boolean
  is_expired?: boolean
  bundled?: boolean
  include_invalid?: boolean
  token_id?: number | string
  token_ids?: Array<number | string>
  listed_after?: number | string
  listed_before?: number | string
  limit?: number
  offset?: number
}
/**
 * Query interface for Assets
 */
export interface OpenSeaAssetQuery {
  owner?: string
  asset_contract_address?: string
  token_ids?: Array<number | string>
  search?: string
  order_by?: string
  order_direction?: string
  limit?: number
  offset?: number
}
/**
 * Query interface for Fungible Assets
 */
export interface OpenSeaFungibleTokenQuery
  extends Partial<OpenSeaFungibleToken> {
  limit?: number
  offset?: number
  symbol?: string
}
export type FungibleTokenQuery = OpenSeaFungibleTokenQuery
export interface OrderbookResponse {
  orders: OrderJSON[]
  count: number
}
