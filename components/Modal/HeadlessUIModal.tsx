import { colors } from '@data/config';
import { zIndex } from '@data/zIndex';
import styled from '@emotion/styled';
import { Dialog, Transition } from '@headlessui/react';
import { FC } from 'react';
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  children?: React.ReactNode;
}

const ModalContainer = styled.div`
  position: fixed;
  z-index: ${zIndex.modal};
  overflow-y: auto;
`;
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  display: block;
`;

const StyledDialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  background-color: ${colors.black + '66'};
`;

const StyledSpan = styled.span`
  display: inline-block;
  vertical-align: middle;
  height: 100vh;
`;

const StyledItemContainer = styled.div`
  display: inline-block;
  vertical-align: bottom;
  border-radius: 0.5rem;
  text-align: left;
  overflow: hidden;
`;

const HeadlessUIModal: FC<ModalProps> = ({ isOpen, onDismiss, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as={ModalContainer} static open={isOpen} onClose={onDismiss}>
        <Container>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-40"
            leave="ease-in duration-100"
            leaveFrom="opacity-40"
            leaveTo="opacity-0">
            <StyledDialogOverlay>
              <div />
              <div />
            </StyledDialogOverlay>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <StyledSpan aria-hidden="true">&#8203;</StyledSpan>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-40"
            leave="ease-in duration-100"
            leaveFrom="opacity-40"
            leaveTo="opacity-0">
            <StyledItemContainer>{children}</StyledItemContainer>
          </Transition.Child>
        </Container>
      </Dialog>
    </Transition.Root>
  );
};

export default HeadlessUIModal;
