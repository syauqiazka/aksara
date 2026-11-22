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
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
  }, [src, retryCount]);

  const isExternalOrBlob =
    typeof currentSrc === "string" &&
    (currentSrc.startsWith("http://") ||
      currentSrc.startsWith("https://") ||
      currentSrc.startsWith("/uploads/") ||
      currentSrc.startsWith("blob:"));

  const shouldBeUnoptimized = unoptimized !== undefined ? unoptimized : isExternalOrBlob;

  const isInvalidUrl =
    !currentSrc ||
    (typeof currentSrc === "string" &&
      (currentSrc.trim() === "" || currentSrc.includes("placeholder.internal")));

  if ((isInvalidUrl || error) && !fallbackSrc) {
    return (
      <div
        className={`w-full h-full min-h-[64px] flex flex-col items-center justify-center bg-[var(--cream-100)] border border-[var(--cream-300)] text-[var(--ink-600)] p-2 rounded-xl text-center select-none ${className}`}
      >
        <ImageOff className="w-5 h-5 text-[var(--ink-400)] mb-1" />
        <span className="text-[10px] text-[var(--ink-600)] font-medium line-clamp-1 max-w-[90%]">
          {alt || "Foto"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setError(false);
            setRetryCount((c) => c + 1);
          }}
          className="text-[9px] font-semibold text-[var(--gold-700)] hover:underline mt-1 cursor-pointer"
        >
          Muat Ulang
        </button>
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

