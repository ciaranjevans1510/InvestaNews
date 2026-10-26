'use client';

import React, { useEffect, useState } from 'react';
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
import {
  fetchDirectoryCategories,
  fetchDirectoryPage,
  mapDirectoryCompany,
  type DirectoryCategory,
} from '../../../lib/stockDirectory';
import type { Stock } from '../../types';

interface DiscoveryScreenProps {
  onNavigate?: (screen: string) => void;
  onSelectCategory?: (category: DirectoryCategory) => void;
  onSelectStock?: (stock: Stock, adjacentStocks?: Stock[]) => void;
  onBack?: () => void;
}

interface DiscoverCategory {
  category: DirectoryCategory;
  description: string;
}

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

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  onNavigate,
  onSelectCategory,
  onSelectStock,
  onBack,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const surfaceColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;
  const [categories, setCategories] = useState<DiscoverCategory[]>([]);
  const [featuredCompanies, setFeaturedCompanies] = useState<ReturnType<typeof mapDirectoryCompany>[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<DirectoryCategory | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDiscoveryData = async () => {
      const [categoryResult, companyResult] = await Promise.allSettled([
        fetchDirectoryCategories(),
        fetchDirectoryPage(0, 4),
      ]);
      if (!isMounted) return;

      const errors: string[] = [];
      if (categoryResult.status === 'fulfilled') {
        setCategories(categoryResult.value.map((category) => ({
          category,
          description:
            CATEGORY_DESCRIPTIONS[category.name.toLowerCase()] ||
            `Explore ${category.name.toLowerCase()} companies`,
        })));
      } else {
        console.error('Failed to load discovery categories:', categoryResult.reason);
        errors.push(categoryResult.reason instanceof Error
          ? categoryResult.reason.message
          : String(categoryResult.reason));
      }

      if (companyResult.status === 'fulfilled') {
        setFeaturedCompanies(companyResult.value.map(mapDirectoryCompany));
      } else {
        console.error('Failed to load featured companies:', companyResult.reason);
        errors.push(companyResult.reason instanceof Error
          ? companyResult.reason.message
          : String(companyResult.reason));
      }
      setLoadError(errors.length ? errors.join('; ') : null);
    };

    loadDiscoveryData();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCategories = selectedParent
    ? categories.filter(({ category }) =>
      category.kind === 'subcategory' && category.parentId === selectedParent.id,
    )
    : categories.filter(({ category }) => category.kind === 'parent');

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
          {selectedParent?.name ?? 'Explore by Category'}
        </h2>

        {selectedParent && (
          <>
            <button
              type="button"
              onClick={() => setSelectedParent(null)}
              className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: surfaceColor, color: textColor, border: `1px solid ${borderColor}` }}
            >
              <ArrowLeft size={16} />
              All categories
            </button>
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(selectedParent);
                  return;
                }
                onNavigate?.('search');
              }}
              className="mt-3 ml-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{ backgroundColor: COLORS.primary, color: 'white' }}
            >
              Browse all {selectedParent.name} companies
            </button>
          </>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {visibleCategories.map(({ category, description }) => {
            const Icon = iconForCategory(category.name);
            return (
              <button
                key={`${category.kind}:${category.id ?? category.slug}`}
                onClick={() => {
                  if (category.kind === 'parent') {
                    setSelectedParent(category);
                    return;
                  }
                  if (onSelectCategory) {
                    onSelectCategory(category);
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
                {category.parentName && (
                  <div className="text-xs mt-1" style={{ color: textSecondary }}>
                    {category.parentName}
                  </div>
                )}
                <div className="text-sm mt-3" style={{ color: textSecondary }}>
                  {description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {loadError && (
        <p className="mt-4 text-sm" role="status" style={{ color: textSecondary }}>
          Company discovery could not be loaded: {loadError}
        </p>
      )}

      {featuredCompanies.length > 0 && (
        <section className="mt-5">
          <h2 className="text-2xl font-semibold mb-3" style={{ color: textColor }}>
            Featured companies
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {featuredCompanies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => {
                  if (onSelectStock) {
                    onSelectStock(company, featuredCompanies);
                    return;
                  }
                  onNavigate?.('search');
                }}
                className="rounded-3xl border p-4 text-left"
                style={{ backgroundColor: surfaceColor, borderColor, minHeight: '140px' }}
              >
                <div className="text-lg font-semibold" style={{ color: textColor }}>
                  {company.company}
                </div>
                <div className="text-sm mt-2" style={{ color: textSecondary }}>
                  {company.tickers?.length ? company.tickers.join(' · ') : 'No ticker available'}
                </div>
                {(company.categoryName || company.parentCategoryName) && (
                  <div className="text-xs mt-2" style={{ color: textSecondary }}>
                    {company.categoryName || company.parentCategoryName}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
