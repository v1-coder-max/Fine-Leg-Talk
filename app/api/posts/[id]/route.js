import { NextResponse } from 'next/server';
import { fetchPostsFile, commitPostsFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  try {
    const { json } = await fetchPostsFile();
    const post = (json.posts || []).find((p) => p.id === params.id);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const { sha, json } = await fetchPostsFile();
    const posts = json.posts || [];
    const idx = posts.findIndex((p) => p.id === params.id);

    if (idx === -1) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (body.featured) {
      posts.forEach((p, i) => { if (i !== idx) p.featured = false; });
    }

    posts[idx] = { ...posts[idx], ...body, id: params.id };

    await commitPostsFile({
      posts,
      message: `Update post: ${posts[idx].title}`,
      sha,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { sha, json } = await fetchPostsFile();
    const posts = json.posts || [];
    const target = posts.find((p) => p.id === params.id);
    if (!target) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const newPosts = posts.filter((p) => p.id !== params.id);

    await commitPostsFile({
      posts: newPosts,
      message: `Delete post: ${target.title}`,
      sha,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
