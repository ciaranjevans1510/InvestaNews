import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../lib/supabase/server';

interface StoryPreview {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  primary_sector?: string;
  sectors?: string[];
  status?: string;
}

const normalizeQueryParam = (raw: string | null) => {
  return String(raw ?? '').trim();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = normalizeQueryParam(searchParams.get('status')) || 'published';
    const primarySector = normalizeQueryParam(searchParams.get('primary_sector'));
    const supabase = createSupabaseClient();

    let storyRequest = supabase
      .from('stories')
      .select('id, slug, title, subtitle, primary_sector, sectors, status')
      .order('created_at', { ascending: false })
      .limit(50);

    if (status) {
      storyRequest = storyRequest.eq('status', status);
    }

    if (primarySector) {
      storyRequest = storyRequest.eq('primary_sector', primarySector);
    }

    const { data, error } = await storyRequest;

    if (error) {
      console.error('Supabase stories query failed:', error);
      return NextResponse.json({ stories: [] }, { status: 200 });
    }

    const stories = (data ?? []) as StoryPreview[];

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error('Stories API error:', error);
    return NextResponse.json({ stories: [] }, { status: 200 });
  }
}
