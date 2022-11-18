import { Select } from '@components/Select';
import { colors } from '@data/config';
import styled from '@emotion/styled';
import { OpenSeaFungibleToken } from '@interfaces/services/openSeaTypes';
import { convertToUsd, formatDate, getDuration } from '@utils/index';
import { getPriceString } from '@utils/getPriceString';
import get from 'lodash/get';
import React, { useEffect, useMemo, useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi';

import styles from './index.module.scss';

const PriceContainer = styled.div`
  display: grid;
  margin-top: 15px;

  &:first-child {
    margin: 0;
  }
`;

const PriceRow = styled.div`
  font-family: Roboto;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.8px;
  color: ${colors.white};
  margin: 14px 0;

  display: grid;
  justify-content: space-between;
  grid-template-columns: auto 1fr;
  grid-column-gap: 1rem;
  margin-top: 10px;
`;

const Title = styled.p`
  font-family: Roboto Condensed;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${colors.white};
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

const Price = styled.p`
  font-family: Roboto Condensed;
  font-weight: bold;
  color: ${colors.white};

  font-size: 32px;
  line-height: 20px;
`;

const PriceUsd = styled.p`
  font-family: Roboto Condensed;
  letter-spacing: 0.8px;
  text-transform: capitalize;
  font-size: 24px;
  line-height: 20px;
  color: #969696;
  display: grid;
  justify-self: end;
`;

const DurationTime = styled.p`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.8px;
  color: #cbcbcb;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  grid-column-gap: 5px;

  margin-bottom: 1rem;
`;

const SvgClock = styled(HiOutlineClock)`
  width: 24px;
  height: 24px;
`;

interface Props {
  nftItem: any;
  isOwner: Boolean;
  onSelectChange?: (token: OpenSeaFungibleToken) => void;
  onInputChange?: (price: string) => void;
  onChangeExpirationTime?: (time: number) => void;
}

const payment_tokens = [
  {
    symbol: "ETH",
  }
];

const OpenseaPrice = ({ nftItem, isOwner, onInputChange, onSelectChange, onChangeExpirationTime, ...props }: Props) => {
  const [price, setPrice] = useState(0);
  const [token, setToken] = useState<OpenSeaFungibleToken>(payment_tokens[0]);
  const options = getDuration();
  const [expirationTime, setExpirationTime] = useState(options.find((duration) => duration.value === 7));


  const handleChange = (event) => {
    setPrice(event.target.value);
    const { value } = event.target;
    onInputChange && onInputChange(value);
  };

  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const currency = payment_tokens.find((item) => item.symbol === value);
    onSelectChange?.(currency);
    setToken(currency);
  };

  const handleChangeExpirationTime = (value: any) => {
    setExpirationTime(value);
    onChangeExpirationTime?.(value);
  };

  const renderListingPrice = useMemo(() => {
    const price = getPriceString({
      amount: get(nftItem, 'listing_price'),
      precision: Number(get(nftItem, 'token_precision'))
    });

    return (
      <PriceContainer>
        {price && (
          <>
            <Title>LISTING PRICE</Title>
            <PriceRow>
              <Price>
                {price} {nftItem.listing_symbol}
              </Price>
              {nftItem.usd_rate && <PriceUsd>{convertToUsd(+price, nftItem.usd_rate)}</PriceUsd>}
            </PriceRow>
            <DurationTime>
              <SvgClock width={24} height={24} />
              Sale ends {formatDate(+nftItem.expiration_time, 'MMM DD, YYYY [at] h:mma Z')}
            </DurationTime>
          </>
        )}
      </PriceContainer>
    );
  }, [nftItem]);

  return (
    <div>
      {renderListingPrice}
      {isOwner && !nftItem.listing_price && (
        <>
          <div className={styles.divInput}>
            <input
              type="text"
              placeholder="0.00"
              className={styles.inputPrice}
              onChange={handleChange}
            />

            <select name="typeCurrency" className={styles.select} onChange={selectChange}>
              {payment_tokens.map((option) => (
                <option key={option.symbol} className={styles.option} value={option.symbol}>
                  {option.symbol}
                </option>
              ))}
            </select>
          </div>

          <Select
            options={options}
            value={expirationTime}
            onChange={handleChangeExpirationTime}
            mapOptionToLabel={(duration: any) => duration.label}
            mapOptionToValue={(duration: any) => duration.value}
            icon="date_range"
          />

        </>
      )}
    </div>
  );
};

export default OpenseaPrice;
