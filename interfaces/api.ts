import {
  BuyParams,
  RemoveParams,
  SellParams,
} from './types';

export interface API extends WriteAPI {}

interface WriteAPI {
  /**
   * Buy Assets
   * @param {BuyParams} options
   * @param {string} options.account_address - The user name in WAX & wallet address in ETH. For example ETH: '0x05baA52f8e07005e519C39519cF78593688C1Baa' - WAX: hungquach123
   * @param {callback} options.callback - The callback function for handling errors.
   * @param {string} [options.asset_contract_address] - The address of the asset contract.
   * @param {string} [options.token_id] - The token id of the asset.
   * @param {object} [options.provider] - The current web3 provider.
   * @param {number} [page] - The page number.
   * @param {number} [limit] - The total number of items per page.
   * @returns {boolean} Successful or not.
   */
  buyAsset(options: BuyParams): Promise<boolean>;

  /**
   * Sell a asset
   * @param {SellParams} options
   * @param {string} options.account_address - The user name in WAX & wallet address in ETH. For example ETH: '0x05baA52f8e07005e519C39519cF78593688C1Baa' - WAX: hungquach123
   * @param {number} options.price - The price number
   * @param {callback} options.callback - The callback function for handling errors.
   * @param {string} [options.asset_contract_address] - The address of the asset contract.
   * @param {string} [options.token_id] - The token id of the asset.
   * @param {object} [options.provider] - The current web3 provider.
   * @param {number} [page] - The page number.
   * @param {number} [limit] - The total number of items per page.
   * @returns {boolean} Successful or not.
   */
  sellAsset(options: SellParams): Promise<boolean>;

  /**
   * Remove a listing asset
   * @param {RemoveParams} options
   * @param {string} options.account_address - The user name in WAX & wallet address in ETH. For example ETH: '0x05baA52f8e07005e519C39519cF78593688C1Baa' - WAX: hungquach123
   * @param {callback} options.callback - The callback function for handling errors.
   * @param {string} [options.asset_contract_address] - The address of the asset contract.
   * @param {string} [options.token_id] - The token id of the asset.
   * @param {object} [options.provider] - The current web3 provider.
   * @param {number} [page] - The page number.
   * @param {number} [limit] - The total number of items per page.
   * @returns {boolean} Successful or not.
   */
  removeListingAsset(options: RemoveParams): Promise<boolean>;

  /**
   * Transfer a fungible or non-fungible asset to another address
   * @param {TransferParams} options Object
   * @param {string} options.fromAddress The owner's wallet address
   * @param {string} options.toAddress The recipient's wallet address
   * @param {number} [options.quantity] The amount of the asset to transfer, if it's fungible (optional). In units (not base units), e.g. not wei.
   * @param {callback} options.callback - The callback function for handling errors.
   * @param {string} options.account_address - The user name in WAX & wallet address in ETH. For example ETH: '0x05baA52f8e07005e519C39519cF78593688C1Baa' - WAX: hungquach123
   * @param {string} [options.asset_contract_address] - The address of the asset contract.
   * @param {string} [options.token_id] - The token id of the asset.
   * @param {object} [options.provider] - The current web3 provider.
   * @returns Transaction hash
   */
}
