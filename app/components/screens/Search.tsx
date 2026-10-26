'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';
import {
  fetchDirectoryPage,
  mapDirectoryCompany,
  searchDirectoryCompanies,
} from '../../../lib/stockDirectory';
import type { Stock } from '../../types';

interface SearchScreenProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
  onSelectStock?: (stock: Stock, adjacentStocks?: Stock[]) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ onNavigate, onBack, onSelectStock }) => {
  const { theme } = useTheme();
  const { addFavourite, isFavourite, canAddFavourite } = useAppContext();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;
  const surfaceColor = isDark ? COLORS.dark.surface : COLORS.light.surface;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [dbResults, setDbResults] = useState<Stock[]>([]);
  const [recommendedStocks, setRecommendedStocks] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchSurfaceColor = isDark ? '#1f2942' : '#eef2fb';
  const searchBorderColor = isSearchFocused
    ? '#6C63FF'
    : isDark
      ? 'rgba(255,255,255,0.08)'
      : borderColor;
  const searchBoxShadow = isSearchFocused ? '0 0 0 2px rgba(108, 99, 255, 0.2)' : 'none';
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) {
      setDbResults([]);
      setIsSearching(false);
      setHasMoreResults(false);
      setSearchError(null);
      return;
    }

    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;
    setIsSearching(true);
    setSearchError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const q = searchQuery.trim();
        const rows = await searchDirectoryCompanies(q, 0, 25);

        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        setDbResults(rows.map(mapDirectoryCompany));
        setHasMoreResults(rows.length === 25);
      } catch (error) {
        if (requestIdRef.current !== currentRequestId) {
          return;
        }
        console.error('Company search failed:', error);
        setDbResults([]);
        setHasMoreResults(false);
        setSearchError(error instanceof Error ? error.message : String(error));
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;
    fetchDirectoryPage(0, 4)
      .then((rows) => {
        if (isMounted) setRecommendedStocks(rows.map(mapDirectoryCompany));
      })
      .catch((error) => {
        console.error('Failed to load featured companies:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedStock && searchQuery.trim().toLowerCase() !== selectedStock.company.toLowerCase()) {
      setSelectedStock(null);
    }
  }, [searchQuery, selectedStock]);

  const showDropdown = Boolean(searchQuery) && !selectedStock;
  const actionStock = selectedStock;
  const actionButtonActive = Boolean(selectedStock);

  const handleViewStock = () => {
    if (!actionStock) return;
    if (onSelectStock) {
      onSelectStock(actionStock, dbResults.length > 0 ? dbResults : [actionStock]);
    }
  };

  const loadMoreResults = async () => {
    if (isLoadingMore || !searchQuery.trim()) return;
    setIsLoadingMore(true);
    try {
      const rows = await searchDirectoryCompanies(searchQuery.trim(), dbResults.length, 25);
      const mapped = rows.map(mapDirectoryCompany);
      setDbResults((current) => [...current, ...mapped]);
      setHasMoreResults(rows.length === 25);
    } catch (error) {
      console.error('Failed to load more company search results:', error);
      setSearchError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleAddFavourite = () => {
    if (!actionStock) return;
    if (!canAddFavourite) {
      onNavigate?.('more-tiles');
      return;
    }
    addFavourite(actionStock);
  };

  const actionAlreadyFavourite = actionStock ? isFavourite(actionStock.id) : false;
  const addFavouriteDisabled = !actionStock || actionAlreadyFavourite;
  const viewButtonDisabled = !actionStock;
  const viewButtonStyle = {
    backgroundColor: actionButtonActive ? COLORS.primary : (isDark ? 'rgba(108, 99, 255, 0.3)' : '#c7d2ff'),
    color: actionButtonActive ? 'white' : (isDark ? '#6b73b7' : '#6b73b7'),
    cursor: viewButtonDisabled ? 'not-allowed' : 'pointer',
  };

  const openStock = (stock: Stock) => {
    setSearchQuery(stock.company);
    setSelectedStock(stock);
  };

  return (
    <div className="pb-28 px-4" style={{ backgroundColor: bgColor, minHeight: '100vh' }}>
      {/* Header */}
      <div className="pt-5">
        <button
          onClick={() => { if (onBack) { onBack(); return; } onNavigate?.('home'); }}
          className="p-1 rounded-lg"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={28} />
        </button>
      </div>

      <div className="pt-6">
        <h1 className="text-6xl font-bold leading-none" style={{ color: textColor }}>
          Search Stocks
        </h1>
        <p className="text-sm mt-3 max-w-sm" style={{ color: textSecondary }}>
          Search and explore stocks before adding to favourites
        </p>
      </div>

      <div className="relative mt-6">
        <div
          className="rounded-full px-5 py-4 flex items-center gap-3"
          style={{
            backgroundColor: searchSurfaceColor,
            border: `1px solid ${searchBorderColor}`,
            boxShadow: searchBoxShadow,
          }}
        >
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search by ticker or company name..."
            className={`w-full bg-transparent outline-none text-2xl ${isDark ? 'placeholder:text-white/50' : 'placeholder:text-slate-500'}`}
            style={{ color: textColor }}
          />
          <SearchIcon size={34} color={textSecondary} />
        </div>

        {showDropdown && (
          <div
            className="absolute left-0 right-0 top-full mt-2 overflow-y-auto rounded-[2rem] shadow-lg z-20"
            style={{
              maxHeight: '260px',
              backgroundColor: surfaceColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            {isSearching && (
              <div className="px-4 py-3 text-sm" style={{ color: textSecondary }}>
                Searching...
              </div>
            )}

            {!isSearching && dbResults.length > 0 && (
              <div className="grid gap-1 p-2">
                {dbResults.map((resultStock) => (
                  <button
                    key={resultStock.id}
                    onClick={() => openStock(resultStock)}
                    className="w-full rounded-[1.5rem] px-4 py-3 text-left flex items-center justify-between"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="min-w-0">
                      <div className="text-lg font-semibold" style={{ color: textColor }}>
                        {resultStock.company}
                      </div>
                      <div
                        className="text-sm truncate"
                        style={{ color: textSecondary }}
                      >
                        {resultStock.tickers?.length
                          ? resultStock.tickers.join(' · ')
                          : 'No ticker available'}
                      </div>
                    </div>
                    {resultStock.sector && (
                      <div className="ml-3 text-xs" style={{ color: textSecondary }}>
                        {resultStock.sector}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!isSearching && hasMoreResults && (
              <button
                type="button"
                onClick={loadMoreResults}
                disabled={isLoadingMore}
                className="w-full px-4 py-3 text-sm disabled:opacity-60"
                style={{ color: textSecondary }}
              >
                {isLoadingMore ? 'Loading...' : 'Load more results'}
              </button>
            )}

            {!isSearching && dbResults.length === 0 && (
              <div className="px-4 py-3 text-sm" style={{ color: textSecondary }}>
                {searchError
                  ? `Search failed: ${searchError}`
                  : `No companies found for "${searchQuery}".`}
              </div>
            )}
          </div>
        )}
      </div>

      {searchQuery && searchError && dbResults.length > 0 && (
        <div className="mt-3 text-xs" style={{ color: textSecondary }}>
          Search failed: {searchError}
        </div>
      )}

      <div className="mt-4 grid gap-3">
        <button
          onClick={handleViewStock}
          disabled={viewButtonDisabled}
          className="w-full rounded-full py-4 text-2xl font-medium disabled:opacity-60"
          style={viewButtonStyle}
        >
          View Stock
        </button>

        <button
          onClick={handleAddFavourite}
          disabled={addFavouriteDisabled}
          className="w-full rounded-full py-4 text-2xl font-medium disabled:opacity-60"
          style={{
            backgroundColor: actionButtonActive ? COLORS.primary : (isDark ? 'rgba(108, 99, 255, 0.3)' : '#c7d2ff'),
            color: actionButtonActive ? 'white' : (isDark ? '#6b73b7' : '#6b73b7'),
          }}
        >
          {actionAlreadyFavourite ? 'Added to Favourites' : canAddFavourite ? 'Add to Favourites' : 'Tiles Full - More Tiles'}
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-sm mb-3" style={{ color: textSecondary }}>
          Recommended stocks
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {recommendedStocks.map((stock) => {
            return (
              <button
                key={stock.id}
                onClick={() => openStock(stock)}
                className="text-left rounded-3xl p-4 border transition-all"
                style={{
                  minHeight: '172px',
                  background: isDark
                    ? 'linear-gradient(145deg, rgba(28,38,66,0.95) 0%, rgba(20,29,52,0.95) 100%)'
                    : 'linear-gradient(145deg, rgba(241,246,255,0.98) 0%, rgba(232,239,252,0.98) 100%)',
                  borderColor: '#6C63FF',
                  boxShadow: '0 0 0 1px rgba(108, 99, 255, 0.22)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="rounded-2xl px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: isDark ? 'rgba(108, 99, 255, 0.22)' : 'rgba(108, 99, 255, 0.16)',
                      color: textColor,
                    }}
                  >
                    {stock.sector || 'Stock'}
                  </div>
                </div>

                <div className="text-2xl font-bold mt-4 leading-tight" style={{ color: textColor }}>
                  {stock.company}
                </div>
                <div className="text-sm mt-2 leading-snug" style={{ color: textSecondary }}>
                  {stock.tickers?.length ? stock.tickers.join(' · ') : 'No ticker available'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => onNavigate?.('discover')}
          className="w-full rounded-full py-4 text-2xl font-medium"
          style={{ backgroundColor: surfaceColor, color: textColor }}
        >
          Explore More Stocks
        </button>
      </div>

      <div className="h-8" />
    </div>
  );
};
