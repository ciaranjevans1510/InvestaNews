'use client';

import React from 'react';
import { ArrowLeft, Moon, Smartphone, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';

interface InstallTutorialScreenProps {
  onBack?: () => void;
  onToggleTheme?: () => void;
}

export const InstallTutorialScreen: React.FC<InstallTutorialScreenProps> = ({ onBack, onToggleTheme }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f8fbff' : COLORS.light.text;
  const textSecondary = isDark ? '#b6c3de' : COLORS.light.textSecondary;
  const bgColor = isDark ? '#12151f' : COLORS.light.bg;
  const cardBackground = isDark ? '#1a1f34' : COLORS.light.surface;
  const cardBorder = isDark ? '#2f3ea8' : COLORS.light.border;

  return (
    <div
      className="pb-8 px-4"
      style={{
        backgroundColor: bgColor,
        minHeight: '100vh',
      }}
    >
      <div className="pt-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: isDark ? '#23273a' : '#e3ebf8',
            border: `1px solid ${isDark ? '#38438a' : '#c8d8ee'}`,
            color: isDark ? '#d7e0ff' : '#3558a8',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={17} />
        </button>

        <button
          onClick={onToggleTheme}
          className="h-9 w-9 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: isDark ? '#23273a' : '#e3ebf8',
            border: `1px solid ${isDark ? '#38438a' : '#c8d8ee'}`,
            color: isDark ? '#d7e0ff' : '#3558a8',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="mt-4 text-center px-2">
        <h1 className="text-3xl font-bold leading-tight" style={{ color: textColor }}>
          Add InvestaNews to your Home Screen
        </h1>
        <p className="text-base mt-2" style={{ color: textSecondary }}>
          Install it like an app for quick access during the beta.
        </p>
      </div>

      <div
        className="mt-4 rounded-3xl p-4 border"
        style={{
          backgroundColor: cardBackground,
          borderColor: cardBorder,
        }}
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: textColor }}>
          <Smartphone size={20} />
          iPhone (Safari)
        </h2>
        <ol className="mt-3 space-y-2 text-base list-decimal pl-5" style={{ color: textColor }}>
          <li>Open InvestaNews in Safari.</li>
          <li>Tap the Share icon at the bottom of the screen.</li>
          <li>Scroll and tap Add to Home Screen.</li>
          <li>Tap Add in the top-right corner.</li>
        </ol>
      </div>

      <div
        className="mt-4 rounded-3xl p-4 border"
        style={{
          backgroundColor: cardBackground,
          borderColor: cardBorder,
        }}
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: textColor }}>
          <Smartphone size={20} />
          Android (Chrome)
        </h2>
        <ol className="mt-3 space-y-2 text-base list-decimal pl-5" style={{ color: textColor }}>
          <li>Open InvestaNews in Chrome.</li>
          <li>Tap the three-dot menu in the top-right.</li>
          <li>Tap Add to Home screen or Install app.</li>
          <li>Confirm by tapping Install or Add.</li>
        </ol>
      </div>

      <div
        className="mt-4 rounded-2xl p-4 border"
        style={{
          backgroundColor: isDark ? '#18253f' : '#eef5ff',
          borderColor: isDark ? '#2d4e89' : '#c5daf8',
        }}
      >
        <p className="text-sm" style={{ color: textSecondary }}>
          Tip: if your browser does not show install options yet, refresh the page once and try again.
        </p>
      </div>
    </div>
  );
};
