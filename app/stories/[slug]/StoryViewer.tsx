'use client';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StoryViewerStory {
  title: string;
  subtitle?: string | null;
  summary?: string | null;
}

interface StoryViewerSlide {
  id: string | number;
  slide_order: number;
  headline?: string | null;
  body?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
}

interface StoryViewerImpact {
  moveDirection?: string | null;
  movePercent?: number | null;
}

interface StoryViewerProps {
  story: StoryViewerStory;
  slides: StoryViewerSlide[];
  impact?: StoryViewerImpact | null;
}

const labelForSlide = (slideOrder: number) => {
  if (slideOrder === 1) return 'Introduction';
  if (slideOrder === 2) return 'What Happened';
  if (slideOrder === 3) return 'Why It Matters';
  if (slideOrder === 4) return 'Key Movers';
  if (slideOrder === 5) return 'Bigger Picture';
  if (slideOrder === 6) return 'What To Watch';
  return `Slide ${slideOrder}`;
};

export default function StoryViewer({ story, slides, impact }: StoryViewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentSlide = slides[currentIndex];

  const impactLabel = useMemo(() => {
    if (impact?.movePercent === null || impact?.movePercent === undefined) {
      return 'Story update';
    }
    const prefix = impact.movePercent >= 0 ? '+' : '';
    return `${prefix}${impact.movePercent.toFixed(1)}%`;
  }, [impact]);

  const timeLabel = useMemo(() => {
    const remaining = slides.length - currentIndex - 1;
    if (remaining <= 0) return 'End of story';
    if (remaining === 1) return '1 slide left';
    return `${remaining} slides left`;
  }, [currentIndex, slides.length]);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = touchStartX - endX;

    if (delta > 40) {
      goNext();
    } else if (delta < -40) {
      goPrev();
    }

    setTouchStartX(null);
  };

  const handleCardClick = () => {
    if (currentIndex < slides.length - 1) {
      goNext();
    }
  };

  return (
    <main
      className="min-h-screen px-4 pb-12"
      style={{
        background: 'linear-gradient(180deg, #171d38 0%, #13386d 100%)',
      }}
    >
      <div className="mx-auto max-w-md pt-5">
        <div className="flex items-start justify-between text-white/65">
          <button
            onClick={goBack}
            className="p-1 rounded-lg"
            aria-label="Back"
          >
            <ArrowLeft size={28} />
          </button>
          <div className="pt-1 text-sm tracking-tight">Swipe for more</div>
        </div>

        <div className="mt-5 flex gap-1.5">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="h-1 flex-1 rounded-full"
              style={{
                backgroundColor:
                  slide.slide_order - 1 <= currentIndex ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)',
              }}
            />
          ))}
        </div>

        <div
          className="mt-20 rounded-[2.75rem] border border-white/10 px-8 py-14 text-white shadow-2xl"
          style={{
            minHeight: '58vh',
            background: 'linear-gradient(135deg, rgba(160,145,249,0.98) 0%, rgba(188,195,246,0.94) 100%)',
            boxShadow: '0 24px 50px rgba(0, 0, 0, 0.18)',
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleCardClick}
        >
          <div className="inline-flex rounded-full bg-white/18 px-6 py-3 text-sm text-white/95 backdrop-blur-sm">
            {labelForSlide(currentSlide.slide_order)}
          </div>

          <h1 className="mt-10 text-5xl font-semibold leading-[1.08] tracking-tight">
            {currentSlide.headline || story.title}
          </h1>

          <p className="mt-8 text-2xl leading-relaxed text-white/96">
            {currentSlide.body || story.summary || story.subtitle || 'No story text available.'}
          </p>

          {currentSlide.cta_text && currentSlide.cta_url && (
            <a
              href={currentSlide.cta_url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/18 px-5 py-3 text-sm text-white"
              onClick={(event) => event.stopPropagation()}
            >
              {currentSlide.cta_text}
              <ArrowUpRight size={16} />
            </a>
          )}

          <div className="mt-16 flex items-center gap-6 text-xl text-white/92">
            <div className="inline-flex items-center gap-3">
              <ArrowUpRight size={24} />
              <span>{impactLabel}</span>
            </div>
            <span>{timeLabel}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-full px-5 py-3 text-sm text-white/90 disabled:opacity-35"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === slides.length - 1}
            className="rounded-full px-5 py-3 text-sm text-white/90 disabled:opacity-35"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
