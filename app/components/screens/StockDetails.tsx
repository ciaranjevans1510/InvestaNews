'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, ChevronLeft, ChevronRight, CircleDollarSign, Heart, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { Card, Button, Badge } from '../ui/Basic';
import { getSupabaseClient } from '../../../lib/supabase/client';
import { COLORS, SHADOW_STYLES } from '../../utils/colors';
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
  const [dbStock, setDbStock] = useState<any | null>(null);
  const [relatedStocks, setRelatedStocks] = useState<Stock[]>([]);
  
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  
  const liked = isFavourite(stock.id);
  const addDisabled = liked || !canAddFavourite;

  useEffect(() => {
    let isMounted = true;

    const loadStockDetails = async () => {
      const supabase = getSupabaseClient();
      try {
        const { data } = await supabase
          .from('stocks')
          .select('id, ticker, company_name, sector, industry, market_cap, description, website_url')
          .ilike('ticker', stock.symbol)
          .limit(1)
          .maybeSingle();

        if (isMounted && data) {
          setDbStock(data);
        }
      } catch {
        // Keep fallback values from selected stock payload.
      }
    };

    loadStockDetails();

    return () => {
      isMounted = false;
    };
  }, [stock.symbol]);

  useEffect(() => {
    let isMounted = true;

    const loadRelatedStocks = async () => {
      const activeSector = (dbStock?.sector || stock.sector || '').toString();
      if (!activeSector) return;

      const supabase = getSupabaseClient();
      try {
        const { data, error } = await supabase
          .from('stocks')
          .select('id, ticker, company_name, sector, industry, market_cap, description, website_url')
          .eq('sector', activeSector)
          .limit(20);

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: Stock[] = data.map((row: any) => ({
            id: String(row.id ?? row.ticker),
            symbol: String(row.ticker ?? '').toUpperCase(),
            company: String(row.company_name ?? '').trim() || 'Unknown company',
            price: Number(row.price ?? 0),
            change: Number(row.change ?? 0),
            percentChange: Number(row.percent_change ?? 0),
            sector: String(row.sector ?? activeSector),
            sectorColor: stock.sectorColor,
            industry: row.industry ? String(row.industry) : undefined,
            marketCap: row.market_cap ?? undefined,
            description: row.description ? String(row.description) : undefined,
            infoUrl: row.website_url ? String(row.website_url) : undefined,
          }));
          setRelatedStocks(mapped);
          return;
        }
      } catch {
        // Keep fallback when query fails.
      }

      if (!isMounted) return;
      setRelatedStocks([stock]);
    };

    loadRelatedStocks();

    return () => {
      isMounted = false;
    };
  }, [dbStock?.sector, stock]);

  const ticker = useMemo(() => {
    return String(dbStock?.ticker ?? stock.symbol).toUpperCase();
  }, [dbStock, stock.symbol]);

  const companyName = useMemo(() => {
    return String(dbStock?.company_name ?? stock.company);
  }, [dbStock, stock.company]);

  const industry = useMemo(() => {
    return (
      dbStock?.industry ||
      dbStock?.sub_industry ||
      stock.industry ||
      stock.sector ||
      'General'
    );
  }, [dbStock, stock.industry, stock.sector]);

  const marketCapRaw = useMemo(() => {
    return (
      dbStock?.market_cap ??
      dbStock?.market_capitalization ??
      dbStock?.mkt_cap ??
      stock.marketCap ??
      null
    );
  }, [dbStock, stock.marketCap]);

  const marketCapText = useMemo(() => {
    const parsed = Number(marketCapRaw);
    if (Number.isFinite(parsed) && parsed > 0) {
      if (parsed >= 1_000_000_000_000) return `$${(parsed / 1_000_000_000_000).toFixed(1)}T`;
      if (parsed >= 1_000_000_000) return `$${(parsed / 1_000_000_000).toFixed(0)}B`;
      if (parsed >= 1_000_000) return `$${(parsed / 1_000_000).toFixed(0)}M`;
      return `$${parsed.toLocaleString()}`;
    }
    if (typeof marketCapRaw === 'string' && marketCapRaw.trim()) {
      return marketCapRaw.trim();
    }
    return 'N/A';
  }, [marketCapRaw]);

  const capCategory = useMemo(() => {
    if (dbStock?.market_cap_category) return String(dbStock.market_cap_category);
    if (dbStock?.cap_category) return String(dbStock.cap_category);
    const parsed = Number(marketCapRaw);
    if (!Number.isFinite(parsed) || parsed <= 0) return 'Unknown';
    if (parsed >= 200_000_000_000) return 'Mega Cap';
    if (parsed >= 10_000_000_000) return 'Large Cap';
    if (parsed >= 2_000_000_000) return 'Mid Cap';
    return 'Small Cap';
  }, [dbStock, marketCapRaw]);

  const description = useMemo(() => {
    return (
      dbStock?.description ||
      dbStock?.company_description ||
      dbStock?.business_summary ||
      dbStock?.summary ||
      stock.description ||
      `${companyName} operates in the ${String(industry).toLowerCase()} space, with market relevance across its sector.`
    );
  }, [dbStock, stock.description, companyName, industry]);

  const infoUrl = useMemo(() => {
    return dbStock?.website_url || dbStock?.info_url || stock.infoUrl || null;
  }, [dbStock, stock.infoUrl]);

  const openMoreInfo = () => {
    if (!infoUrl) return;
    window.open(String(infoUrl), '_blank', 'noopener,noreferrer');
  };

  const navigationStocks = useMemo(() => {
    if (stockList && stockList.length > 0) return stockList;
    if (relatedStocks.length > 0) return relatedStocks;
    return [stock];
  }, [stockList, relatedStocks, stock]);

  const currentStockIndex = useMemo(() => {
    const indexById = navigationStocks.findIndex((item) => item.id === stock.id);
    if (indexById >= 0) return indexById;
    const indexBySymbol = navigationStocks.findIndex((item) => item.symbol === ticker);
    return indexBySymbol >= 0 ? indexBySymbol : 0;
  }, [navigationStocks, stock.id, ticker]);

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
              const isActive = dotStock.symbol === ticker;
              return (
                <button
                  key={dotStock.id}
                  onClick={() => handleSelectDotStock(dotStock)}
                  className="rounded-full transition-all"
                  aria-label={`Switch to ${dotStock.symbol}`}
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
          <div className="text-5xl font-bold leading-tight" style={{ color: textColor }}>
            {ticker}
          </div>
          <p className="text-lg mt-2" style={{ color: textSecondary }}>
            {companyName}
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
                Industry
              </p>
              <p className="text-lg font-semibold mt-1" style={{ color: textColor }}>
                {industry}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <CircleDollarSign size={20} style={{ color: COLORS.primary }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium" style={{ color: textSecondary }}>
                Market Cap
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-lg font-semibold" style={{ color: textColor }}>
                  {marketCapText}
                </p>
                <Badge variant="secondary" size="sm">
                  {capCategory}
                </Badge>
              </div>
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

      <Button
        onClick={openMoreInfo}
        disabled={!infoUrl}
        variant="secondary"
        className="w-full flex items-center justify-center gap-2 mb-6"
      >
        <Info size={18} />
        More Info
      </Button>

      {/* Footer Text */}
      <p className="text-center text-xs" style={{ color: textSecondary }}>
        Informational only. Content is shaped by your activity.
      </p>
    </div>
  );
};

