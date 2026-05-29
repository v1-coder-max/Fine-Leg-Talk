import { getAllPosts } from '@/lib/posts';
import HomeContent from '@/components/HomeContent';
import FadeObserver from '@/components/FadeObserver';

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.find(p => p.featured) || posts[0];
  const popular = posts.filter(p => p.id !== featured?.id).slice(0, 3);

  return (
    <>
      <FadeObserver />
      <HomeContent featured={featured} popular={popular} />
    </>
  );
}
