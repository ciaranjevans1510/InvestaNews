'use client';

import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { InvestaNewsLogo } from '../ui/InvestaNewsLogo';
import { COLORS } from '../../utils/colors';

interface GetStartedScreenProps {
  onExplore?: () => void;
  onGuidedTour?: () => void;
}

export const GetStartedScreen: React.FC<GetStartedScreenProps> = ({ 
  onExplore, 
  onGuidedTour
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pageBackground = isDark
    ? 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)'
    : 'radial-gradient(circle at 14% 12%, rgba(31, 111, 235, 0.14) 0%, rgba(31, 111, 235, 0) 34%), radial-gradient(circle at 86% 88%, rgba(245, 166, 126, 0.2) 0%, rgba(245, 166, 126, 0) 36%), linear-gradient(180deg, #f8fbff 0%, #eaf2fd 100%)';
  const titleColor = isDark ? '#ffffff' : COLORS.light.text;
  const subtitleColor = isDark ? '#a0aec0' : COLORS.light.textSecondary;
  const cardBackground = isDark ? 'rgba(30, 40, 70, 0.5)' : '#f3f8ff';
  const cardTitleColor = isDark ? '#ffffff' : COLORS.light.text;
  const cardSubtitleColor = isDark ? '#8fa3c0' : '#5a769f';

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        background: pageBackground,
      }}
    >
      {/* Icon Circle */}
      <div className="mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)`,
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
          }}
        >
          <TrendingUp size={48} color="white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <div className="mb-2 flex justify-center">
        <InvestaNewsLogo textColor={titleColor} newsOpacity={0.72} />
      </div>

      {/* Tagline */}
      <p className="text-lg text-center mb-12" style={{ color: subtitleColor }}>
        Welcome! Select one of the options below to get started.
      </p>

      {/* Action Cards */}
      <div className="w-full max-w-md space-y-4 mb-8">
        {/* Explore Solo Card */}
        <button
          onClick={onExplore}
          className="w-full p-6 rounded-2xl border-2 flex items-start gap-4 transition-all hover:opacity-90 text-left"
          style={{
            borderColor: COLORS.primary,
            backgroundColor: cardBackground,
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)`,
            }}
          >
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <div className="text-lg font-semibold" style={{ color: cardTitleColor }}>
              Explore by Yourself
            </div>
            <div style={{ color: cardSubtitleColor }}>
              Jump straight in and browse at your own pace
            </div>
          </div>
        </button>

        {/* Guided Tooltip Tour Card */}
        <button
          onClick={onGuidedTour}
          className="w-full p-6 rounded-2xl border-2 flex items-start gap-4 transition-all hover:opacity-90 text-left"
          style={{
            borderColor: COLORS.primary,
            backgroundColor: cardBackground,
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #ff8fb3)',
            }}
          >
            <TrendingUp size={24} color="white" />
          </div>
          <div>
            <div className="text-lg font-semibold" style={{ color: cardTitleColor }}>
              Continue with Tooltips
            </div>
            <div style={{ color: cardSubtitleColor }}>
              Get a quick guided walkthrough of the home screen
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
