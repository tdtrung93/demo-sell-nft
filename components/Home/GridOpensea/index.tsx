import { Alert, CircularProgress, Snackbar } from '@mui/material';
import cx from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useETHContract } from '@hooks/useETHContract';
import { selectTransactionNftIdSuccess } from '@store/slices/nft';
import { useGlobalContext } from '@provider/GlobalContext';
import { useSelector } from 'react-redux';

import CardNft from './CardNft';
import PopupSellOpensea from '../../PopupSellOpensea';
import styles from './index.module.scss';

interface Props {
  nftItem: any;
}

const ItemGridOpensea = ({ nftItem }: Props) => {
  const {
    userETH: { isLoggedIn, login, accountName }
  } = useGlobalContext();

  const { signCancelSale: signCancelSaleContract } = useETHContract();
  const transactionNftIdSuccess = useSelector(selectTransactionNftIdSuccess);

  const [isSigning, setIsSigning] = useState(false);
  const [openPopupSell, setOpenPopupSell] = useState(false);
  const [open, setOpen] = useState(false);

  const signCancelSale = useCallback(async () => {
    setIsSigning(true);

    signCancelSaleContract(nftItem, () => {});
  }, [accountName, nftItem, signCancelSaleContract]);

  useEffect(() => {
    if (transactionNftIdSuccess) {
      setOpenPopupSell(false);
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
  }, [transactionNftIdSuccess]);

  const openseaButton = useMemo(() => {
    if (!nftItem.sell_orders) {
      return (
        <button
          className={cx(styles.button, { [styles.buttonDisabled]: isSigning })}
          onClick={() => setOpenPopupSell(true)}
        >
          SELL
        </button>
      );
    } else {
      return (
        <button
          className={cx(styles.button, styles.buttonCancel, { [styles.buttonDisabled]: isSigning })}
          onClick={() => signCancelSale()}>
          {isSigning ? <CircularProgress color="secondary" className={styles.circleProgress} size="25" /> : 'Cancel'}
        </button>
      );
    }
  }, [isLoggedIn, isSigning, login, nftItem]);

  return (
    <>
      <CardNft
        data={nftItem}
        customButtonSell={openseaButton}
      />
      {openPopupSell && (
        <PopupSellOpensea
          open={openPopupSell}
          nftItem={nftItem}
          isOwner={true}
          handleClose={() => setOpenPopupSell(false)}
        />
      )}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={5000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Your listing was successful! Please check on testnets.opensea.io
        </Alert>
      </Snackbar>
    </>
  );
};

export default ItemGridOpensea;
