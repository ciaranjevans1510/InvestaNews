import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../lib/supabase/server';

interface StoryPreview {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
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
      return NextResponse.json({ stories: [], recommendedStories: [] }, { status: 200 });
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

    for (const relation of storyStocks ?? []) {
      const ticker = Array.isArray((relation as any).stocks)
        ? (relation as any).stocks[0]?.ticker
        : (relation as any).stocks?.ticker;

      if (ticker && preferredTickers.includes(String(ticker).toUpperCase())) {
        recommendedStoryIds.add(String((relation as any).story_id));
      }
    }

    const recommendedStories = stories.filter((story) => recommendedStoryIds.has(story.id));

    return NextResponse.json({ stories, recommendedStories }, { status: 200 });
  } catch {
    return NextResponse.json({ stories: [], recommendedStories: [] }, { status: 200 });
  }
}
