import React from "react";

export interface IslamicCornerOrnamentProps {
  className?: string;
  size?: number;
}

/**
 * Islamic Corner Arabesque Ornament (Tazhib / Sacred Geometry Flourish)
 * Displays an intricate gold corner bracket with 8-pointed star rosette and geometric lines.
 */
export default function IslamicCornerOrnament({
  className = "",
  size = 120,
}: IslamicCornerOrnamentProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer corner frame with traditional curve */}
      <path
        d="M6 114V28C6 15.8497 15.8497 6 28 6H114"
        stroke="var(--gold-400)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 114V36C16 24.9543 24.9543 16 36 16H114"
        stroke="var(--gold-500)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeDasharray="4 3"
      />
      <path
        d="M24 114V42C24 32.0589 32.0589 24 42 24H114"
        stroke="var(--gold-400)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />

      {/* Corner Khatam (8-pointed star rosette) */}
      <circle cx="36" cy="36" r="14" stroke="var(--gold-400)" strokeWidth="1" strokeOpacity="0.7" />
      <circle cx="36" cy="36" r="9" stroke="var(--gold-500)" strokeWidth="0.75" strokeOpacity="0.5" />
      {/* 8-Pointed Star Points */}
      <polygon
        points="36,25 38.5,33 46,31 41,36 46,41 38.5,39 36,47 33.5,39 26,41 31,36 26,31 33.5,33"
        fill="var(--gold-400)"
        fillOpacity="0.4"
        stroke="var(--gold-300)"
        strokeWidth="0.75"
      />
      <circle cx="36" cy="36" r="2.5" fill="var(--gold-300)" />

      {/* Decorative Finial Dots on Terminal Ends */}
      <circle cx="114" cy="6" r="2.5" fill="var(--gold-400)" />
      <circle cx="6" cy="114" r="2.5" fill="var(--gold-400)" />
      <circle cx="114" cy="16" r="1.5" fill="var(--gold-500)" />
      <circle cx="16" cy="114" r="1.5" fill="var(--gold-500)" />
      <circle cx="114" cy="24" r="1.2" fill="var(--gold-400)" />
      <circle cx="24" cy="114" r="1.2" fill="var(--gold-400)" />

      {/* Interlaced Diagonal Diamond Accent */}
      <rect
        x="64"
        y="6"
        width="10"
        height="10"
        transform="rotate(45 64 6)"
        stroke="var(--gold-400)"
        strokeWidth="0.8"
        fill="none"
      />
      <rect
        x="6"
        y="64"
        width="10"
        height="10"
        transform="rotate(45 6 64)"
        stroke="var(--gold-400)"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  );
}

