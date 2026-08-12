'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, HelpCircle, X, Compass, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { InvestaNewsLogo } from '../ui/InvestaNewsLogo';
import { COLORS } from '../../utils/colors';
import { MOCK_STORIES } from '../../utils/mockData';
import { getStockLogoFallback, getStockLogoUrl } from '../../utils/stockLogos';
import type { Stock } from '../../types';

interface DashboardScreenProps {
  onNavigate?: (screen: string) => void;
  onSelectStock?: (stock: Stock, adjacentStocks?: Stock[]) => void;
  onResetExperience?: () => void;
  onOpenBeta?: () => void;
  startTooltipTour?: boolean;
  onTooltipTourComplete?: () => void;
  homeButtonRef?: React.RefObject<HTMLButtonElement | null>;
  betaButtonRef?: React.RefObject<HTMLButtonElement | null>;
  accountButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

interface HomeStory {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
}

interface StoriesResponse {
  stories?: HomeStory[];
}

const TOOLTIP_STEPS = [
  {
    title: 'Home Button',
    message: 'Tap the InvestaNews logo to restart the intro flow at any time.',
    target: 'homeButton',
    placement: 'below',
  },
  {
    title: 'Beta Info',
    message: 'Open the Beta page here for updates, rewards, and install help.',
    target: 'betaButton',
    placement: 'below',
  },
  {
    title: 'Quick Explore',
    message: 'Use these action buttons lower down to jump into Explore or Search quickly.',
    target: 'quickActions',
    placement: 'above',
  },
  {
    title: 'Account',
    message: 'Open your profile to view your progress, settings, and saved favourites.',
    target: 'accountButton',
    placement: 'below',
  },
  {
    title: 'Your Favourites',
    message: 'This is where your favourite stocks live. Tap an empty tile to add a new one.',
    target: 'favouritesGrid',
    placement: 'below',
  },
  {
    title: 'More Tiles',
    message: 'When your favourites are full, expand your slots using the More Tiles button.',
    target: 'moreTilesButton',
    placement: 'above',
  },
] as const;

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

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onSelectStock,
  onResetExperience,
  onOpenBeta,
  startTooltipTour,
  onTooltipTourComplete,
  homeButtonRef,
  betaButtonRef,
  accountButtonRef,
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { favourites, removeFavourite, favouriteTileCount, tutorialCompleted } = useAppContext();
  const [stories, setStories] = useState<HomeStory[]>(fallbackHomeStories);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const quickActionsRef = React.useRef<HTMLDivElement | null>(null);
  const favouritesGridRef = React.useRef<HTMLDivElement | null>(null);
  const moreTilesButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [tooltipStyles, setTooltipStyles] = useState<{
    focus?: React.CSSProperties;
    bubble?: React.CSSProperties;
    tail?: React.CSSProperties;
  }>({});

  const getTooltipTarget = (target: string) => {
    switch (target) {
      case 'homeButton':
        return homeButtonRef?.current ?? null;
      case 'betaButton':
        return betaButtonRef?.current ?? null;
      case 'quickActions':
        return quickActionsRef.current;
      case 'accountButton':
        return accountButtonRef?.current ?? null;
      case 'favouritesGrid':
        return favouritesGridRef.current;
      case 'moreTilesButton':
        return moreTilesButtonRef.current;
      default:
        return null;
    }
  };

