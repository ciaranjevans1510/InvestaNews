'use client';

import dynamic from 'next/dynamic';

const InvestaNewsApp = dynamic(
  () => import('./InvestaNewsApp').then(mod => ({ default: mod.InvestaNewsApp })),
  { ssr: false }
);

export default function HomePage() {
  return <InvestaNewsApp />
}