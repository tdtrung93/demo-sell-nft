import { Backdrop, Fade, ModalProps } from '@mui/material';
import ModalMui from '@material-ui/core/Modal';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import React from 'react';

import Svg from '../Svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    paper: {
      backgroundColor: '#000000',
      // borderRadius: '16px',
      color: '#ffffff',
      // boxShadow: '0px 3px 3px -2px white, 0px 3px 3px 0px white, 0px 1px 8px 0px white',
      maxHeight: '80%',
      margin: '0 16px',
      overflowY: 'scroll',
      width: '100%',
      maxWidth: '375px',
      [theme.breakpoints.up('sm')]: {
        overflowY: 'initial',
        margin: '0',
        maxWidth: '677px',
        maxHeight: '410px'
      },
      [theme.breakpoints.up('md')]: {
        maxWidth: '737px',
        maxHeight: '458px'
      },
      position: 'relative',
      borderRadius: '16px'
    },

    iconClose: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      cursor: 'pointer'
    }
  })
);

export type Props = React.PropsWithChildren<{
  open: boolean;
  handleClose?: (success: boolean) => void;
  isBtnClose?: boolean;
  isConfirmSwapToken?: boolean;
}>;

const Modal = ({ open, handleClose, isBtnClose, isConfirmSwapToken, ...props }: Props & ModalProps) => {
  const classes = useStyles();

  const handleCloseModal = () => {
    if (handleClose) {
      handleClose(false);
    }
  };

  return (
    <ModalMui
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      disableScrollLock
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
      {...props}>
      <Fade in={open}>
        <div className={classes.paper} style={isConfirmSwapToken && { maxHeight: '800px' }}>
          {isBtnClose && (
            <Svg
              className={classes.iconClose}
              name="closed"
              fill="#ffffff"
              width="20"
              height="20"
              onClick={handleCloseModal}
              aria-hidden="true"
            />
          )}
          <>{props.children}</>
        </div>
      </Fade>
    </ModalMui>
  );
};

export default Modal;
