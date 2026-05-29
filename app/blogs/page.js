import { getAllPosts, SITE_URL } from '@/lib/posts';
import BlogsList from '@/components/BlogsList';
import FadeObserver from '@/components/FadeObserver';

export const metadata = {
  title: 'Cricket Blog — Match Reviews, Analysis & Opinion',
  description: "Read Fine Leg Talk's cricket blog: in-depth match reviews, player analysis, IPL coverage, Test cricket deep dives, and honest opinions on the game.",
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    title: 'Cricket Blog — Fine Leg Talk',
    description: "In-depth match reviews, player analysis, IPL coverage and honest opinions.",
    url: `${SITE_URL}/blogs`,
    images: ['/FineLegTalk.jpeg'],
  },
};

export default function BlogsPage() {
  const posts = getAllPosts();
  const popular = posts.slice(0, 5);

  return (
    <>
      <FadeObserver />
      <header className="page-header">
        <div className="container">
          <div className="ph-lbl">Fine Leg Talk — Blog</div>
          <h1 className="ph-h1">Cricket. Written<br /><em>Properly.</em></h1>
          <p className="ph-sub">Match reviews, player analysis, IPL coverage, historical deep dives, and opinions that might make you think twice.</p>
        </div>
      </header>
      <BlogsList posts={posts} popular={popular} />
    </>
  );
}
