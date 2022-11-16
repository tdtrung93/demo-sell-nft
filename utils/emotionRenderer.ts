import createCache from '@emotion/cache';
import createEmotionServer from '@emotion/server/create-instance';

const key = 'custom';
const cache = createCache({ key });

export const renderStatic = async (
  html: string
): Promise<{
  html: string;
  ids: string[];
  css: string;
}> => {
  if (html === undefined) {
    throw new Error('did you forget to return html from renderToString?');
  }
  const { extractCritical } = createEmotionServer(cache);
  const { ids, css } = extractCritical(html);

  return { html, ids, css };
};
