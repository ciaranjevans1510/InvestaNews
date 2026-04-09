'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, ChevronLeft, ChevronRight, CircleDollarSign, Heart, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { getSupabaseClient } from '../../../lib/supabase/client';
import type { Stock } from '../../types';

interface StockDetailsScreenProps {
  stock: Stock;
  stockList?: Stock[];
  onBack: () => void;
  onSelectStock?: (stock: Stock) => void;
}

interface DbStockRow {
  id: string;
  ticker: string;
  company_name: string;
  sector: string;
  industry?: string | null;
  sub_industry?: string | null;
  market_cap?: string | number | null;
  market_capitalization?: string | number | null;
  mkt_cap?: string | number | null;
  market_cap_category?: string | null;
  cap_category?: string | null;
  company_description?: string | null;
  business_summary?: string | null;
  summary?: string | null;
  info_url?: string | null;
  description?: string | null;
  website_url?: string | null;
  price?: number | null;
  change?: number | null;
  percent_change?: number | null;
}

export const StockDetailsScreen: React.FC<StockDetailsScreenProps> = ({ stock, stockList, onBack, onSelectStock }) => {
  const { theme } = useTheme();
  const { addFavourite, isFavourite, canAddFavourite } = useAppContext();
  const isDark = theme === 'dark';
  const [dbStock, setDbStock] = useState<DbStockRow | null>(null);
  const [relatedStocks, setRelatedStocks] = useState<Stock[]>([]);
  const textSecondary = isDark ? '#cbd5e1' : '#5f6882';
  const cardGradient = isDark
    ? 'linear-gradient(180deg, #27355a 0%, #1b2744 100%)'
    : 'linear-gradient(180deg, #e4ecfa 0%, #d9e5f8 100%)';
  const cardBorder = isDark ? 'rgba(148, 163, 184, 0.24)' : '#bfd0ea';
  const cardTitleColor = isDark ? '#f8fbff' : '#12213d';
  const cardBodyColor = isDark ? '#d6e2f5' : '#30486d';
  const cardLabelColor = isDark ? '#9db3d4' : '#5b7397';
  const cardIconColor = isDark ? '#8ca6cb' : '#5b7397';
  const cardDivider = isDark ? 'rgba(148, 163, 184, 0.24)' : 'rgba(91, 115, 151, 0.24)';
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
          const mapped: Stock[] = (data as DbStockRow[]).map((row) => ({
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
      className="px-4 pb-16"
      style={{
        minHeight: '100vh',
        background: isDark ? 'linear-gradient(180deg, #2a2430 0%, #1f253b 100%)' : '#eceaf0',
      }}
    >
      <div
        className="mx-auto max-w-md rounded-[2.5rem] min-h-screen px-4 pt-5 pb-12 md:max-w-none md:rounded-none"
        style={{
          backgroundColor: isDark ? 'rgba(13, 20, 38, 0.45)' : '#e7e4eb',
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-1 rounded-lg"
            style={{ color: textSecondary }}
            aria-label="Back"
          >
            <ArrowLeft size={28} />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavigateAdjacent('prev')}
              disabled={!canGoPrev}
              className="rounded-full p-2 disabled:opacity-35"
              style={{
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(17, 58, 110, 0.08)',
                color: isDark ? '#dbe8ff' : '#12345f',
              }}
              aria-label="Previous stock"
            >
              <ChevronLeft size={16} />
            </button>
            {dotStocks.map((dotStock) => {
              const isActive = dotStock.symbol === ticker;
              return (
                <button
                  key={dotStock.id}
                  onClick={() => handleSelectDotStock(dotStock)}
                  className="rounded-full"
                  aria-label={`Switch to ${dotStock.symbol}`}
                  style={{
                    width: isActive ? '44px' : '14px',
                    height: '14px',
                    backgroundColor: isActive ? (isDark ? '#7488a8' : '#375b92') : (isDark ? '#7f8da4' : '#b8c8de'),
                  }}
                />
              );
            })}
            <button
              onClick={() => handleNavigateAdjacent('next')}
              disabled={!canGoNext}
              className="rounded-full p-2 disabled:opacity-35"
              style={{
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(17, 58, 110, 0.08)',
                color: isDark ? '#dbe8ff' : '#12345f',
              }}
              aria-label="Next stock"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          className="mt-16 rounded-[2.5rem] border px-6 py-7"
          style={{
            background: cardGradient,
            borderColor: cardBorder,
          }}
        >
          <div className="text-6xl font-bold leading-none" style={{ color: cardTitleColor }}>
            {ticker}
          </div>
          <div className="text-2xl mt-3" style={{ color: cardBodyColor }}>
            {companyName}
          </div>

          <div className="mt-6 border-t" style={{ borderColor: cardDivider }} />

          <div className="mt-6 grid gap-5">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Building2 size={28} color={cardIconColor} />
              </div>
              <div>
                <div className="text-lg" style={{ color: cardLabelColor }}>Industry</div>
                <div className="text-3xl font-medium" style={{ color: cardTitleColor }}>{industry}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1">
                <CircleDollarSign size={28} color={cardIconColor} />
              </div>
              <div>
                <div className="text-lg" style={{ color: cardLabelColor }}>Market Cap</div>
                <div className="text-3xl font-medium" style={{ color: cardTitleColor }}>
                  {marketCapText} | {capCategory}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t" style={{ borderColor: cardDivider }} />

          <p className="mt-5 text-[2rem] leading-[1.45]" style={{ color: cardBodyColor }}>
            {description}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={onBack}
              className="rounded-full py-4 px-4 text-2xl font-medium flex items-center justify-center gap-2"
              style={{
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.68)',
                color: cardBodyColor,
              }}
            >
              <X size={22} />
              Not Interested
            </button>

            <button
              onClick={() => addFavourite(stock)}
              disabled={addDisabled}
              className="rounded-full py-4 px-4 text-2xl font-medium disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#4b4f68',
                color: 'white',
              }}
            >
              <Heart size={22} />
              {liked ? 'Saved' : canAddFavourite ? 'Add to Favourites' : 'Tiles Full'}
            </button>
          </div>

          <button
            onClick={openMoreInfo}
            disabled={!infoUrl}
            className="mt-4 w-full rounded-full py-4 text-2xl font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            style={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.68)',
              color: cardBodyColor,
            }}
          >
            <Info size={22} />
            See More Info
          </button>
        </div>

        <p className="text-center mt-7 text-lg" style={{ color: textSecondary }}>
          Informational only. Content is shaped by your activity.
        </p>
      </div>
    </div>
  );
};

