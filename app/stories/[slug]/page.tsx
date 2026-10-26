import { notFound } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase/server'
import { MOCK_STORIES } from '../../utils/mockData'
import StoryViewer from './StoryViewer'

interface StoryStockLink {
  story_id: string;
  stock_id: string;
  relationship_type: string | null;
  move_direction: string | null;
  move_percent: number | null;
  display_order: number;
}

interface DirectoryStoryCompany {
  id: string;
  company_name: string | null;
  tickers: string[] | null;
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createSupabaseClient()

  const { data: story, error: storyError } = await supabase
    .from('stories')
    .select('id, slug, title, subtitle, summary')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  const mockStory = MOCK_STORIES.find((item) => item.slug === slug)

  if (storyError || !story) {
    if (!mockStory) {
      notFound()
    }

    const fallbackSlides = mockStory.slides.map((slide, index) => ({
      id: slide.id,
      slide_order: index + 1,
      headline: slide.title,
      body: slide.content,
      cta_text: null,
      cta_url: null,
    }))

    return (
      <StoryViewer
        story={{
          title: mockStory.title,
          subtitle: mockStory.subtitle,
          summary: mockStory.summary,
        }}
        slides={fallbackSlides}
        impact={null}
      />
    )
  }

  const { data: slides, error: slidesError } = await supabase
    .from('slides')
    .select('id, story_id, slide_order, headline, body, image_url, chart_url, cta_text, cta_url')
    .eq('story_id', story.id)
    .order('slide_order', { ascending: true })

  const { data: storyStocks, error: storyStocksError } = await supabase
    .from('story_stocks')
    .select(`
      story_id,
      relationship_type,
      move_direction,
      move_percent,
      display_order,
      stock_id
    `)
    .eq('story_id', story.id)
    .order('display_order', { ascending: true })

  if (storyStocksError) {
    console.error('Failed to load story company links:', storyStocksError)
  }

  const storyStockLinks = (storyStocks ?? []) as StoryStockLink[]
  const stockIds = [...new Set(storyStockLinks.map((entry) => entry.stock_id).filter(Boolean))]
  const { data: directoryCompanies, error: directoryCompaniesError } = stockIds.length
    ? await supabase
        .from('stock_directory')
        .select('id, company_name, tickers')
        .in('id', stockIds)
    : { data: [], error: null }

  if (directoryCompaniesError) {
    console.error('Failed to load companies for story links:', directoryCompaniesError)
  }

  const directoryRows = (directoryCompanies ?? []) as DirectoryStoryCompany[]
  const companiesById = new Map(directoryRows.map((company) => [company.id, company]))
  const relatedStocks = storyStockLinks
    .map((entry) => {
      const company = companiesById.get(entry.stock_id);
      if (!company) return null;

      return {
        id: company.id,
        tickers: company.tickers ?? [],
        company_name: company.company_name?.trim() || 'Unknown company',
        relationship_type: entry.relationship_type ?? 'secondary',
      };
    })
    .filter((stock): stock is {
      id: string;
      tickers: string[];
      company_name: string;
      relationship_type: string;
    } => Boolean(stock))

  const primaryImpact = storyStockLinks.find(
    (link) => link.relationship_type === 'primary',
  )

  if (slidesError || !slides || slides.length === 0) {
    return notFound()
  }

  return (
    <StoryViewer
      story={story}
      slides={slides}
      relatedStocks={relatedStocks}
      impact={{
        moveDirection: primaryImpact?.move_direction ?? null,
        movePercent: primaryImpact?.move_percent ?? null,
      }}
    />
  )
}