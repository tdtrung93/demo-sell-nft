import { useUnOptimizedImage } from '@utils/images';
import NextImage, { ImageProps } from 'next/image';
import React from 'react';

function Image(props: ImageProps) {
  return <NextImage unoptimized={useUnOptimizedImage(props.src)} {...props} />;
}

export default Image;
