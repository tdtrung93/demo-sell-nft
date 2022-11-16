import { css } from '@emotion/react';

const weights = ['Thin', 'Light', 'Regular', 'Medium', 'Bold'];

const fontWeights = {
  Thin: 100,
  Light: 300,
  Regular: 400,
  Medium: 500,
  Bold: 700
};

const fontStyle = (weight: string) => css`
  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto/roboto-v27-${weight}.woff2') format('woff2'),
      url('/fonts/roboto/roboto-v27-${weight}.woff') format('woff');
    font-display: swap;
    font-weight: ${fontWeights[weight]};
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/fonts/roboto/roboto-v27-${weight}-italic.woff2') format('woff2'),
      url('/fonts/roboto/roboto-v27-${weight}-italic.woff') format('woff');
    font-display: swap;
    font-weight: ${fontWeights[weight]};
    font-style: italic;
  }

  @font-face {
    font-family: 'Roboto Condensed';
    src: url('/fonts/robotocondensed/roboto-condensed-v19-${weight}.woff2') format('woff2'),
      url('/fonts/robotocondensed/roboto-condensed-v19-${weight}.woff') format('woff');
    font-display: swap;
    font-weight: ${fontWeights[weight]};
  }

  @font-face {
    font-family: 'Roboto Condensed';
    src: url('/fonts/robotocondensed/roboto-condensed-v19-${weight}-italic.woff2') format('woff2'),
      url('/fonts/robotocondensed/roboto-condensed-v19-${weight}-italic.woff') format('woff');
    font-display: swap;
    font-weight: ${fontWeights[weight]};
    font-style: italic;
  }

  @font-face {
    font-family: 'Trasandina';
    src: url('/fonts/trasandina/Trasandina-W03-${weight}.woff2') format('woff2'),
      url('/fonts/trasandina/Trasandina-W03-${weight}.woff') format('woff');
    font-display: swap;
    font-weight: ${fontWeights[weight]};
  }

  @font-face {
    font-family: 'Trasandina-Italic';
    src: url('/fonts/trasandina/Trasandina-W03-${weight}-Italic.woff2') format('woff2'),
      url('/fonts/trasandina/Trasandina-W03-${weight}-Italic.woff') format('woff');
    font-display: swap;
    font-weight: ${fontWeights[weight]};
    font-style: italic;
  }
`;

export const fonts = css`
  ${weights.map((weight) => fontStyle(weight))}
`;
