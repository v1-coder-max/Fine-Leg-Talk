import { SITE_URL } from '@/lib/posts';
import MatchesClient from '@/components/MatchesClient';

export const metadata = {
  title: 'Cricket History Search — Series & Tournaments',
  description: 'Search any cricket series, tournament or iconic match in history — from the Ashes to the World Cup, IPL to legendary Test battles.',
  alternates: { canonical: `${SITE_URL}/matches` },
  openGraph: {
    title: 'Cricket History Search — Fine Leg Talk',
    description: 'Search any cricket series, tournament or iconic match in history.',
    url: `${SITE_URL}/matches`,
    images: ['/FineLegTalk.jpeg'],
  },
};

export default function MatchesPage() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <div className="ph-lbl">Fine Leg Talk</div>
          <h1 className="ph-h1">Cricket <em>History</em></h1>
          <p className="ph-sub">Search any series, tournament or iconic contest — from the Ashes to the World Cup, the IPL to legendary Test battles.</p>
        </div>
      </header>
      <MatchesClient />
    </>
  );
}
