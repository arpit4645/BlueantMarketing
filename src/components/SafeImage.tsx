import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface SafeImageProps extends HTMLMotionProps<'img'> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80&auto=format&fit=crop';

export default function SafeImage({ fallbackSrc = DEFAULT_FALLBACK, src, alt, className, ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [failed, setFailed] = useState(false);

  return (
    <motion.img
      {...props}
      src={currentSrc}
      alt={alt}
      referrerPolicy={props.referrerPolicy || 'no-referrer'}
      className={className}
      onError={(event) => {
        if (!failed) {
          setFailed(true);
          setCurrentSrc(fallbackSrc);
          return;
        }
        props.onError?.(event);
      }}
    />
  );
}
