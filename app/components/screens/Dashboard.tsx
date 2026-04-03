'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, X, Compass, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';
import { MOCK_STORIES } from '../../utils/mockData';
import { getStockLogoFallback, getStockLogoUrl } from '../../utils/stockLogos';
import type { Stock } from '../../types';

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
  onSelectStock?: (stock: Stock, adjacentStocks?: Stock[]) => void;
}

interface HomeStory {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
}

interface StoriesResponse {
  stories?: HomeStory[];
  recommendedStories?: HomeStory[];
}

const MAX_HOME_STORIES = 8;
const DAILY_STORY_TITLE = 'today in 60 seconds';

const fallbackHomeStories: HomeStory[] = MOCK_STORIES.map((story) => ({
  id: story.id,
  slug: story.slug,
  title: story.title,
  subtitle: story.subtitle,
}));

const mergeStories = (dbStories: HomeStory[]): HomeStory[] => {
  const seen = new Set<string>();
  const merged: HomeStory[] = [];

  for (const story of [...dbStories, ...fallbackHomeStories]) {
    if (!story?.slug || seen.has(story.slug)) continue;
    seen.add(story.slug);
    merged.push(story);
    if (merged.length >= MAX_HOME_STORIES) break;
  }

  const dailyStories = merged.filter(
    (story) => story.title?.trim().toLowerCase() === DAILY_STORY_TITLE,
  );
  const otherStories = merged.filter(
    (story) => story.title?.trim().toLowerCase() !== DAILY_STORY_TITLE,
  );

  return [...dailyStories, ...otherStories];
};

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onSelectStock }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { favourites, removeFavourite, favouriteTileCount, tutorialCompleted } = useAppContext();
  const [stories, setStories] = useState<HomeStory[]>(fallbackHomeStories);
  const [recommendedStories, setRecommendedStories] = useState<HomeStory[]>([]);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('all');
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const surfaceColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const preferredTickerQuery = favourites
    .map((favorite) => favorite.stock.symbol)
    .filter(Boolean)
    .join(',');
  const hasRecommendationSignals = favourites.length > 0 || tutorialCompleted;

  // Create visible favorite tiles based on the user's purchased capacity.
  const favoriteSlots = Array(favouriteTileCount).fill(null).map((_, index) => favourites[index]);

  const handleRemoveStock = (stockId: string) => {
    removeFavourite(stockId);
  };

  const handleOpenStock = (stock: Stock) => {
    const favouriteStocks = favourites.map((favorite) => favorite.stock);
    if (onSelectStock) {
      onSelectStock(stock, favouriteStocks);
      return;
    }
    onNavigate?.('search');
  };

  useEffect(() => {
    let isMounted = true;

    const loadStories = async () => {
      try {
        const endpoint = preferredTickerQuery
          ? `/api/stories?tickers=${encodeURIComponent(preferredTickerQuery)}`
          : '/api/stories';
        const response = await fetch(endpoint, {
          cache: 'no-store',
        });

        if (!response.ok) return;

        const payload = (await response.json()) as StoriesResponse;
        const dbStories = Array.isArray(payload?.stories) ? payload.stories : [];
        const nextRecommendedStories = Array.isArray(payload?.recommendedStories)
          ? payload.recommendedStories
          : [];

        if (isMounted) {
          setStories(mergeStories(dbStories as HomeStory[]));
          setRecommendedStories(nextRecommendedStories);
        }
      } catch {
        // Keep the fallback stories already set in initial state.
      }
    };

    loadStories();

    return () => {
      isMounted = false;
    };
  }, [preferredTickerQuery]);

  const openStory = (slug: string) => {
    router.push(`/stories/${slug}`);
  };

  return (
    <div
      className="pb-10 px-4"
      style={{
        backgroundColor: bgColor,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="pt-5 pb-6 flex justify-between items-start">
        <div>
          <div className="text-4xl font-bold leading-tight" style={{ color: textColor }}>
            InvestaNews
          </div>
          <div className="text-sm mt-1" style={{ color: textSecondary }}>
            Understand the market.
          </div>
        </div>
      </div>

      {/* Stories Tabs */}
      <div className="flex gap-1 mb-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className="px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: activeTab === 'all' ? surfaceColor : (isDark ? '#3c3f44' : '#dbe7f5'),
            color: textColor,
            borderBottom: activeTab === 'all' ? 'none' : `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
          }}
        >
          All Stories
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className="px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: activeTab === 'recommended' ? surfaceColor : (isDark ? '#3c3f44' : '#dbe7f5'),
            color: textColor,
            borderBottom: activeTab === 'recommended' ? 'none' : `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
          }}
        >
          Recommended
        </button>
      </div>

      {/* Stories Container */}
      <div className="rounded-b-lg mb-5 overflow-hidden"
        style={{ backgroundColor: surfaceColor }}
      >
        <div className="p-4">
          {activeTab === 'recommended' && !hasRecommendationSignals && (
            <div
              className="rounded-2xl border px-4 py-5"
              style={{
                backgroundColor: isDark ? '#2d2e31' : '#f4f8fe',
                borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
              }}
            >
              <div className="text-base font-semibold" style={{ color: textColor }}>
                Unlock personalized stories
              </div>
              <p className="text-sm mt-2" style={{ color: textSecondary }}>
                Add stocks to your favourites or complete the quiz to get recommendations tailored to you.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onNavigate?.('search')}
                  className="px-3 py-2 rounded-full text-sm font-medium"
                  style={{ backgroundColor: COLORS.primary, color: 'white' }}
                >
                  Add favourites
                </button>
                <button
                  onClick={() => onNavigate?.('quiz')}
                  className="px-3 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: 'transparent',
                    color: textColor,
                    border: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
                  }}
                >
                  Take quiz
                </button>
              </div>
            </div>
          )}

          {activeTab === 'recommended' && hasRecommendationSignals && recommendedStories.length > 0 && (
            <>
              <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {recommendedStories.map((story) => (
                  <button
                    key={`recommended-${story.id}`}
                    onClick={() => openStory(story.slug)}
                    className="rounded-2xl border text-left flex-shrink-0 px-4 py-5 transition-all hover:opacity-90"
                    style={{
                      width: '178px',
                      minHeight: '210px',
                      backgroundColor: isDark ? '#2d2e31' : '#f4f8fe',
                      borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                    }}
                  >
                    <div className="h-full flex flex-col justify-end">
                      <div
                        className="text-xl leading-tight font-semibold"
                        style={{ color: textColor }}
                      >
                        {story.title}
                      </div>
                      {story.subtitle && (
                        <div
                          className="text-xs mt-2 leading-relaxed"
                          style={{ color: textSecondary }}
                        >
                          {story.subtitle}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div
                className="mt-3 rounded-[2rem] p-5 border"
                style={{
                  background: 'linear-gradient(140deg, #dcebff 0%, #edf5ff 100%)',
                  borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                }}
              >
                <p className="text-base font-semibold" style={{ color: '#12345f' }}>
                  Find your perfect stocks 🎯
                </p>
                <p className="text-sm mt-1" style={{ color: '#32517d' }}>
                  Take the quiz and we'll match stories to what you actually care about.
                </p>
                <button
                  onClick={() => onNavigate?.('quiz')}
                  className="mt-4 w-full rounded-full py-3 text-base font-medium"
                  style={{
                    background: 'linear-gradient(140deg, #185dc9 0%, #2f87ed 100%)',
                    color: 'white',
                  }}
                >
                  Let's go →
                </button>
              </div>
            </>
          )}

          {activeTab === 'recommended' && hasRecommendationSignals && recommendedStories.length === 0 && (
            <div className="space-y-3">
              <div
                className="rounded-2xl border px-4 py-5"
                style={{
                  backgroundColor: isDark ? '#2d2e31' : '#f4f8fe',
                  borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                }}
              >
                <div className="text-base font-semibold" style={{ color: textColor }}>
                  We are learning your preferences
                </div>
                <p className="text-sm mt-2" style={{ color: textSecondary }}>
                  Add more favourite stocks to improve recommendations.
                </p>
              </div>
              <div
                className="rounded-[2rem] p-5 border"
                style={{
                  background: 'linear-gradient(140deg, #dcebff 0%, #edf5ff 100%)',
                  borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                }}
              >
                <p className="text-base font-semibold" style={{ color: '#12345f' }}>
                  Find your perfect stocks 🎯
                </p>
                <p className="text-sm mt-1" style={{ color: '#32517d' }}>
                  Take the quiz and we'll match stories to what you actually care about.
                </p>
                <button
                  onClick={() => onNavigate?.('quiz')}
                  className="mt-4 w-full rounded-full py-3 text-base font-medium"
                  style={{
                    background: 'linear-gradient(140deg, #185dc9 0%, #2f87ed 100%)',
                    color: 'white',
                  }}
                >
                  Let's go →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'all' && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {stories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => openStory(story.slug)}
                  className="rounded-2xl border text-left flex-shrink-0 px-4 py-5 transition-all hover:opacity-90"
                  style={{
                    width: '178px',
                    minHeight: '235px',
                    backgroundColor: isDark ? '#2d2e31' : '#f4f8fe',
                    borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                  }}
                >
                  <div className="h-full flex flex-col justify-end">
                    <div
                      className="text-xl leading-tight font-semibold"
                      style={{ color: textColor }}
                    >
                      {story.title}
                    </div>
                    {story.subtitle && (
                      <div
                        className="text-xs mt-2 leading-relaxed"
                        style={{ color: textSecondary }}
                      >
                        {story.subtitle}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm" style={{ color: textSecondary }}>
          Major business and market updates
        </p>
      </div>

      {/* Quick navigation */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => onNavigate?.('discover')}
          className="flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 transition-all hover:opacity-80"
          style={{ backgroundColor: surfaceColor }}
        >
          <Compass size={18} color={COLORS.primary} />
          <span className="text-sm font-medium" style={{ color: textColor }}>Explore</span>
        </button>
        <button
          onClick={() => onNavigate?.('rewards')}
          className="flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 transition-all hover:opacity-80"
          style={{ backgroundColor: surfaceColor }}
        >
          <Trophy size={18} color={COLORS.primary} />
          <span className="text-sm font-medium" style={{ color: textColor }}>Rewards</span>
        </button>
      </div>

      {/* Favourites Label */}
      <div className="mb-4">
        <h2 className="text-base font-semibold" style={{ color: textColor }}>
          Your Favourites
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {favoriteSlots.map((favorite, index) => {
          if (favorite) {
            const stock = favorite.stock;
            const logoUrl = getStockLogoUrl(stock.symbol);
            const logoFailed = failedLogos[stock.symbol];
            const showLogo = Boolean(logoUrl && !logoFailed);
            
            return (
              <div
                key={index}
                onClick={() => handleOpenStock(stock)}
                className="cursor-pointer group relative rounded-3xl overflow-hidden transition-transform hover:scale-105 w-full"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, #1f4a96 0%, #2563bf 100%)'
                    : 'linear-gradient(145deg, #e7f0ff 0%, #cfe1ff 100%)',
                  aspectRatio: '0.65',
                }}
              >
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveStock(stock.id);
                  }}
                  className="absolute right-2 top-2 z-10 p-1 rounded-full"
                  style={{
                    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.28)' : 'rgba(15, 42, 81, 0.12)',
                    color: isDark ? 'white' : '#12345f',
                  }}
                  aria-label={`Remove ${stock.symbol} from favourites`}
                >
                  <X size={14} />
                </button>

                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div>
                    <div className="mb-3">
                      <div
                        className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border"
                        style={{
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.68)',
                          borderColor: isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(16, 58, 111, 0.16)',
                          color: isDark ? '#f8fbff' : '#103a6f',
                        }}
                      >
                        {showLogo ? (
                          <img
                            src={logoUrl ?? undefined}
                            alt={`${stock.company} logo`}
                            className="w-7 h-7 object-contain"
                            style={{ filter: isDark ? 'brightness(1.03) contrast(1.08)' : 'saturate(0.88) contrast(0.98)' }}
                            onError={() => {
                              setFailedLogos((prev) => ({ ...prev, [stock.symbol]: true }));
                            }}
                          />
                        ) : (
                          <span className="text-xs font-semibold tracking-wide">
                            {getStockLogoFallback(stock.symbol)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl font-bold leading-tight" style={{ color: isDark ? '#f8fbff' : '#0f2a51' }}>
                      {stock.symbol}
                    </div>
                    <div className="text-xs mt-2 leading-snug" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#31527f' }}>
                      {stock.company}
                    </div>
                  </div>
                  <div>
                    <div
                      className="inline-block px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(13, 50, 98, 0.12)',
                        color: isDark ? 'white' : '#12345f',
                      }}
                    >
                      {stock.sector}
                    </div>
                  </div>
                </div>

                {/* View overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(208, 224, 249, 0.8)' }}
                >
                  <div className="text-sm font-medium" style={{ color: isDark ? 'white' : '#0f2a51' }}>View details</div>
                </div>
              </div>
            );
          }

          // Empty slot with question mark
          return (
            <button
              key={index}
              onClick={() => onNavigate?.('search')}
              className="cursor-pointer rounded-3xl border-2 border-dashed flex items-center justify-center transition-all hover:opacity-75 w-full"
              style={{
                backgroundColor: surfaceColor,
                borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                aspectRatio: '0.65',
              }}
            >
              <HelpCircle size={56} color={COLORS.primary} opacity={0.6} />
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={() => onNavigate?.('search')}
          className="w-full rounded-full py-4 text-xl font-medium"
          style={{
            backgroundColor: surfaceColor,
            color: textColor,
            border: '1px solid #1f6feb',
            boxShadow: '0 0 0 2px rgba(31, 111, 235, 0.22)',
          }}
        >
          Search for stocks
        </button>

        <button
          onClick={() => onNavigate?.('more-tiles')}
          className="w-full rounded-full py-4 text-xl font-medium"
          style={{
            backgroundColor: COLORS.primary,
            color: 'white',
          }}
        >
          More Tiles
        </button>
      </div>
    </div>
  );
};
