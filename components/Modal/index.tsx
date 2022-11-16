import { colors } from '@data/config';
import { zIndex } from '@data/zIndex';
import styled from '@emotion/styled';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { isMobile } from 'react-device-detect';

interface ModalProps {
  isOpen: boolean;
  isWalletModal?: boolean;
  onDismiss: () => void;
  minHeight?: number;
  maxHeight?: number;
  initialFocusRef?: React.RefObject<any>;
  children?: React.ReactNode;
  padding?: number;
  maxWidth?: number;
  className?: string;
}

const StyledDiv = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${zIndex.modal};
  overflow-y: hidden;
  backdrop-filter: drop-shadow(4px 4px 10px blue);
`;

const StyledDialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${colors.black + '99'};
  backdrop-filter: blur(2px);
  backdrop-filter: opacity(20%);
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4em;
  height: 100vh;
`;

const TransitionContainer = styled.div<{ maxWidth: number }>`
  --modal-translate-x: 0;
  --modal-translate-y: 0;
  --modal-rotate: 0;
  --modal-skew-x: 0;
  --modal-skew-y: 0;
  --modal-scale-x: 1;
  --modal-scale-y: 1;
  --maxWidth: ${(p) => p.maxWidth + 'px'};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  width: 65vw;
  max-width: var(--maxWidth);

  transform: translateX(var(--modal-translate-x)) translateY(var(--modal-translate-y)) rotate(var(--modal-rotate))
    skewX(var(--modal-skew-x)) skewY(var(--modal-skew-y)) scaleX(var(--modal-scale-x)) scaleY(var(--modal-scale-y));

  ${isMobile} {
    width: 100%;
  }
`;

const Container1 = styled.div<{ isWalletModal: boolean }>`
  width: 100%;
  padding: 1px;
  border-radius: 1.25rem;
  background-color: ${(p) => (p.isWalletModal ? colors.grayDark1 : '#ff0821')};
  background-image: ${(p) => (p.isWalletModal ? 'none' : 'linear-gradient(315deg, #e03d4e 0%, #a71d31 74%)')};
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.5rem;
  overflow-y: hidden;
  border-radius: 1.25rem;
  background-color: ${colors.matteBlack};
`;

const Container3 = styled.div<{ minHeight: number; maxHeight: number }>`
  --minHeight: ${(p) => p.minHeight + 'vh'};
  --maxHeight: ${(p) => p.maxHeight + 'vh'};

  min-height: var(--minHeight);
  max-height: var(---maxHeight);
`;

const Modal = ({
  isOpen,
  isWalletModal = false,
  onDismiss,
  minHeight = 0,
  maxHeight = 90,
  initialFocusRef,
  children,
  padding = 5,
  maxWidth = 420
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as={StyledDiv} onClose={onDismiss}>
        <StyledDialogOverlay />
        <StyledContainer>
          <Transition.Child
            as="div"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <TransitionContainer maxWidth={maxWidth}>
              <Container1 isWalletModal={isWalletModal}>
                <Container2>
                  <Container3 minHeight={minHeight} maxHeight={maxHeight}>
                    {children}
                  </Container3>
                </Container2>
              </Container1>
            </TransitionContainer>
          </Transition.Child>
        </StyledContainer>
      </Dialog>
    </Transition>
  );
};

export default Modal;
