'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { Card, Button } from '../ui/Basic';
import { COLORS } from '../../utils/colors';
import {
  fetchCategoryCompanies,
  mapDirectoryCompany,
  resolveDirectoryCompany,
  type DirectoryCategory,
  type StockDirectoryCompany,
} from '../../../lib/stockDirectory';
import type { Stock } from '../../types';

interface StockDetailsScreenProps {
  stock: Stock;
  stockList?: Stock[];
  onBack: () => void;
  onSelectStock?: (stock: Stock) => void;
}

export const StockDetailsScreen: React.FC<StockDetailsScreenProps> = ({ stock, stockList, onBack, onSelectStock }) => {
  const { theme } = useTheme();
  const { addFavourite, isFavourite, canAddFavourite } = useAppContext();
  const isDark = theme === 'dark';
  const [dbStock, setDbStock] = useState<StockDirectoryCompany | null>(null);
  const [relatedStocks, setRelatedStocks] = useState<Stock[]>([]);
  
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  
  const liked = isFavourite(stock.id);
  const addDisabled = liked || !canAddFavourite;

  useEffect(() => {
    let isMounted = true;

    const loadStockDetails = async () => {
      try {
        const company = await resolveDirectoryCompany(stock);
        if (isMounted) setDbStock(company);
      } catch (error) {
        console.error('Failed to load company details:', error);
      }
    };

    loadStockDetails();

    return () => {
      isMounted = false;
    };
  }, [stock]);

  useEffect(() => {
    let isMounted = true;

    const loadRelatedStocks = async () => {
      const category: DirectoryCategory | null = dbStock?.category_id || dbStock?.category_slug
        ? {
            id: dbStock.category_id,
            slug: dbStock.category_slug,
            name: dbStock.category_name || '',
            kind: 'subcategory',
            parentName: dbStock.parent_category_name || undefined,
          }
        : dbStock?.parent_category_id || dbStock?.parent_category_slug
          ? {
              id: dbStock.parent_category_id,
              slug: dbStock.parent_category_slug,
              name: dbStock.parent_category_name || '',
              kind: 'parent',
            }
          : null;
      if (!category) {
        setRelatedStocks([stock]);
        return;
      }

      try {
        const rows = await fetchCategoryCompanies(category, 0, 20);
        if (isMounted && rows.length > 0) {
          setRelatedStocks(rows.map(mapDirectoryCompany));
          return;
        }
      } catch (error) {
        console.error('Failed to load related companies:', error);
      }

      if (!isMounted) return;
      setRelatedStocks([stock]);
    };

    loadRelatedStocks();

    return () => {
      isMounted = false;
    };
  }, [
    dbStock?.category_id,
    dbStock?.category_name,
    dbStock?.category_slug,
    dbStock?.parent_category_id,
    dbStock?.parent_category_name,
    dbStock?.parent_category_slug,
    stock,
  ]);

  const tickers = useMemo(() => (
    dbStock?.tickers ?? stock.tickers ?? (stock.symbol ? [stock.symbol] : [])
  ), [dbStock, stock.tickers, stock.symbol]);

  const companyName = useMemo(() => {
    return dbStock?.company_name?.trim() || stock.company;
  }, [dbStock?.company_name, stock.company]);

  const categoryName = dbStock?.category_name || dbStock?.parent_category_name || stock.sector;

  const description = useMemo(() => {
    return dbStock?.description || stock.description || `${companyName} company profile.`;
  }, [dbStock?.description, stock.description, companyName]);

  const navigationStocks = useMemo(() => {
    if (stockList && stockList.length > 0) return stockList;
    if (relatedStocks.length > 0) return relatedStocks;
    return [stock];
  }, [stockList, relatedStocks, stock]);

  const currentStockIndex = useMemo(() => {
    const indexById = navigationStocks.findIndex((item) => item.id === stock.id);
    if (indexById >= 0) return indexById;
    const indexBySymbol = stock.symbol
      ? navigationStocks.findIndex((item) => item.symbol === stock.symbol)
      : -1;
    return indexBySymbol >= 0 ? indexBySymbol : 0;
  }, [navigationStocks, stock.id, stock.symbol]);

  const dotStocks = useMemo(() => {
    const base = navigationStocks;
    const currentIndex = currentStockIndex;
    if (base.length <= 6) return base;
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const start = Math.max(0, Math.min(safeIndex - 2, base.length - 6));
    return base.slice(start, start + 6);
  }, [navigationStocks, currentStockIndex]);

  const canGoPrev = currentStockIndex > 0;
  const canGoNext = currentStockIndex < navigationStocks.length - 1;

  const handleSelectDotStock = (item: Stock) => {
    if (!onSelectStock) return;
    onSelectStock(item);
  };

  const handleNavigateAdjacent = (direction: 'prev' | 'next') => {
    if (!onSelectStock) return;

    const nextIndex = direction === 'prev'
      ? currentStockIndex - 1
      : currentStockIndex + 1;

    if (nextIndex < 0 || nextIndex >= navigationStocks.length) return;
    onSelectStock(navigationStocks[nextIndex]);
  };

  return (
    <div
      className="pb-20 px-4 pt-5"
      style={{
        backgroundColor: bgColor,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigateAdjacent('prev')}
            disabled={!canGoPrev}
            className="rounded-lg p-2 disabled:opacity-35 transition-all"
            style={{
              backgroundColor: isDark ? COLORS.dark.surface : COLORS.light.surface,
              border: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
              color: isDark ? COLORS.dark.text : COLORS.light.text,
            }}
            aria-label="Previous stock"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1.5">
            {dotStocks.map((dotStock) => {
              const isActive = dotStock.id === stock.id;
              return (
                <button
                  key={dotStock.id}
                  onClick={() => handleSelectDotStock(dotStock)}
                  className="rounded-full transition-all"
                  aria-label={`Switch to ${dotStock.company}`}
                  style={{
                    width: isActive ? '28px' : '8px',
                    height: '8px',
                    backgroundColor: isActive ? COLORS.primary : (isDark ? COLORS.dark.border : COLORS.light.border),
                  }}
                />
              );
            })}
          </div>
          
          <button
            onClick={() => handleNavigateAdjacent('next')}
            disabled={!canGoNext}
            className="rounded-lg p-2 disabled:opacity-35 transition-all"
            style={{
              backgroundColor: isDark ? COLORS.dark.surface : COLORS.light.surface,
              border: `1px solid ${isDark ? COLORS.dark.border : COLORS.light.border}`,
              color: isDark ? COLORS.dark.text : COLORS.light.text,
            }}
            aria-label="Next stock"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Stock Card */}
      <Card className="mb-6">
        <div className="mb-4">
          <div className="text-3xl font-bold leading-tight" style={{ color: textColor }}>
            {companyName}
          </div>
          <p className="text-base mt-2" style={{ color: textSecondary }}>
            {tickers.length ? tickers.join(' · ') : 'No ticker available'}
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Building2 size={20} style={{ color: COLORS.primary }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium" style={{ color: textSecondary }}>
                Category
              </p>
              <p className="text-lg font-semibold mt-1" style={{ color: textColor }}>
                {categoryName || 'Not classified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Building2 size={20} style={{ color: COLORS.primary }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium" style={{ color: textSecondary }}>
                Country
              </p>
              <p className="text-lg font-semibold mt-1" style={{ color: textColor }}>
                {dbStock?.country || stock.country || 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Description Card */}
      <Card className="mb-6">
        <p className="text-base leading-relaxed" style={{ color: textColor }}>
          {description}
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          onClick={onBack}
          variant="secondary"
          className="flex items-center justify-center gap-2"
        >
          <X size={18} />
          Skip
        </Button>
        
        <Button
          onClick={() => addFavourite(stock)}
          disabled={addDisabled}
          variant="primary"
          className="flex items-center justify-center gap-2"
        >
          <Heart size={18} />
          {liked ? 'Saved' : 'Save'}
        </Button>
      </div>

      {/* Footer Text */}
      <p className="text-center text-xs" style={{ color: textSecondary }}>
        Informational only. Content is shaped by your activity.
      </p>
    </div>
  );
};
