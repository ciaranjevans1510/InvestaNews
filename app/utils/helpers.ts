import type { Theme } from '../types';
import { COLORS } from './colors';

export const getThemeColors = (theme: Theme) => {
  return theme === 'light' ? COLORS.light : COLORS.dark;
};

export const getTextColor = (theme: Theme, intensity: 'primary' | 'secondary' = 'primary') => {
  if (theme === 'light') {
    return intensity === 'primary' ? COLORS.light.text : COLORS.light.textSecondary;
  }
  return intensity === 'primary' ? COLORS.dark.text : COLORS.dark.textSecondary;
};

export const getBackgroundColor = (theme: Theme) => {
  return theme === 'light' ? COLORS.light.bg : COLORS.dark.bg;
};

export const getSurfaceColor = (theme: Theme) => {
  return theme === 'light' ? COLORS.light.surface : COLORS.dark.surface;
};

export const formatPrice = (price: number) => {
  return `$${price.toFixed(2)}`;
};

export const formatPercent = (percent: number) => {
  return `${percent > 0 ? '+' : ''}${percent.toFixed(2)}%`;
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};
