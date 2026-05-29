import fs from 'fs';
import path from 'path';

export function getAllPosts() {
  const filePath = path.join(process.cwd(), 'posts.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data.posts || [];
}

export function getPostBySlug(slug) {
  return getAllPosts().find(p => p.id === slug);
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fine-leg-talk.vercel.app';
