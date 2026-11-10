"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  unoptimized,
  className = "",
  ...rest
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
  }, [src]);

  const isExternalOrBlob =
    typeof currentSrc === "string" &&
    (currentSrc.startsWith("http://") ||
      currentSrc.startsWith("https://") ||
      currentSrc.startsWith("/uploads/"));

  const shouldBeUnoptimized = unoptimized !== undefined ? unoptimized : isExternalOrBlob;

  if (error && !fallbackSrc) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-[var(--green-950)] text-[var(--gold-400)]/70 p-4 ${className}`}
      >
        <ImageOff className="w-8 h-8 opacity-40 mb-1 text-[var(--gold-400)]" />
        <span className="text-[11px] uppercase tracking-wider text-[var(--cream-200)]/70 text-center font-medium">
          {alt || "Dokumentasi Sahabat Aksara"}
        </span>
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={error && fallbackSrc ? fallbackSrc : currentSrc}
      alt={alt}
      unoptimized={shouldBeUnoptimized}
      className={className}
      onError={() => {
        if (!error) {
          if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          } else {
            setError(true);
          }
        }
      }}
    />
  );
}

