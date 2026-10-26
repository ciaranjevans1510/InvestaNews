'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';
import {
  fetchCategoryCompanies,
  mapDirectoryCompany,
  type DirectoryCategory,
} from '../../../lib/stockDirectory';
import type { Stock } from '../../types';

interface CategoryStocksScreenProps {
  category: DirectoryCategory;
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  onSelectStock?: (stock: Stock, adjacentStocks?: Stock[]) => void;
}

const categorySubtitle = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes('sport')) return 'Professional teams and sports brands';
  if (key.includes('tech')) return 'Software, hardware, and digital platforms';
  if (key.includes('energy')) return 'Traditional and renewable energy companies';
  if (key.includes('entertain') || key.includes('media')) return 'Streaming, gaming, and media businesses';
  return `Explore companies in ${name}`;
};

export const CategoryStocksScreen: React.FC<CategoryStocksScreenProps> = ({
  category,
  onBack,
  onNavigate,
  onSelectStock,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const pageSize = 50;

  useEffect(() => {
    let isMounted = true;

    const loadCategoryStocks = async () => {
      try {
        const rows = await fetchCategoryCompanies(category, 0, pageSize);
        if (!isMounted) return;
        setStocks(rows.map(mapDirectoryCompany));
        setHasMore(rows.length === pageSize);
        setLoadError(false);
      } catch (error) {
        console.error('Failed to load companies in category:', error);
        if (isMounted) setLoadError(true);
      }
    };

    setStocks([]);
    setHasMore(false);
    setLoadError(false);
    loadCategoryStocks();

    return () => {
      isMounted = false;
    };
  }, [category]);

  const subtitle = categorySubtitle(category.name);

  const loadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const rows = await fetchCategoryCompanies(category, stocks.length, pageSize);
      const nextStocks = rows.map(mapDirectoryCompany);
      setStocks((current) => [...current, ...nextStocks]);
      setHasMore(rows.length === pageSize);
    } catch (error) {
      console.error('Failed to load more companies in category:', error);
      setLoadError(true);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div
      className="px-4 pb-28"
      style={{
        minHeight: '100vh',
        background:
          theme === 'dark'
            ? 'linear-gradient(180deg, #121833 0%, #102d60 100%)'
            : 'linear-gradient(180deg, #e7ecff 0%, #d9e7ff 100%)',
      }}
    >
      <div className="pt-5">
        <button
          onClick={onBack}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      <div className="pt-6">
        <h1 className="text-6xl font-bold leading-none" style={{ color: textColor }}>
          {category.name}
        </h1>
        <p className="text-sm mt-3" style={{ color: textSecondary }}>
          {category.parentName ? `${category.parentName} · ${subtitle}` : subtitle}
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {stocks.map((stock) => (
          <button
            key={stock.id}
            onClick={() => {
              if (onSelectStock) {
                onSelectStock(stock, stocks);
                return;
              }
              onNavigate?.('search');
            }}
            className="rounded-[2rem] border p-5 text-left transition-all"
            style={{
              minHeight: '170px',
              background: theme === 'dark'
                ? 'linear-gradient(145deg, rgba(33,39,72,0.95) 0%, rgba(22,30,59,0.95) 100%)'
                : 'linear-gradient(145deg, rgba(243,248,255,0.98) 0%, rgba(233,241,253,0.98) 100%)',
              borderColor,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-semibold shrink-0"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.15)',
                    color: textColor,
                  }}
                >
                  {stock.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-4xl font-bold leading-none" style={{ color: textColor }}>
                      {stock.company}
                  </div>
                  <div className="text-base mt-2 truncate" style={{ color: textSecondary }}>
                      {stock.tickers?.length ? stock.tickers.join(' · ') : 'No ticker available'}
                  </div>
                  {stock.sector && (
                    <div
                      className="inline-block mt-3 rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(148,163,184,0.16)' : 'rgba(100,116,139,0.14)',
                        color: textColor,
                      }}
                    >
                      {stock.sector}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight size={30} color={textSecondary} />
            </div>
          </button>
        ))}

        {loadError && (
          <div className="rounded-3xl border p-6" role="status" style={{ borderColor, color: textColor }}>
            Companies could not be loaded. Please try again later.
          </div>
        )}

        {!loadError && stocks.length === 0 && (
          <div
            className="rounded-3xl border p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
              borderColor,
            }}
          >
            <div className="text-xl font-medium" style={{ color: textColor }}>
              No stocks found for this sector yet.
            </div>
            <p className="text-sm mt-2" style={{ color: textSecondary }}>
              Try another sector from Discover.
            </p>
          </div>
        )}
        {hasMore && (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="w-full rounded-full py-4 text-lg font-medium disabled:opacity-60"
            style={{ backgroundColor: COLORS.primary, color: 'white' }}
          >
            {isLoadingMore ? 'Loading...' : 'Load more companies'}
          </button>
        )}
      </div>
    </div>
  );
};
