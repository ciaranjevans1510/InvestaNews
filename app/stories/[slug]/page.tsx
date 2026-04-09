import { notFound } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase/server'
import { MOCK_STORIES } from '../../utils/mockData'
import StoryViewer from './StoryViewer'

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

  const { data: storyStocks } = await supabase
    .from('story_stocks')
    .select(`
      relationship_type,
      move_direction,
      move_percent,
      display_order,
      stocks (
        ticker,
        company_name
      )
    `)
    .eq('story_id', story.id)
    .order('display_order', { ascending: true })

  const primary = storyStocks?.filter(
    (s: { relationship_type: string }) => s.relationship_type === 'primary'
  )

  const primaryImpact = primary?.[0]

  if (slidesError || !slides || slides.length === 0) {
    return notFound()
  }

  return (
    <StoryViewer
      story={story}
      slides={slides}
      impact={{
        moveDirection: primaryImpact?.move_direction ?? null,
        movePercent: primaryImpact?.move_percent ?? null,
      }}
    />
  )
}