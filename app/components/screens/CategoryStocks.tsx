'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS } from '../../utils/colors';
import { getSupabaseClient } from '../../../lib/supabase/client';
import { MOCK_STOCKS } from '../../utils/mockData';
import type { Stock } from '../../types';

interface CategoryStockItem {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  price: number;
  change: number;
  percentChange: number;
}

interface CategoryStocksScreenProps {
  sector: string;
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  onSelectStock?: (stock: Stock, adjacentStocks?: Stock[]) => void;
}

const sectorSubtitle = (sector: string) => {
  const key = sector.toLowerCase();
  if (key.includes('sport')) return 'Professional teams and sports brands';
  if (key.includes('tech')) return 'Software, hardware, and digital platforms';
  if (key.includes('energy')) return 'Traditional and renewable energy companies';
  if (key.includes('entertain') || key.includes('media')) return 'Streaming, gaming, and media businesses';
  return `Explore companies in ${sector}`;
};

const badgeForTicker = (ticker: string) => {
  const key = ticker.toUpperCase();
  if (key === 'NKE') return 'NK';
  if (key === 'DKNG') return 'DK';
  if (key === 'MGM') return 'MG';
  if (key === 'DIS') return 'DS';
  if (key === 'AAPL') return 'AP';
  if (key === 'TSLA') return 'TS';
  if (key === 'NVDA') return 'NV';
  if (key === 'MSFT') return 'MS';
  return key.slice(0, 2);
};

export const CategoryStocksScreen: React.FC<CategoryStocksScreenProps> = ({
  sector,
  onBack,
  onNavigate,
  onSelectStock,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;

  const [stocks, setStocks] = useState<CategoryStockItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadSectorStocks = async () => {
      const supabase = getSupabaseClient();

      try {
        const { data, error } = await supabase
          .from('stocks')
          .select('id, ticker, company_name, sector')
          .eq('sector', sector)
          .limit(50);

        if (!error && data && data.length > 0 && isMounted) {
          const rows = data.map((row: any) => ({
            id: String(row.id ?? row.ticker),
            ticker: String(row.ticker ?? '').toUpperCase(),
            companyName: String(row.company_name ?? '').trim() || 'Unknown company',
            sector: String(row.sector ?? sector),
            price: Number(row.price ?? 0),
            change: Number(row.change ?? 0),
            percentChange: Number(row.percent_change ?? 0),
          }));
          setStocks(rows);
          return;
        }
      } catch {
        // Fall through to local fallback list.
      }

      if (!isMounted) return;

      const fallback = MOCK_STOCKS.filter(
        (stock) => stock.sector.toLowerCase() === sector.toLowerCase(),
      ).map((stock) => ({
        id: stock.id,
        ticker: stock.symbol,
        companyName: stock.company,
        sector: stock.sector,
        price: stock.price,
        change: stock.change,
        percentChange: stock.percentChange,
      }));

      setStocks(fallback);
    };

    loadSectorStocks();

    return () => {
      isMounted = false;
    };
  }, [sector]);

  const subtitle = useMemo(() => sectorSubtitle(sector), [sector]);

  const toAppStock = (item: CategoryStockItem): Stock => {
    const sectorKey = item.sector.toLowerCase() as keyof typeof COLORS.sectors;
    return {
      id: item.id,
      symbol: item.ticker,
      company: item.companyName,
      price: item.price,
      change: item.change,
      percentChange: item.percentChange,
      sector: item.sector,
      sectorColor: COLORS.sectors[sectorKey] || COLORS.primary,
    };
  };

  const appStocks = useMemo(() => {
    return stocks.map((item) => toAppStock(item));
  }, [stocks]);

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
          {sector}
        </h1>
        <p className="text-sm mt-3" style={{ color: textSecondary }}>
          {subtitle}
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {stocks.map((stock) => (
          <button
            key={stock.id}
            onClick={() => {
              const appStock = toAppStock(stock);
              if (onSelectStock) {
                onSelectStock(appStock, appStocks);
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
                  {badgeForTicker(stock.ticker)}
                </div>
                <div className="min-w-0">
                  <div className="text-4xl font-bold leading-none" style={{ color: textColor }}>
                    {stock.ticker}
                  </div>
                  <div className="text-base mt-2 truncate" style={{ color: textSecondary }}>
                    {stock.companyName}
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

        {stocks.length === 0 && (
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
      </div>
    </div>
  );
};
