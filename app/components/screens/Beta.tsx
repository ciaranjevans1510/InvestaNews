'use client';

import React from 'react';
import { ArrowLeft, MessageSquare, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';

interface BetaScreenProps {
  onBack?: () => void;
  onToggleTheme?: () => void;
  onOpenInstallTutorial?: () => void;
}

export const BetaScreen: React.FC<BetaScreenProps> = ({ onBack, onToggleTheme, onOpenInstallTutorial }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f8fbff' : COLORS.light.text;
  const textSecondary = isDark ? '#b6c3de' : COLORS.light.textSecondary;
  const bgColor = isDark ? '#12151f' : COLORS.light.bg;
  const cardBackground = isDark ? '#1a1f34' : COLORS.light.surface;
  const cardBorder = isDark ? '#2f3ea8' : COLORS.light.border;

  return (
    <div
      className="pb-6 px-4"
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

      <div className="mt-4 text-center px-3">
        <h1 className="text-4xl font-bold leading-tight" style={{ color: textColor }}>
          Welcome to the
        </h1>
        <h2 className="text-4xl font-bold leading-tight mt-1" style={{ color: textColor }}>
          InvestaNews Beta 🎉
        </h2>
      </div>

      <div
        className="mt-4 rounded-3xl p-4 border"
        style={{
          backgroundColor: cardBackground,
          borderColor: cardBorder,
        }}
      >
        <p className="text-lg leading-8 text-center" style={{ color: textColor }}>
          InvestaNews is designed to help you understand the markets by showing how news shapes
          them - in a way that is simple, clear, and, <span style={{ fontWeight: 700, textDecoration: 'underline', textDecorationColor: textColor, textUnderlineOffset: '3px' }}>we hope</span>, enjoyable to explore.
        </p>
        <p className="text-lg leading-8 text-center mt-3" style={{ color: textColor }}>
          This beta is your chance to try an early version of the product and help shape how it
          evolves.
        </p>
      </div>

      <div
        className="mt-4 rounded-3xl p-4 border"
        style={{
          backgroundColor: cardBackground,
          borderColor: cardBorder,
        }}
      >
        <h3 className="text-[1.75rem] font-semibold" style={{ color: textColor }}>
          🎁 Early Supporter Reward
        </h3>
        <p className="text-lg leading-8 mt-3" style={{ color: textColor }}>
          As a thank you for being part of the beta, you&apos;ll receive lifetime access to InvestaNews
          Premium when it launches.
        </p>
        <p className="text-lg leading-8 mt-3" style={{ color: textSecondary }}>
          Right now, Premium mainly includes unlimited access to tiles, with more features and
          tools planned as the product grows. As an early supporter, you&apos;ll automatically get access
          to everything that becomes part of Premium in the future.
        </p>
      </div>

      <div
        className="mt-4 rounded-3xl p-4 border"
        style={{
          backgroundColor: cardBackground,
          borderColor: cardBorder,
        }}
      >
        <h3 className="text-[1.75rem] font-semibold flex items-center gap-2" style={{ color: textColor }}>
          <MessageSquare size={20} />
          Your Feedback Matters
        </h3>
        <p className="text-lg leading-8 mt-3" style={{ color: textColor }}>
          InvestaNews is being built in the open, and your experience will directly influence what
          comes next.
        </p>
        <p className="text-lg leading-8 mt-3" style={{ color: textColor }}>
          We&apos;d love to hear:
        </p>
        <ul className="mt-2 space-y-1.5 pl-5 text-lg" style={{ color: textSecondary }}>
          <li>what helps you better understand the market</li>
          <li>what feels unclear or confusing</li>
          <li>what would make the experience more useful or enjoyable</li>
        </ul>
        <p className="text-lg leading-8 mt-3" style={{ color: textColor }}>
          Your feedback helps refine the product and ensures early supporters get the most value.
        </p>
      </div>

      <button
        onClick={onOpenInstallTutorial}
        className="mt-4 w-full rounded-2xl px-4 py-4 text-left transition-opacity hover:opacity-90"
        style={{
          backgroundColor: isDark ? '#243463' : '#e6efff',
          border: `1px solid ${isDark ? '#4860af' : '#c5d6ff'}`,
          color: isDark ? '#eef3ff' : '#23488c',
        }}
        aria-label="Open install tutorial"
      >
        <div className="text-lg font-semibold">Install as an app on your phone</div>
        <div className="text-sm mt-1" style={{ color: isDark ? '#c6d4ff' : '#4368a8' }}>
          See iPhone and Android steps to add InvestaNews to your home screen.
        </div>
      </button>

      <p className="text-2xl mt-4 pb-1" style={{ color: textColor }}>
        Thanks for being part of the journey! 🚀
      </p>
    </div>
  );
};