  const computeTooltipStyles = () => {
    const current = TOOLTIP_STEPS[tourStep];
    const targetElement = getTooltipTarget(current.target);
    const targetRect = targetElement?.getBoundingClientRect();

    if (!targetRect) {
      return {
        focus: undefined,
        bubble: undefined,
        tail: undefined,
      };
    }

    const focusStyle: React.CSSProperties = {
      position: 'fixed',
      top: targetRect.top,
      left: targetRect.left,
      width: targetRect.width,
      height: targetRect.height,
    };

    const bubbleWidth = Math.min(320, window.innerWidth - 32);
    const left = Math.max(16, Math.min(targetRect.left, window.innerWidth - bubbleWidth - 16));
    const centerX = targetRect.left + targetRect.width / 2;
    const tailLeft = Math.max(24, Math.min(centerX - left - 8, bubbleWidth - 24));
    const bubbleStyle: React.CSSProperties = {
      position: 'fixed',
      width: bubbleWidth,
      left,
    };
    const tailStyle: React.CSSProperties = {
      left: tailLeft,
    };

    if (current.placement === 'below') {
      bubbleStyle.top = targetRect.top + targetRect.height + 12;
      tailStyle.top = -8;
    } else {
      bubbleStyle.top = Math.max(16, targetRect.top - 130);
      tailStyle.bottom = -8;
    }

    return {
      focus: focusStyle,
      bubble: bubbleStyle,
      tail: tailStyle,
    };
  };
  useEffect(() => {
    if (!tourOpen) return;
    const update = () => setTooltipStyles(computeTooltipStyles());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [tourOpen, tourStep]);

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
    if (!startTooltipTour) return;
    setTourOpen(true);
    setTourStep(0);
  }, [startTooltipTour]);

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

        if (isMounted) {
          setStories(mergeStories(dbStories as HomeStory[]));
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
    if (!slug) {
      onNavigate?.('stories');
      return;
    }

    router.push(`/stories/${slug}`);
  };

  const dailyStory = stories.find(
    (story) => story.title?.trim().toLowerCase() === DAILY_STORY_TITLE,
  );

  const heroStory = dailyStory ?? {
    id: 'today-in-60-seconds',
    slug: '',
    title: 'Today in 60 seconds',
    subtitle: dailyStory
      ? 'A daily quick market story delivered in a single tile.'
      : 'When today’s story is published, tap here to read it.',
  };

  const openDailyStory = () => {
    if (dailyStory?.slug) {
      openStory(dailyStory.slug);
      return;
    }
    onNavigate?.('stories');
  };

  const topStories = stories
    .filter((story) => story.id !== heroStory.id)
    .slice(0, 2);

  const closeTour = () => {
    setTourOpen(false);
    setTourStep(0);
    onTooltipTourComplete?.();
  };

  const handleNextTourStep = () => {
    if (tourStep >= TOOLTIP_STEPS.length - 1) {
      closeTour();
      return;
    }
    setTourStep((prev) => prev + 1);
  };

  const currentTooltip = TOOLTIP_STEPS[tourStep];

  return (
    <div
      ref={containerRef}
      className="relative pb-10 px-4"
      style={{
        background: isDark
          ? bgColor
          : 'radial-gradient(circle at 14% 12%, rgba(31, 111, 235, 0.14) 0%, rgba(31, 111, 235, 0) 34%), radial-gradient(circle at 86% 88%, rgba(245, 166, 126, 0.2) 0%, rgba(245, 166, 126, 0) 36%), linear-gradient(180deg, #f8fbff 0%, #eaf2fd 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="pt-24 pb-4 flex justify-center items-start">
        <div className="text-sm text-center" style={{ color: textSecondary }}>
          Market news, explained simply
        </div>
      </div>

      {/* Stories Container */}
      <div className="rounded-lg mb-5 overflow-hidden"
        style={{ backgroundColor: surfaceColor }}
      >
        <div className="p-4">
            <div className="space-y-4">
              <div>
                <div>
                  <button
                    onClick={openDailyStory}
                    className="rounded-[2rem] p-5 text-left transition-all hover:opacity-95"
                    style={{
                      width: '100%',
                      maxWidth: '520px',
                      aspectRatio: '1 / 1',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '28px',
                      background: isDark
                        ? 'linear-gradient(135deg, #2b3151 0%, #1e2543 100%)'
                        : 'linear-gradient(135deg, #dbe8ff 0%, #f5f8ff 100%)',
                      border: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
                    }}
                    aria-label={dailyStory?.slug ? 'Open today in 60 seconds story' : 'Explore stories'}
                  >
                    <div>
                      <div className="text-sm uppercase tracking-[0.26em] font-semibold" style={{ color: isDark ? '#9fb2ff' : '#4667b8' }}>
                        Daily story
                      </div>
                      <div className="mt-4 text-2xl font-bold leading-tight" style={{ color: isDark ? '#ffffff' : '#10243c' }}>
                        {heroStory.title}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.78)' : '#45617f' }}>
                        {heroStory.subtitle}
                      </p>
                    </div>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {topStories.map((story) => (
                    <button
                      key={story.id}
                      onClick={() => openStory(story.slug)}
                      className="rounded-3xl border text-left px-3 py-3 transition-all hover:opacity-95"
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        backgroundColor: isDark ? '#22252d' : '#f8fbff',
                        borderColor: isDark ? COLORS.dark.border : COLORS.light.border,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '12px',
                      }}
                    >
                      <div>
                        <div className="text-sm font-semibold" style={{ color: textColor }}>
                          {story.title}
                        </div>
                        {story.subtitle && (
                          <div className="mt-2 text-xs leading-snug" style={{ color: textSecondary }}>
                            {story.subtitle}
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: isDark ? '#9fb2ff' : '#4667b8' }}>
                        Top story
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => onNavigate?.('stories')}
                  className="rounded-full px-5 py-3 text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: 'white',
                  }}
                >
                  View more stories
                </button>
              </div>
            </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm" style={{ color: textSecondary }}>
          Major business and market updates
        </p>
      </div>

      {tourOpen && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div
            className="absolute rounded-2xl border-2"
            style={{
              ...tooltipStyles.focus,
              borderColor: isDark ? '#7c8cff' : '#5f76ff',
              boxShadow: isDark
                ? '0 0 0 9999px rgba(10, 18, 39, 0.55)'
                : '0 0 0 9999px rgba(9, 24, 58, 0.38)',
            }}
          />
          <div
            className="absolute rounded-2xl border p-3 shadow-xl pointer-events-auto"
            style={{
              ...tooltipStyles.bubble,
              backgroundColor: isDark ? '#1a2342' : '#f6f9ff',
              borderColor: isDark ? '#4458b3' : '#b9ccff',
              maxWidth: '320px',
            }}
          >
            <span
              className="absolute h-4 w-4 rotate-45 border"
              style={{
                ...tooltipStyles.tail,
                backgroundColor: isDark ? '#1a2342' : '#f6f9ff',
                borderColor: isDark ? '#4458b3' : '#b9ccff',
              }}
            />
            <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: isDark ? '#9fb2ff' : '#4762bf' }}>
              Tooltip {tourStep + 1} of {TOOLTIP_STEPS.length}
            </div>
            <div className="text-sm font-semibold mt-1" style={{ color: textColor }}>
              {currentTooltip.title}
            </div>
            <p className="text-xs mt-1.5" style={{ color: textSecondary }}>
              {currentTooltip.message}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <button
                onClick={closeTour}
                className="text-xs font-medium"
                style={{ color: isDark ? '#c8d6ff' : '#3c5ba7' }}
              >
                Skip tour
              </button>
              <button
                onClick={handleNextTourStep}
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                }}
              >
                {tourStep === TOOLTIP_STEPS.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick navigation */}
      <div ref={quickActionsRef} className="flex gap-3 mb-6">
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
      <div ref={favouritesGridRef} className="grid grid-cols-3 gap-3">
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
          ref={moreTilesButtonRef}
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
