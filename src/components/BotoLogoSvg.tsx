import React from 'react';

interface BotoLogoSvgProps {
  className?: string;
}

/**
 * Vector emblem inspired by the official Bototech branding (Rosa Boto #FF4D6D -> Azul Turquesa #06B6D4)
 * combining digital speed lines, the "B" track, and the leaping dolphin (boto).
 */
export const BotoLogoSvg: React.FC<BotoLogoSvgProps> = ({ className = 'w-10 h-10' }) => {
  const uid = React.useId().replace(/:/g, '');
  const brandGradId = `botoBrandGrad-${uid}`;
  const linesGradId = `botoLinesGrad-${uid}`;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={brandGradId} x1="10" y1="95" x2="110" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="48%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id={linesGradId} x1="25" y1="100" x2="95" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Digital Speed Lines & Particles on Left (Rosa Boto) */}
      <line x1="16" y1="36" x2="36" y2="36" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="10" cy="36" r="2.2" fill="#FF4D6D" />
      <line x1="12" y1="46" x2="30" y2="46" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="18" y1="56" x2="28" y2="56" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="11" cy="56" r="2" fill="#FF4D6D" />
      <line x1="14" y1="66" x2="25" y2="66" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="18" y1="76" x2="26" y2="76" stroke="#FF4D6D" strokeWidth="3.5" strokeLinecap="round" />

      {/* Geometric Stylized 'B' Multi-Line Track (Turquesa & Gradient) */}
      <path
        d="M46 58 H68 C80 58 88 66 88 77 C88 89 79 97 66 97 H44 V68"
        stroke={`url(#${linesGradId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M52 64 H67 C75 64 81 69 81 77 C81 85 75 90 66 90 H50 V72"
        stroke="#06B6D4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />

      {/* Leaping Boto (Dolphin) Silhouette */}
      <path
        d="M24 98 C28 90 30 80 31 70 C32 48 48 28 70 25 C67 20 61 17 55 17 C65 14 76 17 83 24 C93 26 102 32 106 39 C111 41 114 43 114 46 C114 49 108 49 102 48 C93 46 84 48 76 53 C79 58 76 64 70 66 C69 61 66 57 62 55 C50 61 43 74 41 88 C45 91 50 96 52 101 C45 100 39 97 35 93 C31 97 26 100 20 101 C21 99 22 98 24 98 Z"
        stroke={`url(#${brandGradId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(6, 182, 212, 0.08)"
      />

      {/* Eye */}
      <circle cx="94" cy="39" r="2.4" fill="#06B6D4" />
    </svg>
  );
};
