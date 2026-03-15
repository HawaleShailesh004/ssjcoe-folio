"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** When image fails, show this letter in a styled fallback (e.g. name initial) */
  fallbackLetter?: string;
  /** When image fails and no fallbackLetter, render nothing (parent keeps layout) */
  hideOnError?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackLetter,
  hideOnError,
}: Props) {
  const [errored, setErrored] = useState(false);

  if (errored && fallbackLetter) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontSize: "28px",
          color: "#A8A29E",
          background: "#F5F5F4",
        }}
      >
        {fallbackLetter}
      </div>
    );
  }

  if (errored && hideOnError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
