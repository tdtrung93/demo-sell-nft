import { EthAsset, EthSale, SaleHistoryEntry } from '..'
import BigNumber from 'bignumber.js'

export default class OpenSeaMapper {
  public static toEthAsset(openSeaAsset: any): EthAsset {
    const assetMediaType = openSeaAsset.traits?.find(
      ({ trait_type }) => trait_type === 'media_type',
    )?.value as string

    const currentPrice =
      openSeaAsset.sell_orders?.[0]?.current_price?.toString()

    const currentPriceBigNumber = new BigNumber(currentPrice ?? 0).div('1.e+18')

    const traits =
      openSeaAsset?.traits
        ?.map((trait) => `${trait.trait_type}:${trait.value}`)
        .sort() ?? []

    const generateCombinations = (array, i = 0) => {
      if (i == array.length) return [[]]
      return generateCombinations(array, i + 1).flatMap((x) => [
        x,
        [array[i]].concat(x),
      ])
    }

    const combinations = generateCombinations(traits)
      .filter((item) => item.length)
      .map((item) => item.join('.'))

    /**
     *  Update this code might affect the scheduler & Firebase query
     */
    const asset: EthAsset = {
      // Common
      asset_id: `${openSeaAsset.asset_contract?.address}/${openSeaAsset?.token_id}`,
      owner: openSeaAsset.owner?.address,
      image_url: openSeaAsset.image_url,
      animation_url: openSeaAsset.animation_url,
      name: openSeaAsset.name,
      collection_name: openSeaAsset.collection?.name,
      current_price: currentPrice ?? null,
      description: openSeaAsset.description,
      data:
        openSeaAsset?.traits?.map((trait) => ({
          trait_type: trait.trait_type,
          value: trait.value,
        })) ?? [],
      permalink: openSeaAsset.permalink,
      num_sales: openSeaAsset.num_sales,
      sales: openSeaAsset.sell_orders || [],

      // ETH
      id: openSeaAsset.id,
      token_id: openSeaAsset.token_id,
      background_color: openSeaAsset.background_color,
      external_link: openSeaAsset.external_link,
      image_thumbnail_url: openSeaAsset.image_thumbnail_url,
      asset_contract: openSeaAsset.asset_contract,
      last_sale: openSeaAsset.last_sale,
      traits: openSeaAsset.traits,
      traits_for_query: combinations,
      sell_orders: openSeaAsset.sell_orders,
      opensea_collection: openSeaAsset.collection,
      media_type: assetMediaType ?? null,
      creator: openSeaAsset.creator,
      ownerObj: openSeaAsset.owner,
      sale_timestamp: openSeaAsset?.sell_orders
        ? new Date(openSeaAsset?.sell_orders[0].created_date)
        : null,
      timestamp: openSeaAsset?.asset_contract?.created_date
        ? new Date(openSeaAsset.asset_contract.created_date)
        : null,
      price: {
        amount: currentPriceBigNumber.toString(),
        amount_number: currentPriceBigNumber.toNumber(),
        amount_raw: currentPriceBigNumber.toString(),
        token_precision: 0,
        token_symbol: 'ETH',
      },
    }
    return asset
  }

  public static toEthSale(openSeaOrder: any): EthSale {
    const priceBigNumber = new BigNumber(openSeaOrder?.current_price ?? 0)
    const sale: EthSale = {
      ...openSeaOrder,
      price: {
        amount: priceBigNumber.div('1.e+18').toString(),
        amount_number: priceBigNumber.toNumber(),
        amount_raw: priceBigNumber.toString(),
        token_precision: 1,
        token_symbol: 'ETH',
      },
    }

    return sale
  }

  public static toSaleHistoryEntry(event: any): SaleHistoryEntry {
    const priceBigNumber = new BigNumber(event.total_price).div('1.e+18')
    const asset: SaleHistoryEntry = {
      asset: OpenSeaMapper.toEthAsset(event.asset),
      block_hash: event.transaction.block_hash,
      block_number: event.transaction.block_number,
      transaction_hash: event.transaction.transaction_hash,
      price: {
        amount: priceBigNumber.toString(),
        amount_number: priceBigNumber.toNumber(),
        amount_raw: event.total_price,
        token_precision: 1,
        token_symbol: 'ETH',
      },
      seller: event.seller.user?.username,
      seller_address: event.seller.address,
      seller_raw: event.seller,
      buyer: event.winner_account.user?.username,
      buyer_address: event.winner_account.address,
      buyer_raw: event.winner_account,
      date: event.created_date,
      event_id: event.id,
    }
    return asset
  }
}
