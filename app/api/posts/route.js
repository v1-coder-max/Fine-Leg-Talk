import { NextResponse } from 'next/server';
import { fetchPostsFile, commitPostsFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { json } = await fetchPostsFile();
    return NextResponse.json({ posts: json.posts || [] });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body?.id || !body?.title) {
      return NextResponse.json({ error: 'id and title are required' }, { status: 400 });
    }

    const { sha, json } = await fetchPostsFile();
    const posts = json.posts || [];

    if (posts.some((p) => p.id === body.id)) {
      return NextResponse.json({ error: `A post with id "${body.id}" already exists` }, { status: 409 });
    }

    if (body.featured) {
      posts.forEach((p) => { p.featured = false; });
    }

    posts.unshift(body);

    await commitPostsFile({
      posts,
      message: `Add post: ${body.title}`,
      sha,
    });

    return NextResponse.json({ ok: true, id: body.id });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
