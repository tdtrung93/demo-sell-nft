import { colors } from '@data/config';
import styled from '@emotion/styled';
import React, { FC } from 'react';
import { HiChevronLeft, HiOutlineX } from 'react-icons/hi';

interface ModalHeaderProps {
  title?: string;
  className?: string;
  onClose?: () => void;
  onBack?: () => void;
}

const ModalHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1em;
`;

const CloseModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${colors.white};
  :hover {
    color: ${colors.red};
  }
`;

const ModalHeader: FC<ModalHeaderProps> = ({
  title = undefined,
  onClose = undefined,
  className = '',
  onBack = undefined
}) => {
  return (
    <ModalHeaderContainer className={className}>
      {onBack && <HiChevronLeft onClick={onBack} width={48} height={48} />}
      {title && <h3>{title}</h3>}
      <CloseModalContainer onClick={onClose}>
        <HiOutlineX width={48} height={48} />
      </CloseModalContainer>
    </ModalHeaderContainer>
  );
};

export default ModalHeader;
