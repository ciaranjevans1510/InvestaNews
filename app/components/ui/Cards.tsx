'use client';

import React from 'react';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';
import type { Stock } from '../../types';
import { Card, Badge } from './Basic';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';

interface StockCardProps {
  stock: Stock;
  onAddFavourite?: (stock: Stock) => void;
  onRemoveFavourite?: (stockId: string) => void;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onAddFavourite,
  onRemoveFavourite,
  compact = false,
  size = 'md',
}) => {
  const { theme } = useTheme();
  const { isFavourite, addFavourite, removeFavourite } = useAppContext();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  const isLiked = isFavourite(stock.id);
  const isPositive = stock.change >= 0;

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      removeFavourite(stock.id);
      onRemoveFavourite?.(stock.id);
    } else {
      addFavourite(stock);
      onAddFavourite?.(stock);
    }
  };

  const sizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  if (compact) {
    return (
      <Card className={`${sizeStyles[size]} flex items-center justify-between cursor-pointer hover:scale-105 transition-transform`}>
        <div className="flex-1">
          <div className="font-semibold" style={{ color: textColor }}>
            {stock.symbol}
          </div>
          <div className="text-sm" style={{ color: textSecondary }}>
            {stock.company}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold" style={{ color: textColor }}>
            ${stock.price.toFixed(2)}
          </div>
          <div
            className="text-sm font-medium flex items-center justify-end gap-1"
            style={{ color: isPositive ? '#10b981' : '#ef4444' }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {stock.percentChange > 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${sizeStyles[size]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-lg" style={{ color: textColor }}>
            {stock.symbol}
          </div>
          <div className="text-sm" style={{ color: textSecondary }}>
            {stock.company}
          </div>
        </div>
        <button
          onClick={handleFavourite}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: isLiked ? COLORS.primary + '20' : 'transparent',
          }}
        >
          <Heart
            size={20}
            fill={isLiked ? COLORS.primary : 'none'}
            color={isLiked ? COLORS.primary : textSecondary}
          />
        </button>
      </div>

      <Badge variant="sector" color={stock.sectorColor} size="sm">
        {stock.sector}
      </Badge>

      <div className="mt-4 flex justify-between items-end">
        <div>
          <div className="text-2xl font-bold" style={{ color: textColor }}>
            ${stock.price.toFixed(2)}
          </div>
          <div
            className="text-sm font-medium flex items-center gap-1 mt-1"
            style={{ color: isPositive ? '#10b981' : '#ef4444' }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
          </div>
        </div>
      </div>
    </Card>
  );
};

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  icon?: React.ReactNode;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  icon,
  onClear,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.dark.surface : COLORS.light.surface;
  const borderColor = isDark ? COLORS.dark.border : COLORS.light.border;
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  return (
    <div className={`flex items-center gap-2 rounded-lg px-4 py-3 ${className}`} style={{
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
    }}>
      {icon && <span style={{ color: textSecondary }}>{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 bg-transparent outline-none"
        style={{ color: textColor }}
      />
      {value && onClear && (
        <button onClick={onClear} className="p-1" style={{ color: textSecondary }}>
          ✕
        </button>
      )}
    </div>
  );
};
