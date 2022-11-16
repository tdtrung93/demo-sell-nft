import { GlobalStyles } from '@components/GlobalStyles';
import styled from '@emotion/styled';
import React, {  } from 'react';

interface Props {
  children: React.ReactChild | React.ReactChild[];
}

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 4rem; /* for fixed header */
`;

const Content = styled.main`
  flex-grow: 1;
`;

function Layout(props: Props) {
  return (
    <>
      <GlobalStyles />
      <BodyWrapper>
        <Content>{props.children}</Content>
      </BodyWrapper>
    </>
  );
}

export default Layout;
