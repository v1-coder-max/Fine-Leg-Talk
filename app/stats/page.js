import { SITE_URL } from '@/lib/posts';
import StatsClient from '@/components/StatsClient';

export const metadata = {
  title: 'Cricket Player Search — Stats & Profiles',
  description: 'Search any cricketer and get their career profile, biography and stats — powered by Wikipedia.',
  alternates: { canonical: `${SITE_URL}/stats` },
  openGraph: {
    title: 'Cricket Player Search — Fine Leg Talk',
    description: 'Search any cricketer and get their career profile, biography and stats.',
    url: `${SITE_URL}/stats`,
    images: ['/FineLegTalk.jpeg'],
  },
};

export default function StatsPage() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <div className="ph-lbl">Fine Leg Talk</div>
          <h1 className="ph-h1">Search Any <em>Player</em></h1>
          <p className="ph-sub">Type a name — we'll pull their career profile straight from Wikipedia. Every cricketer, every format, every era.</p>
        </div>
      </header>
      <StatsClient />
    </>
  );
}
