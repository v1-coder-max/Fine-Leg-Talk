import { SITE_URL } from '@/lib/posts';
import VideosClient from '@/components/VideosClient';

export const metadata = {
  title: 'Cricket Videos & Shorts — YouTube',
  description: 'Match reviews, analysis and Shorts from the Fine Leg Talk YouTube channel.',
  alternates: { canonical: `${SITE_URL}/videos` },
  openGraph: {
    title: 'Cricket Videos & Shorts — Fine Leg Talk',
    description: 'Match reviews, analysis and Shorts from the Fine Leg Talk YouTube channel.',
    url: `${SITE_URL}/videos`,
    images: ['/FineLegTalk.jpeg'],
  },
};

export default function VideosPage() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <div className="ph-lbl">Fine Leg Talk — YouTube</div>
          <h1 className="ph-h1">Videos &amp; <em>Shorts</em></h1>
          <p className="ph-sub">Match reviews, analysis and Shorts from the Fine Leg Talk YouTube channel.</p>
        </div>
      </header>
      <VideosClient />
    </>
  );
}
