import { colors } from '@data/config';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import React from 'react';

const SubHeader = styled.div`
  margin-top: 10px;
  font-size: 12px;
`;

const ActiveContainer = styled.div`
  width: 100%;
  padding: 1px;
  border-radius: 0.25rem;
`;

const StyledContainer = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 56px;
  cursor: pointer;

  &:first-child {
    margin-top: 16px;
  }
`;

const WalletContainer = styled.div`
  display: flex;
  margin-left: 16px;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.8px;
`;

const WalletName = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  margin-right: 0.25em;
  background: ${colors.green};
`;

export default function Option({
  link = null,
  clickable = true,
  size,
  onClick = null,
  color,
  header,
  subheader = null,
  icon,
  active = false,
  id
}: {
  link?: string | null;
  clickable?: boolean;
  size?: number | null;
  onClick?: null | (() => void);
  color: string;
  header: React.ReactNode;
  subheader: React.ReactNode | null;
  icon: string;
  active?: boolean;
  id: string;
}) {
  const content = (
    <StyledContainer onClick={onClick} isActive={active}>
      <Image src={icon} alt="Icon" width="28px" height="28px" />
      <div>
        <WalletContainer>
          {active && <WalletName className="w-4 h-4 mr-4 rounded-full" />}
          {header}
        </WalletContainer>
        {subheader && <SubHeader>{subheader}</SubHeader>}
      </div>
    </StyledContainer>
  );
  if (link) {
    return <a href={link}>{content}</a>;
  }

  return !active ? content : <ActiveContainer>{content}</ActiveContainer>;
}
