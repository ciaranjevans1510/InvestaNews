'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Basic';
import { ProgressBar } from '../ui/Navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';

interface OnboardingScreenProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Discover Stocks Easily',
    description: 'Browse through a curated selection of stocks with crystal clear metrics and trends.',
    icon: '📈',
  },
  {
    id: 2,
    title: 'Read Market Stories',
    description: 'Understand the why behind market movements through editorial content.',
    icon: '📰',
  },
  {
    id: 3,
    title: 'Earn Rewards',
    description: 'Complete daily tasks and build streaks to unlock exclusive features.',
    icon: '🎁',
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onSkip }) => {
  const { theme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  const slide = ONBOARDING_SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <ProgressBar progress={currentSlide + 1} total={ONBOARDING_SLIDES.length} />
      </div>

      {/* Icon */}
      <div className="text-6xl mb-6">{slide.icon}</div>

      {/* Content */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
          {slide.title}
        </h1>
        <p className="text-lg" style={{ color: textSecondary }}>
          {slide.description}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 w-full max-w-md">
        <Button
          onClick={handlePrev}
          variant="secondary"
          className="flex-1"
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          className="flex-1"
        >
          {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Skip */}
      <button
        onClick={onSkip}
        className="mt-6 text-sm"
        style={{ color: COLORS.primary }}
      >
        Skip for now
      </button>
    </div>
  );
};
