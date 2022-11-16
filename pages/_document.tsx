import { renderStatic } from '@utils/emotionRenderer';
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import React, { ReactNode } from 'react';

const MVPDocument = (): ReactNode => {
  return (
    <Html>
      <Head>
        <meta name="theme-color" content="#fff" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
      </Head>
      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
};

MVPDocument.getInitialProps = async (ctx: DocumentContext) => {
  const page = await ctx.renderPage();
  const { css, ids } = await renderStatic(page.html);
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style data-emotion={`css ${ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: css }} />
      </>
    )
  };
};

// MVPDocument.renderDocument = Document.renderDocument;

export default MVPDocument;
