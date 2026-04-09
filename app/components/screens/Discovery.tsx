'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  Zap,
  Globe,
  Film,
  Landmark,
  HeartPulse,
  ShoppingBag,
  Cpu,
  Leaf,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';
import { MOCK_STOCKS } from '../../utils/mockData';
import { getSupabaseClient } from '../../../lib/supabase/client';

interface DiscoveryScreenProps {
  onNavigate?: (screen: string) => void;
  onSelectCategory?: (category: string) => void;
  onBack?: () => void;
}

interface DiscoverCategory {
  name: string;
  description: string;
  stockCount: number;
}

const FALLBACK_CATEGORIES: DiscoverCategory[] = [
  {
    name: 'Sports & Teams',
    description: 'Professional teams and sports brands',
    stockCount: 18,
  },
  {
    name: 'Technology',
    description: 'Software, hardware, and digital platforms',
    stockCount: 24,
  },
  {
    name: 'Energy & Climate',
    description: 'Traditional and renewable energy companies',
    stockCount: 12,
  },
  {
    name: 'Entertainment & Media',
    description: 'Streaming, gaming, and media businesses',
    stockCount: 16,
  },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  technology: 'Software, hardware, and digital platforms',
  energy: 'Traditional and renewable energy companies',
  finance: 'Banks, payments, and financial services',
  healthcare: 'Biotech, pharma, and health providers',
  retail: 'Consumer, ecommerce, and shopping brands',
  industrials: 'Manufacturing and industrial leaders',
};

const iconForCategory = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes('sport')) return Trophy;
  if (key.includes('tech')) return Zap;
  if (key.includes('energy') || key.includes('climate')) return Globe;
  if (key.includes('entertain') || key.includes('media')) return Film;
  if (key.includes('financ')) return Landmark;
  if (key.includes('health')) return HeartPulse;
  if (key.includes('retail') || key.includes('consumer')) return ShoppingBag;
  if (key.includes('industrial')) return Cpu;
  if (key.includes('green') || key.includes('sustain')) return Leaf;
  return Sparkles;
};

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({ onNavigate, onSelectCategory, onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const surfaceColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;
  const [categories, setCategories] = useState<DiscoverCategory[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      const supabase = getSupabaseClient();

      try {
        const { data: stockRows, error: stockError } = await supabase
          .from('stocks')
          .select('sector')
          .limit(500);

        if (stockError || !stockRows || stockRows.length === 0) {
          return;
        }

        const grouped = new Map<string, number>();
        stockRows.forEach((row: any) => {
          const sectorName = (row.sector || '').toString().trim();
          if (!sectorName) return;
          grouped.set(sectorName, (grouped.get(sectorName) || 0) + 1);
        });

        if (!isMounted || grouped.size === 0) return;

        const topCategories = Array.from(grouped.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([name, stockCount]) => ({
            name,
            stockCount,
            description:
              CATEGORY_DESCRIPTIONS[name.toLowerCase()] ||
              `Explore ${name.toLowerCase()} stocks and trends`,
          }));

        setCategories(topCategories);
      } catch {
        // Keep static fallback categories when sector data is unavailable.
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const topTickers = useMemo(() => {
    return MOCK_STOCKS.slice(0, 4).map((stock) => stock.symbol);
  }, []);

  return (
    <div
      className="pb-28 px-4"
      style={{
        backgroundColor: bgColor,
        minHeight: '100vh',
      }}
    >
      <div className="pt-5">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            onNavigate?.('home');
          }}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      <div className="pt-6">
        <h1 className="text-6xl font-bold leading-none" style={{ color: textColor }}>
          Discover
        </h1>
        <p className="text-sm mt-3" style={{ color: textSecondary }}>
          Explore stocks by theme and interest
        </p>
      </div>

      {/* Quiz Hero */}
      <div
        className="mt-6 rounded-[2rem] p-6 border"
        style={{
          background: 'linear-gradient(135deg, #f3e4ae 0%, #f0d6c8 100%)',
          borderColor: borderColor,
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8ebc8' }}>
            <Sparkles size={28} color="#2e3f67" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: '#1f2b48' }}>
              Not sure where to start?
            </h2>
            <p className="text-xl mt-2" style={{ color: '#2e3f67' }}>
              Take a quick quiz to explore stocks that match your interests
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate?.('quiz')}
          className="mt-6 w-full rounded-full py-5 text-2xl font-medium"
          style={{
            background: 'linear-gradient(135deg, #6f63ff 0%, #2f8df2 100%)',
            color: 'white',
          }}
        >
          Take Quiz
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-4xl font-semibold" style={{ color: textColor }}>
          Explore by Category
        </h2>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {categories.map((category) => {
            const Icon = iconForCategory(category.name);
            return (
              <button
                key={category.name}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(category.name);
                    return;
                  }
                  onNavigate?.('search');
                }}
                className="rounded-3xl border p-5 text-left"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor,
                  minHeight: '220px',
                }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
                  <Icon size={28} color="white" />
                </div>

                <div className="mt-4 text-2xl font-semibold leading-tight" style={{ color: textColor }}>
                  {category.name}
                </div>
                <div className="text-sm mt-1" style={{ color: textSecondary }}>
                  {category.stockCount} stocks
                </div>
                <div className="text-sm mt-3" style={{ color: textSecondary }}>
                  {category.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-2xl p-4" style={{ backgroundColor: surfaceColor }}>
        <p className="text-xs" style={{ color: textSecondary }}>
          Trending tickers: {topTickers.join(' | ')}
        </p>
      </div>
    </div>
  );
};
