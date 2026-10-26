import type { Stock } from '../app/types';
import { getPublicSupabaseClient } from './supabase/client';

export interface StockDirectoryCompany {
  id: string;
  company_name: string;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  is_active: boolean;
  tickers: string[] | null;
  category_id: string | null;
  category_name: string | null;
  category_slug: string | null;
  parent_category_id: string | null;
  parent_category_name: string | null;
  parent_category_slug: string | null;
  is_top_1000: boolean;
}

export interface DirectoryCategory {
  id: string | null;
  slug: string | null;
  name: string;
  kind: 'parent' | 'subcategory';
  parentId?: string;
  parentName?: string;
}

const DIRECTORY_COLUMNS =
  'id, company_name, description, logo_url, country, is_active, tickers, category_id, category_name, category_slug, parent_category_id, parent_category_name, parent_category_slug, is_top_1000';
const DIRECTORY_PAGE_SIZE = 1000;

export function mapDirectoryCompany(row: StockDirectoryCompany): Stock {
  return {
    id: row.id,
    symbol: undefined,
    tickers: row.tickers ?? [],
    company: row.company_name?.trim() || 'Unknown company',
    price: 0,
    change: 0,
    percentChange: 0,
    sector: row.category_name || row.parent_category_name || '',
    sectorColor: '#6f63ff',
    image: row.logo_url || undefined,
    description: row.description || undefined,
    country: row.country || undefined,
    categoryId: row.category_id || undefined,
    categoryName: row.category_name || undefined,
    categorySlug: row.category_slug || undefined,
    parentCategoryId: row.parent_category_id || undefined,
    parentCategoryName: row.parent_category_name || undefined,
    parentCategorySlug: row.parent_category_slug || undefined,
    isTop1000: row.is_top_1000,
  };
}

export async function fetchDirectoryPage(offset: number, pageSize: number) {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from('stock_directory')
    .select(DIRECTORY_COLUMNS)
    .eq('is_active', true)
    .order('is_top_1000', { ascending: false })
    .order('company_name', { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;
  return (data ?? []) as StockDirectoryCompany[];
}

function escapeLikePattern(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

function relevance(row: StockDirectoryCompany, query: string) {
  const normalizedQuery = query.toLocaleLowerCase();
  const name = row.company_name?.toLocaleLowerCase() ?? '';
  const tickers = (row.tickers ?? []).map((ticker) => ticker.toLocaleLowerCase());

  if (tickers.includes(normalizedQuery)) return 0;
  if (name === normalizedQuery) return 1;
  if (tickers.some((ticker) => ticker.startsWith(normalizedQuery))) return 2;
  if (name.startsWith(normalizedQuery)) return 3;
  if (tickers.some((ticker) => ticker.includes(normalizedQuery))) return 4;
  return 5;
}

export async function searchDirectoryCompanies(query: string, offset: number, pageSize: number) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  const supabase = getPublicSupabaseClient();
  const pattern = `%${escapeLikePattern(normalizedQuery)}%`;
  const pageSizeFromServer = 1000;
  const companiesById = new Map<string, StockDirectoryCompany>();

  let pageOffset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('stock_directory')
      .select(DIRECTORY_COLUMNS)
      .eq('is_active', true)
      .ilike('company_name', pattern)
      .order('id', { ascending: true })
      .range(pageOffset, pageOffset + pageSizeFromServer - 1);

    if (error) throw error;
    for (const row of (data ?? []) as StockDirectoryCompany[]) {
      companiesById.set(row.id, row);
    }
    if (!data?.length) break;
    pageOffset += data.length;
  }

  const listingIds = new Set<string>();
  pageOffset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('stock_listings')
      .select('stock_id')
      .ilike('ticker', pattern)
      .order('stock_id', { ascending: true })
      .range(pageOffset, pageOffset + pageSizeFromServer - 1);

    if (error) throw error;
    for (const listing of data ?? []) {
      if (listing.stock_id) listingIds.add(String(listing.stock_id));
    }
    if (!data?.length) break;
    pageOffset += data.length;
  }

  const missingIds = [...listingIds].filter((id) => !companiesById.has(id));
  for (let start = 0; start < missingIds.length; start += 500) {
    const { data, error } = await supabase
      .from('stock_directory')
      .select(DIRECTORY_COLUMNS)
      .eq('is_active', true)
      .in('id', missingIds.slice(start, start + 500));

    if (error) throw error;
    for (const row of (data ?? []) as StockDirectoryCompany[]) {
      companiesById.set(row.id, row);
    }
  }

  const rows = [...companiesById.values()];
  rows.sort((a, b) => (
    relevance(a, normalizedQuery) - relevance(b, normalizedQuery) ||
    Number(b.is_top_1000) - Number(a.is_top_1000) ||
    a.company_name.localeCompare(b.company_name)
  ));
  return rows.slice(offset, offset + pageSize);
}

