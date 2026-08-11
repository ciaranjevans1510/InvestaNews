'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { COLORS, SHADOW_STYLES } from '../../utils/colors';
import { MOCK_STORIES } from '../../utils/mockData';

interface StoriesScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

interface HomeStory {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
}

const MARKET_THEMES = [
  'Central Banks',
  'Economic Data',
  'Inflation',
  'Geopolitical',
  'Government Policy',
  'Commodities',
  'Company Action',
  'AI',
  'Market Flow',
];

const SECTORS = [
  'Macro',
  'Technology',
  'Energy',
  'Finance',
  'Healthcare',
  'Consumer',
  'Industrials',
  'Crypto',
];

const mockStories: HomeStory[] = MOCK_STORIES.map((story) => ({
  id: story.id,
  slug: story.slug,
  title: story.title,
  subtitle: story.subtitle,
  category: Math.random() > 0.5 ? MARKET_THEMES[Math.floor(Math.random() * MARKET_THEMES.length)] : SECTORS[Math.floor(Math.random() * SECTORS.length)],
}));

export const StoriesScreen: React.FC<StoriesScreenProps> = ({ onNavigate, onBack }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const surfaceColor = isDark ? COLORS.dark.surface : COLORS.light.surface;

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [stories, setStories] = useState<HomeStory[]>(mockStories);

  const filteredStories = activeFilter
    ? stories.filter((story) => story.category === activeFilter)
    : stories;

  const openStory = (slug: string) => {
    if (!slug) return;
    router.push(`/stories/${slug}`);
  };

  return (
    <div
      className="pb-24"
      style={{
        background: isDark
          ? bgColor
          : 'radial-gradient(circle at 14% 12%, rgba(31, 111, 235, 0.14) 0%, rgba(31, 111, 235, 0) 34%), radial-gradient(circle at 86% 88%, rgba(245, 166, 126, 0.2) 0%, rgba(245, 166, 126, 0) 36%), linear-gradient(180deg, #f8fbff 0%, #eaf2fd 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 pt-4 px-4 pb-4" style={{
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 251, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
      }}>
        <button
          onClick={() => onBack?.()}
          className="p-2 rounded-lg mb-4 -ml-2 transition-all hover:opacity-70"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: textColor }}>
            Explore
          </h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Browse stories by market theme or sector.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {/* Market Themes Section */}
        <div className="mt-8 mb-10">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: textSecondary }}>
            Market Themes
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth">
            <button
              onClick={() => setActiveFilter(null)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeFilter === null ? COLORS.primary : surfaceColor,
                color: activeFilter === null ? 'white' : textColor,
                border: activeFilter === null ? 'none' : `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
              }}
            >
              All
            </button>
            {MARKET_THEMES.map((theme) => (
              <button
                key={theme}
                onClick={() => setActiveFilter(theme)}
                className="flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap"
                style={{
                  backgroundColor: activeFilter === theme ? COLORS.primary : surfaceColor,
                  color: activeFilter === theme ? 'white' : textColor,
                  border: activeFilter === theme ? 'none' : `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
                }}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* Sectors Section */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: textSecondary }}>
            Sectors
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth">
            {!activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap"
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                }}
              >
                All
              </button>
            )}
            {SECTORS.map((sector) => (
              <button
                key={sector}
                onClick={() => setActiveFilter(sector)}
                className="flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap"
                style={{
                  backgroundColor: activeFilter === sector ? COLORS.primary : surfaceColor,
                  color: activeFilter === sector ? 'white' : textColor,
                  border: activeFilter === sector ? 'none' : `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
                }}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: textSecondary }}>
            Stories {activeFilter && `• ${activeFilter}`}
          </h2>

          {filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: textSecondary }} className="text-sm">
                No stories found in this category.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => openStory(story.slug)}
                  className="w-full text-left rounded-2xl p-4 transition-all hover:opacity-90 active:scale-98"
                  style={{
                    backgroundColor: surfaceColor,
                    border: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
                    boxShadow: isDark ? SHADOW_STYLES.dark.sm : SHADOW_STYLES.light.sm,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2" style={{ color: textColor }}>
                        {story.title}
                      </h3>
                      {story.subtitle && (
                        <p className="text-xs mt-1.5 line-clamp-1" style={{ color: textSecondary }}>
                          {story.subtitle}
                        </p>
                      )}
                      {story.category && (
                        <div className="mt-2.5">
                          <span
                            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(31, 111, 235, 0.12)',
                              color: isDark ? '#a5b4fc' : '#1f56e0',
                            }}
                          >
                            {story.category}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
