import { baseUnit, colors } from '@data/config';
import { zIndex } from '@data/zIndex';
import { css } from '@emotion/react';

import { upFromBreakpoint, upToBreakpoint } from '../../utils/mixins';

export const base = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    word-break: break-word;
  }

  :root {
    --maxWidthPadding: 1rem;

    ${upFromBreakpoint('small')} {
      --maxWidthPadding: 2rem;
    }
  }

  html {
    font-family: 'Roboto', 'Roboto Condensed', Arial, Helvetica, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
      'Segoe UI Symbol';
    font-size: ${baseUnit}px;
    font-weight: 300;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
  }

  body {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${colors.white};
    text-rendering: optimizeLegibility;
    background-color: white;
    ${upToBreakpoint('small')} {
      background-color: ${colors.black3};
    }
  }

  @media print {
    body {
      padding: 0;
      color: #000;
      background-color: transparent;
    }
  }

  img,
  figure,
  video {
    max-width: 100%;
    height: auto;
  }

  p,
  figure {
    margin: 0;
  }

  button {
    margin: 0;
    padding: 0;
    color: inherit;
    background: none;
    border: 0;
    appearance: none;
    font: inherit;
    cursor: pointer;

    :disabled {
      cursor: initial;
    }
  }

  input {
    font: inherit;
  }

  a,
  a:hover,
  a:visited {
    color: inherit;
  }

  a {
    text-decoration: underline;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font: inherit;
  }

  /**
   * SHAME section
   * Things that doesn't have to be that way,
   * but there is no other way around it
   */

  div.grwf2-wrapper.wf2-embedded {
    z-index: ${zIndex.newsletterForm};
  }

  .MuiPopover-paper {
    z-index: ${zIndex.selectPopover};
  }
`;
