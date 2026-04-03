'use client';

import React from 'react';
import { TrendingUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted, onSignIn }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)',
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
      <h1 className="text-5xl font-bold text-white text-center mb-3">
        InvestaNews
      </h1>

      {/* Tagline */}
      <p className="text-lg text-center mb-12" style={{ color: '#a0aec0' }}>
        Your playful guide to stock insights
      </p>

      {/* Theme Selection */}
      <div className="w-full max-w-md mb-8">
        <p
          className="text-center text-base mb-4"
          style={{ color: '#90a0bf' }}
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
              backgroundColor: theme === 'light' ? `${COLORS.primary}20` : 'transparent',
              color: theme === 'light' ? 'white' : '#a0aec0',
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
              backgroundColor: theme === 'dark' ? `${COLORS.primary}20` : 'transparent',
              color: theme === 'dark' ? 'white' : '#a0aec0',
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

      <p className="text-sm mt-5" style={{ color: '#90a0bf' }}>
        Already have an account?{' '}
        <button onClick={onSignIn} className="font-semibold" style={{ color: '#a0b0ff' }}>
          Sign in
        </button>
      </p>

      {/* Footer Text */}
      <p
        className="text-xs text-center mt-8"
        style={{ color: '#6a7a8f' }}
      >
        For informational purposes only. Not financial advice.
      </p>
    </div>
  );
};
