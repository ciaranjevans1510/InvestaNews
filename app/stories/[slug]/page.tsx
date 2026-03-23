import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseClient } from '../../../lib/supabase/server'

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

  if (storyError || !story) {
    notFound()
  }

  const { data: slides, error: slidesError } = await supabase
    .from('slides')
    .select('id, story_id, slide_order, headline, body, image_url, chart_url, cta_text, cta_url')
    .eq('story_id', story.id)
    .order('slide_order', { ascending: true })

  return (
    <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/">← Back</Link>

      <header style={{ marginTop: '16px', marginBottom: '24px' }}>
        <h1>{story.title}</h1>
        {story.subtitle && <p style={{ opacity: 0.8 }}>{story.subtitle}</p>}
        {story.summary && <p>{story.summary}</p>}
      </header>

      {slidesError && (
        <div style={{ color: 'red' }}>
          <p>Failed to load slides:</p>
          <pre>{slidesError.message}</pre>
        </div>
      )}

      {!slidesError && (!slides || slides.length === 0) && (
        <p>No slides found for this story.</p>
      )}

      {slides && slides.length > 0 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {slides.map((slide: any) => (
            <section
              key={slide.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <p style={{ fontSize: '14px', opacity: 0.6, marginBottom: '8px' }}>
                Slide {slide.slide_order}
              </p>

              {slide.headline && (
                <h2 style={{ marginBottom: '12px' }}>{slide.headline}</h2>
              )}

              {slide.body && <p style={{ marginBottom: '12px' }}>{slide.body}</p>}

              {slide.image_url && (
                <p style={{ fontSize: '14px', opacity: 0.7 }}>
                  Image URL: {slide.image_url}
                </p>
              )}

              {slide.chart_url && (
                <p style={{ fontSize: '14px', opacity: 0.7 }}>
                  Chart URL: {slide.chart_url}
                </p>
              )}

              {slide.cta_text && slide.cta_url && (
                <p style={{ marginTop: '12px' }}>
                  <a href={slide.cta_url} target="_blank" rel="noreferrer">
                    {slide.cta_text}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  )
}