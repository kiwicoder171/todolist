import React from "react";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  inverted?: boolean;
}

export function Logo({
  size = 36,
  className = "",
  inverted = false,
  ...props
}: LogoProps) {
  const strokeColor = inverted ? "#FFFFFF" : "currentColor";
  const fillColor = inverted ? "#FFFFFF" : "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Couple Task Hub Logo"
      {...props}
    >
      {/* Outer Squircle Ring (Hub Boundary) */}
      <rect
        x="13"
        y="13"
        width="74"
        height="74"
        rx="26"
        stroke={strokeColor}
        strokeWidth="4.5"
        strokeDasharray="9 6"
      />
      {/* Partner 1 Heart (Top-Left) */}
      <path
        d="M 32 30 C 32 25, 27 22, 24 24 C 20 27, 21 32, 25 37 L 32 43 L 39 37 C 43 32, 44 27, 40 24 C 37 22, 32 25, 32 30 Z"
        fill={fillColor}
      />
      {/* Partner 2 Heart (Bottom-Right) */}
      <path
        d="M 68 66 C 68 61, 63 58, 60 60 C 56 63, 57 68, 61 73 L 68 79 L 75 73 C 79 68, 80 63, 76 60 C 73 58, 68 61, 68 66 Z"
        fill={fillColor}
      />
      {/* Bold Central Checkmark of Unity (Exact 45° Snapped Lines) */}
      <path
        d="M 28 54 L 44 70 L 80 34"
        stroke={strokeColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
