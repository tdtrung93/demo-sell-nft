import styled from '@emotion/styled';
import { CircularProgress, Link } from '@mui/material';
import { has } from 'lodash';
import React, { useMemo, useState } from 'react';

const Root = styled.div`
  background: linear-gradient(149.47deg, #151515 0%, #000000 100%);
  border-radius: 16px;
  padding: 12px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 275px;
  width: 209px;
  transition: border-color 1s ease-in-out;
  margin-top: 14px;
`;

const CardImage = styled.img`
  max-height: 232px;
  width: auto;
  height: auto;
  display: flex;
  margin: 0 auto;
  align-items: center;
  align-self: center;
  &:hover {
    cursor: zoom-in;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CardVideo = styled.video`
  max-width: 232px;
  max-height: 232px;
  width: auto;
  height: auto;
  display: flex;
  margin: 0 auto;
  align-items: center;
  align-self: center;
  &:hover {
    cursor: zoom-in;
  }
`;

const VideoContainer = styled(ImageContainer)``;

const ImageOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageCircularProgress = styled(CircularProgress)`
  width: 30px;
  height: 30px;
  color: #CD0D0D !important;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NameContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  grid-column-gap: 1rem;
  padding-top: 13px;
`;

const Name = styled.span`
  font-family: Roboto;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.8px;
  color: #fff;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    color: #CD0D0D;
  }
`;

const LinkDetail = styled(Link)`
  display: contents;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Price = styled.span`
  font-family: Roboto Condensed;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #CD0D0D;
`;

const PriceUSD = styled(Price)`
  color: #8D8D8D;
`;

const Line = styled.div`
  height: 1px;
  width: 100%;
  background-color: #404040;
  margin: 12px 0;
`;

const CardNft = ({ data, customButtonSell }) => {
  const handleError = (event) => {
    event.target.src = '/empty-img.svg';
  };
  const [loading, setLoading] = useState(false);
  const isVideo = has(data, 'video');
  const srcVideo = isVideo && `https://ipfs.io/ipfs/${data.video}`;

  const getPriceString = ({ amount, precision = 18 }: {
    amount: number;
    precision: number;
  }) => {
    if (!amount) return null;
  
    const value = precision ? parseFloat((amount / 10 ** precision).toString()) : amount;
  
    let valueString = value.toString();
  
    if (value > 100000 && (value % 1 === 0)) {
      valueString = value.toFixed(0);
    }
  
    return valueString;
  };

  const price = useMemo(() => {
    return getPriceString({
      amount: +data.listing_price,
      precision: +data.token_precision
    });
  }, [data]);

  const getImageUrl = (path?: string, hostname?: string) => {
    if (!path) return '/empty-img.svg';
  
    if (/^https?:\/\//i.test(path)) return path;
  
    return hostname + path.replace(/^\//, '');
  }

  const convertToUsd = (price = 0, usdPrice = 0.05) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return formatter.format(+usdPrice * price);
  }

  const formatPrice = (price: number) => {
    if (!price) return 0;
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(price);
  }

  const renderTransaction = (
    <>
      {price ? (
        <PriceContainer>
          <Price>{`${price} ${data?.listing_symbol}`}</Price>
          <PriceUSD>{data.usd_rate && convertToUsd(+price, data.usd_rate)}</PriceUSD>
        </PriceContainer>
      ) : (
        <Line />
      )}
      {customButtonSell && customButtonSell}
    </>
  );

  const renderVideo = useMemo(() => {
    return (
      <>
        <VideoContainer>
          <CardVideo autoPlay loop playsInline muted controlsList="nodownload" src={srcVideo} onClick={() => {}} />
        </VideoContainer>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const renderImage = useMemo(() => {
    return (
      <>
        <ImageContainer>
          <CardImage
            src={getImageUrl(data.image_url)}
            alt={data.name}
            onLoad={() => {
              setLoading(true);
            }}
            onError={handleError}
            onClick={() => {}}
          />
          {!loading && (
            <ImageOverlay>
              <ImageCircularProgress />
            </ImageOverlay>
          )}
        </ImageContainer>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Root>
      {data.video ? renderVideo : renderImage}

      <div>
        <NameContainer>
          <LinkDetail onClick={() => {}}>
            <Name>{data.name ? data.name : data.token_id}</Name>
          </LinkDetail>
        </NameContainer>
        {renderTransaction}
      </div>
    </Root>
  );
};

export default CardNft;
