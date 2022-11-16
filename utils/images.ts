// Image
import { StaticImport } from '@typings/NextImage';
import { includes } from 'lodash';

export function getImageUrl(path?: string, hostname?: string) {
  if (!path) return '/empty-img.svg';

  if (/^https?:\/\//i.test(path)) return path;

  return (hostname || process.env.NEXT_PUBLIC_IMAGE_URL) + path.replace(/^\//, '');
}

export function useUnOptimizedImage(url: string | StaticImport) {
  const domains = String(process.env.NEXT_PUBLIC_OPTIMIZED_IMAGE_DOMAINS).split(',');

  return /^https?:\/\//i.test(url as string) && !domains.some((domain) => includes(url as string, domain));
}
