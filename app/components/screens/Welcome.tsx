'use client';

import React from 'react';
import { TrendingUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { InvestaNewsLogo } from '../ui/InvestaNewsLogo';
import { COLORS } from '../../utils/colors';

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onSignIn }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const pageBackground = isDark
    ? 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)'
    : 'radial-gradient(circle at 14% 12%, rgba(31, 111, 235, 0.14) 0%, rgba(31, 111, 235, 0) 34%), radial-gradient(circle at 86% 88%, rgba(245, 166, 126, 0.2) 0%, rgba(245, 166, 126, 0) 36%), linear-gradient(180deg, #f8fbff 0%, #eaf2fd 100%)';
  const titleColor = isDark ? '#ffffff' : COLORS.light.text;
  const subtitleColor = isDark ? '#a0aec0' : COLORS.light.textSecondary;
  const helperColor = isDark ? '#90a0bf' : '#4c668c';
  const footerColor = isDark ? '#6a7a8f' : '#6a7f9f';

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        background: pageBackground,
      }}
    >
      {/* Icon Circle */}
      <div className="mb-12">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)`,
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
          }}
        >
          <TrendingUp size={64} color="white" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <div className="mb-3 flex justify-center">
        <InvestaNewsLogo textColor={titleColor} newsOpacity={0.72} />
      </div>

      {/* Tagline */}
      <p className="text-lg text-center mb-12" style={{ color: subtitleColor }}>
        Your playful guide to stock insights
      </p>

      {/* Theme Selection */}
      <div className="w-full max-w-md mb-8">
        <p
          className="text-center text-base mb-4"
          style={{ color: helperColor }}
        >
          Choose your style
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (theme === 'dark') toggleTheme();
            }}
            className="flex-1 py-4 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-medium"
            style={{
              borderColor: theme === 'light' ? COLORS.primary : '#4a5a7a',
              backgroundColor: theme === 'light' ? `${COLORS.primary}20` : (isDark ? 'transparent' : '#f3f8ff'),
              color: theme === 'light' ? COLORS.light.text : subtitleColor,
            }}
          >
            <Sun size={24} />
            Light
          </button>

          <button
            onClick={() => {
              if (theme === 'light') toggleTheme();
            }}
            className="flex-1 py-4 px-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 font-medium"
            style={{
              borderColor: theme === 'dark' ? COLORS.primary : '#4a5a7a',
              backgroundColor: theme === 'dark' ? `${COLORS.primary}20` : (isDark ? 'transparent' : '#f3f8ff'),
              color: theme === 'dark' ? 'white' : subtitleColor,
            }}
          >
            <Moon size={24} />
            Dark
          </button>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        onClick={onGetStarted}
        className="w-full max-w-md py-4 px-6 rounded-full font-semibold text-lg text-white transition-all hover:opacity-90"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, #7c7cff)`,
          boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
        }}
      >
        Get Started
      </button>

      <p className="text-sm mt-5" style={{ color: helperColor }}>
        Already have an account?{' '}
        <button onClick={onSignIn} className="font-semibold" style={{ color: isDark ? '#a0b0ff' : '#335ea8' }}>
          Sign in
        </button>
      </p>

      {/* Footer Text */}
      <p
        className="text-xs text-center mt-8"
        style={{ color: footerColor }}
      >
        For informational purposes only. Not financial advice.
      </p>
    </div>
  );
};
