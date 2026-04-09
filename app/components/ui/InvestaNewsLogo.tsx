'use client';

import React from 'react';

interface InvestaNewsLogoProps {
  textColor?: string;
  newsOpacity?: number;
  className?: string;
}

export const InvestaNewsLogo: React.FC<InvestaNewsLogoProps> = ({
  textColor = '#ffffff',
  newsOpacity = 0.7,
  className,
}) => {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: textColor }}>
      <svg width="76" height="44" viewBox="0 0 156 72" fill="none" aria-hidden="true">
        <line x1="6" y1="58" x2="70" y2="58" stroke="#1aa7e8" strokeWidth="6" strokeLinecap="round" />
        <line x1="56" y1="18" x2="120" y2="18" stroke="#1aa7e8" strokeWidth="6" strokeLinecap="round" />
        <line x1="44" y1="54" x2="76" y2="14" stroke="#1aa7e8" strokeWidth="7" strokeLinecap="round" />

        <polyline
          points="48,54 76,14 108,46 140,6"
          stroke="#0f172a"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.18"
          transform="translate(1.5 1.5)"
        />
        <polyline
          points="48,54 76,14 108,46 140,6"
          stroke="#3f51d9"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="text-3xl font-semibold leading-none">
        <span className="font-bold">Investa</span>
        <span style={{ opacity: newsOpacity }}>News</span>
      </span>
    </div>
  );
};