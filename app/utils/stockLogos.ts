const TICKER_DOMAINS: Record<string, string> = {
  AAPL: 'apple.com',
  MSFT: 'microsoft.com',
  NVDA: 'nvidia.com',
  TSLA: 'tesla.com',
  AMZN: 'amazon.com',
  GOOGL: 'google.com',
  GOOG: 'google.com',
  META: 'meta.com',
  NFLX: 'netflix.com',
  DIS: 'disney.com',
  NKE: 'nike.com',
  JPM: 'jpmorganchase.com',
  V: 'visa.com',
  MA: 'mastercard.com',
  KO: 'coca-colacompany.com',
  PEP: 'pepsico.com',
  XOM: 'exxonmobil.com',
  CVX: 'chevron.com',
  WMT: 'walmart.com',
  COST: 'costco.com',
};

export const getStockLogoUrl = (symbol: string): string | null => {
  const normalized = symbol.trim().toUpperCase();
  const domain = TICKER_DOMAINS[normalized];
  if (!domain) return null;

  return `https://logo.clearbit.com/${domain}`;
};

export const getStockLogoFallback = (symbol: string): string => {
  const normalized = symbol.trim().toUpperCase();
  if (!normalized) return '?';
  return normalized.slice(0, Math.min(2, normalized.length));
};
