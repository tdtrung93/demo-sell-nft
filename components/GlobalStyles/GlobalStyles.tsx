import { Global } from '@emotion/react';

import { base } from './base';
import { fonts } from './fonts';

export const GlobalStyles = () => {
  return (
    <>
      <Global styles={fonts} />
      <Global styles={base} />
    </>
  );
};
