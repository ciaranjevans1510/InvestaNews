'use client';

import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { Card, Button } from '../ui/Basic';
import { StockCard } from '../ui/Cards';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';
import { MOCK_STORIES } from '../../utils/mockData';

interface StoriesScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

export const StoriesScreen: React.FC<StoriesScreenProps> = ({ onNavigate, onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  const [currentStory] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  const story = MOCK_STORIES[currentStory];
  const slide = story.slides[currentSlide];

  const handleNextSlide = () => {
    if (currentSlide < story.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slideTypeLabels = {
    'hook': '💡 Hook',
    'what-happened': '📰 What Happened',
    'why-it-matters': '🎯 Why It Matters',
    'key-movers': '📊 Key Movers',
    'bigger-picture': '🌍 Bigger Picture',
    'what-to-watch': '👀 What to Watch',
    'explore': '🔍 Explore',
  };

  return (
    <div
      className="pb-24"
      style={{
        backgroundColor: bgColor,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-start sticky top-0 z-10" style={{
        backgroundColor: bgColor,
        borderBottom: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
      }}>
        <div>
          <button
            onClick={() => {
              if (onBack) {
                onBack();
                return;
              }
              onNavigate?.('home');
            }}
            className="p-1 rounded-lg -ml-1 mb-2"
            style={{ color: textSecondary }}
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-sm" style={{ color: textSecondary }}>
            Story {currentStory + 1} • Slide {currentSlide + 1} of {story.slides.length}
          </div>
          <h1 className="text-xl font-bold" style={{ color: textColor }}>
            {story.title}
          </h1>
        </div>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="p-2 rounded-lg"
          style={{
            backgroundColor: bookmarked ? COLORS.primary + '20' : isDark ? COLORS.dark.surface : COLORS.light.surface,
          }}
        >
          <Bookmark
            size={20}
            fill={bookmarked ? COLORS.primary : 'none'}
            color={bookmarked ? COLORS.primary : textSecondary}
          />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4 mb-6">
        <div className="flex gap-1">
          {story.slides.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 rounded-full"
              style={{
                backgroundColor: index <= currentSlide ? COLORS.primary : isDark ? COLORS.dark.border : COLORS.light.border,
              }}
            />
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="px-4 mb-6">
        <Card className="p-6 mb-4">
          <div className="text-sm font-bold mb-2" style={{ color: COLORS.primary }}>
            {slideTypeLabels[slide.slideType as keyof typeof slideTypeLabels]}
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
            {slide.title}
          </h2>
          <p className="text-base" style={{ color: textSecondary }}>
            {slide.content}
          </p>
        </Card>

        {/* Stocks */}
        {slide.stocks && slide.stocks.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-bold mb-3" style={{ color: textColor }}>
              Related Stocks
            </div>
            {slide.stocks.map(stock => (
              <StockCard key={stock.id} stock={stock} compact size="sm" />
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 flex gap-3 mb-24">
        <Button
          onClick={handlePrevSlide}
          variant="secondary"
          className="flex-1 flex items-center justify-center gap-2"
          disabled={currentSlide === 0}
        >
          <ChevronUp size={20} />
          Previous
        </Button>
        <Button
          onClick={handleNextSlide}
          variant="primary"
          className="flex-1 flex items-center justify-center gap-2"
          disabled={currentSlide === story.slides.length - 1}
        >
          Next
          <ChevronDown size={20} />
        </Button>
      </div>
    </div>
  );
};
