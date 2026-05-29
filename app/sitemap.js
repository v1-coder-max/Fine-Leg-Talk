import { getAllPosts, SITE_URL } from '@/lib/posts';

export default function sitemap() {
  const posts = getAllPosts();
  const now = new Date();

  const staticPages = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/blogs`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/videos`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/matches`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/stats`, changeFrequency: 'weekly', priority: 0.8 },
  ].map(p => ({ ...p, lastModified: now }));

  const postPages = posts.map(p => ({
    url: `${SITE_URL}/${p.id}`,
    lastModified: p.dateISO ? new Date(p.dateISO) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...postPages];
}
