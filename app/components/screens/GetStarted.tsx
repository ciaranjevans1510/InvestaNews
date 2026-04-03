'use client';

import React from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';

interface GetStartedScreenProps {
  onExplore?: () => void;
  onQuiz?: () => void;
  onSkip?: () => void;
}

export const GetStartedScreen: React.FC<GetStartedScreenProps> = ({ 
  onExplore, 
  onQuiz, 
  onSkip 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #1a2847 0%, #2a3f6b 50%, #1a2847 100%)',
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
      <h1 className="text-4xl font-bold text-white text-center mb-2">
        InvestaNews
      </h1>

      {/* Tagline */}
      <p className="text-lg text-center mb-12" style={{ color: '#a0aec0' }}>
        Your playful guide to stock insights
      </p>

      {/* Action Cards */}
      <div className="w-full max-w-md space-y-4 mb-8">
        {/* Explore First Card */}
        <button
          onClick={onExplore}
          className="w-full p-6 rounded-2xl border-2 flex items-start gap-4 transition-all hover:opacity-90 text-left"
          style={{
            borderColor: COLORS.primary,
            backgroundColor: 'rgba(30, 40, 70, 0.5)',
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
            <div className="text-lg font-semibold text-white">
              Explore First
            </div>
            <div style={{ color: '#8fa3c0' }}>
              Browse stocks and news
            </div>
          </div>
        </button>

        {/* Take Quiz Card */}
        <button
          onClick={onQuiz}
          className="w-full p-6 rounded-2xl border-2 flex items-start gap-4 transition-all hover:opacity-90 text-left"
          style={{
            borderColor: COLORS.primary,
            backgroundColor: 'rgba(30, 40, 70, 0.5)',
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
            <div className="text-lg font-semibold text-white">
              Take Quiz
            </div>
            <div style={{ color: '#8fa3c0' }}>
              Get personalized recommendations
            </div>
          </div>
        </button>
      </div>

      {/* Skip Button */}
      {onSkip && (
        <button
          onClick={onSkip}
          className="text-sm font-medium transition-opacity hover:opacity-75"
          style={{ color: '#8fa3c0' }}
        >
          Skip for now
        </button>
      )}
    </div>
  );
};
