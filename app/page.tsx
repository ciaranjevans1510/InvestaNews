import Link from 'next/link'
import { createSupabaseClient } from '../lib/supabase/server'

export default async function HomePage() {
  const supabase = createSupabaseClient()

  const { data: stories, error } = await supabase
    .from('stories')
    .select('id, slug, title, subtitle, summary')
    .order('title', { ascending: true })

  return (
    <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Investanews</h1>
      <p>Understand why markets move.</p>

      {error && (
        <div style={{ marginTop: '16px', color: 'red' }}>
          <p>Supabase error:</p>
          <pre>{error.message}</pre>
        </div>
      )}

      {!error && (!stories || stories.length === 0) && (
        <p style={{ marginTop: '16px' }}>No stories found.</p>
      )}

      {stories && stories.length > 0 && (
        <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
          {stories.map((story: any) => (
            <article
              key={story.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '16px',
              }}
            >
              <h2 style={{ marginBottom: '8px' }}>{story.title}</h2>

              {story.subtitle && (
                <p style={{ marginBottom: '8px', opacity: 0.8 }}>
                  {story.subtitle}
                </p>
              )}

              {story.summary && (
                <p style={{ marginBottom: '12px' }}>{story.summary}</p>
              )}

              <Link href={`/stories/${story.slug}`}>Read story</Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}