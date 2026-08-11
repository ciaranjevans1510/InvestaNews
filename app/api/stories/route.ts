import { NextResponse } from 'next/server';
import { createSupabaseClient } from '../../../lib/supabase/server';

interface StoryPreview {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  sector?: string;
  status?: string;
}

const normalizeQueryParam = (raw: string | null) => {
  return String(raw ?? '').trim();
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = normalizeQueryParam(searchParams.get('status')) || 'published';
    const sector = normalizeQueryParam(searchParams.get('sector'));
    const supabase = createSupabaseClient();

    let storyRequest = supabase
      .from('stories')
      .select('id, slug, title, subtitle, sector, status')
      .limit(8);

    if (status) {
      storyRequest = storyRequest.eq('status', status);
    }

    if (sector) {
      storyRequest = storyRequest.eq('sector', sector);
    }

    const { data, error } = await storyRequest;

    if (error) {
      return NextResponse.json({ stories: [] }, { status: 200 });
    }

    const stories = (data ?? []) as StoryPreview[];

    return NextResponse.json({ stories }, { status: 200 });
  } catch {
    return NextResponse.json({ stories: [] }, { status: 200 });
  }
}
