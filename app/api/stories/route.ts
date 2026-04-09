import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../lib/supabase/server';

interface StoryPreview {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
}

interface StoryStockRow {
  story_id: string;
  stocks: { ticker: string } | { ticker: string }[] | null;
}

const normalizeTickers = (raw: string | null): string[] => {
  if (!raw) return [];

  return Array.from(
    new Set(
      raw
        .split(',')
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean),
    ),
  );
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const preferredTickers = normalizeTickers(searchParams.get('tickers'));
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('stories')
      .select('id, slug, title, subtitle')
      .limit(8);

    if (error) {
      return NextResponse.json({ stories: [], recommendedStories: [] }, { status: 500 });
    }

    const stories = (data ?? []) as StoryPreview[];

    if (preferredTickers.length === 0 || stories.length === 0) {
      return NextResponse.json({ stories, recommendedStories: [] }, { status: 200 });
    }

    const storyIds = stories.map((story) => story.id);
    const { data: storyStocks } = await supabase
      .from('story_stocks')
      .select(`
        story_id,
        stocks (
          ticker
        )
      `)
      .in('story_id', storyIds);

    const recommendedStoryIds = new Set<string>();

    for (const relation of (storyStocks ?? []) as StoryStockRow[]) {
      const stockData = relation.stocks;
      const ticker = Array.isArray(stockData)
        ? stockData[0]?.ticker
        : stockData?.ticker;

      if (ticker && preferredTickers.includes(String(ticker).toUpperCase())) {
        recommendedStoryIds.add(relation.story_id);
      }
    }

    const recommendedStories = stories.filter((story) => recommendedStoryIds.has(story.id));

    return NextResponse.json({ stories, recommendedStories }, { status: 200 });
  } catch {
    return NextResponse.json({ stories: [], recommendedStories: [] }, { status: 500 });
  }
}