export async function fetchDirectoryCategories(): Promise<DirectoryCategory[]> {
  const supabase = getPublicSupabaseClient();
  const categoryIdsWithCompanies = new Set<string>();
  const parentIdsWithCompanies = new Set<string>();
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('stock_directory')
      .select('category_id, parent_category_id')
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(offset, offset + DIRECTORY_PAGE_SIZE - 1);

    if (error) throw error;
    const rows = data ?? [];

    for (const row of rows) {
      if (row.category_id) categoryIdsWithCompanies.add(row.category_id);
      if (row.parent_category_id) parentIdsWithCompanies.add(row.parent_category_id);
    }

    if (rows.length === 0) break;
    offset += rows.length;
  }

  const hierarchy: Array<{
    id: string;
    name: string;
    slug: string;
    parent_category_id: string | null;
  }> = [];
  offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, display_name, slug, parent_category_id')
      .order('id', { ascending: true })
      .range(offset, offset + DIRECTORY_PAGE_SIZE - 1);

    if (error) throw error;
    const rows = data ?? [];

    hierarchy.push(...rows.map((row) => ({
      id: row.id,
      name: row.display_name || row.name,
      slug: row.slug,
      parent_category_id: row.parent_category_id,
    })));

    if (rows.length === 0) break;
    offset += rows.length;
  }

  const parents = hierarchy
    .filter((category) => !category.parent_category_id)
    .sort((a, b) => a.name.localeCompare(b.name));
  const childrenByParent = new Map<string, typeof hierarchy>();
  for (const category of hierarchy) {
    if (!category.parent_category_id) continue;
    const children = childrenByParent.get(category.parent_category_id) ?? [];
    children.push(category);
    childrenByParent.set(category.parent_category_id, children);
  }

  const categories: DirectoryCategory[] = [];
  for (const parent of parents) {
    const children = (childrenByParent.get(parent.id) ?? [])
      .sort((a, b) => a.name.localeCompare(b.name));
    const hasCompanies = categoryIdsWithCompanies.has(parent.id)
      || parentIdsWithCompanies.has(parent.id)
      || children.some((child) => categoryIdsWithCompanies.has(child.id));

    if (!hasCompanies) continue;

    categories.push({
      id: parent.id,
      slug: parent.slug,
      name: parent.name,
      kind: 'parent',
    });

    for (const child of children) {
      if (!categoryIdsWithCompanies.has(child.id)) continue;
      categories.push({
        id: child.id,
        slug: child.slug,
        name: child.name,
        kind: 'subcategory',
        parentId: parent.id,
        parentName: parent.name,
      });
    }
  }

  return categories;
}

export async function fetchCategoryCompanies(
  category: DirectoryCategory,
  offset: number,
  pageSize: number,
) {
  if (!category.id && !category.slug) {
    throw new Error(`Category "${category.name}" has no ID or slug.`);
  }

  const supabase = getPublicSupabaseClient();
  let request = supabase
    .from('stock_directory')
    .select(DIRECTORY_COLUMNS)
    .eq('is_active', true);

  if (category.kind === 'parent') {
    request = category.id
      ? request.or(`parent_category_id.eq.${category.id},category_id.eq.${category.id}`)
      : request.or(`parent_category_slug.eq.${category.slug},category_slug.eq.${category.slug}`);
  } else {
    request = category.id
      ? request.eq('category_id', category.id)
      : request.eq('category_slug', category.slug);
  }

  const { data, error } = await request
    .order('is_top_1000', { ascending: false })
    .order('company_name', { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error) throw error;
  return (data ?? []) as StockDirectoryCompany[];
}

export async function fetchDirectoryCompanyById(id: string) {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from('stock_directory')
    .select(DIRECTORY_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return (data as StockDirectoryCompany | null) ?? null;
}

export async function resolveDirectoryCompanyByTicker(ticker: string) {
  const supabase = getPublicSupabaseClient();
  const { data: listings, error: listingsError } = await supabase
    .from('stock_listings')
    .select('stock_id')
    .ilike('ticker', ticker.trim());

  if (listingsError) throw listingsError;
  const stockIds = [...new Set((listings ?? []).map((listing) => listing.stock_id).filter(Boolean))];

  if (stockIds.length !== 1) return null;
  return fetchDirectoryCompanyById(String(stockIds[0]));
}

export async function resolveDirectoryCompany(stock: Stock) {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(stock.id)) {
    const byId = await fetchDirectoryCompanyById(stock.id);
    if (byId) return byId;
  }

  const tickers = stock.tickers?.length
    ? stock.tickers
    : stock.symbol
      ? [stock.symbol]
      : [];

  const candidates = (await Promise.all(
    tickers.map((ticker) => resolveDirectoryCompanyByTicker(ticker)),
  )).filter((company): company is StockDirectoryCompany => Boolean(company));
  const uniqueCompanies = new Map(candidates.map((company) => [company.id, company]));
  return uniqueCompanies.size === 1 ? [...uniqueCompanies.values()][0] : null;
}
