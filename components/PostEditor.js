'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { markdownToBlocks, blocksToMarkdown, tocFromBlocks } from '@/lib/markdown';
import PostBody from './PostBody';

function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function todayDate() {
  const d = new Date();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const BG_OPTIONS = ['bg1','bg2','bg3','bg4','bg5','bg6','bg7','bg8'];
const BADGE_OPTIONS = [
  ['b-gold', 'Gold'],
  ['b-rev', 'Review (gold)'],
  ['b-green', 'Green'],
  ['b-test', 'Test (blue)'],
  ['b-odi', 'ODI (green)'],
  ['b-t20', 'T20 (pink)'],
  ['b-hist', 'History (amber)'],
];
const CATEGORY_OPTIONS = ['review', 'analysis', 'opinion', 'ipl', 'history'];

const HELP_TEXT = `Headings:    ## Section title    ### Smaller heading
Bold:        **bold text**
Italic:      *italic text*
Quote:       > Quote text
             > — Attribution
Table:       | Col1 | Col2 |
             |------|------|
             | a    | b    |
YouTube:     [youtube:VIDEO_ID]

Paragraphs are separated by a blank line.`;

export default function PostEditor({ initialPost, mode }) {
  const router = useRouter();
  const isEdit = mode === 'edit';

  const initialContent = useMemo(() => {
    if (initialPost?.content && Array.isArray(initialPost.content)) {
      return blocksToMarkdown(initialPost.content);
    }
    return '';
  }, [initialPost]);

  const [form, setForm] = useState({
    id: initialPost?.id || '',
    title: initialPost?.title || '',
    category: initialPost?.category || 'analysis',
    badge: initialPost?.badge || 'Analysis',
    badgeClass: initialPost?.badgeClass || 'b-gold',
    date: initialPost?.date || todayDate(),
    dateISO: initialPost?.dateISO || todayISO(),
    readTime: initialPost?.readTime || '6 min',
    emoji: initialPost?.emoji || '🏏',
    bgClass: initialPost?.bgClass || 'bg1',
    featured: !!initialPost?.featured,
    standfirst: initialPost?.standfirst || '',
    excerpt: initialPost?.excerpt || '',
    tags: (initialPost?.tags || []).join(', '),
  });
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onTitleChange = (v) => {
    setField('title', v);
    if (!isEdit && autoSlug) setField('id', slugify(v));
  };

  const onIdChange = (v) => {
    setField('id', slugify(v));
    setAutoSlug(false);
  };

  const previewBlocks = useMemo(() => markdownToBlocks(content), [content]);

  const save = async () => {
    setError('');
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (!form.id.trim()) { setError('Slug is required'); return; }
    if (!form.excerpt.trim()) { setError('Excerpt is required'); return; }
    if (!content.trim()) { setError('Content is required'); return; }

    const blocks = markdownToBlocks(content);
    const toc = tocFromBlocks(blocks);

    const body = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      content: blocks,
      toc,
    };

    setSaving(true);
    try {
      const url = isEdit ? `/api/posts/${encodeURIComponent(initialPost.id)}` : '/api/posts';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      alert(`Saved! Vercel will redeploy in about 60 seconds — then your post is live at /${body.id}`);
      router.push('/admin');
      router.refresh();
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <>
      <div className="admin-bar">
        <div className="admin-title">
          <span>{isEdit ? 'Edit Post' : 'New Post'}</span>
          {isEdit && <small>/{initialPost.id}</small>}
        </div>
        <div className="admin-actions">
          <Link href="/admin" className="admin-btn admin-btn-out">← Cancel</Link>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(232,76,76,0.1)', border: '1px solid rgba(232,76,76,0.3)', borderRadius: 8, padding: 14, marginBottom: 18, color: '#e84c4c', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div className="admin-form">
        <div className="form-col">
          <div className="form-field">
            <label>Title</label>
            <input type="text" value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="The headline of your post" />
          </div>

          <div className="form-field">
            <label>Slug (URL)</label>
            <input type="text" value={form.id} onChange={(e) => onIdChange(e.target.value)} disabled={isEdit} placeholder="auto-generated-from-title" />
            <span className="hint">{isEdit ? 'Slug cannot be changed after creation' : 'Lives at /' + (form.id || 'your-slug') + ' once published'}</span>
          </div>

          <div className="form-grid2">
            <div className="form-field">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Read time</label>
              <input type="text" value={form.readTime} onChange={(e) => setField('readTime', e.target.value)} placeholder="6 min" />
            </div>
          </div>

          <div className="form-grid2">
            <div className="form-field">
              <label>Badge text</label>
              <input type="text" value={form.badge} onChange={(e) => setField('badge', e.target.value)} placeholder="Analysis" />
            </div>
            <div className="form-field">
              <label>Badge colour</label>
              <select value={form.badgeClass} onChange={(e) => setField('badgeClass', e.target.value)}>
                {BADGE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="form-grid3">
            <div className="form-field">
              <label>Display date</label>
              <input type="text" value={form.date} onChange={(e) => setField('date', e.target.value)} placeholder="May 24, 2026" />
            </div>
            <div className="form-field">
              <label>Date (ISO)</label>
              <input type="date" value={form.dateISO} onChange={(e) => setField('dateISO', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Emoji</label>
              <input type="text" value={form.emoji} onChange={(e) => setField('emoji', e.target.value)} placeholder="🏏" />
            </div>
          </div>

          <div className="form-grid2">
            <div className="form-field">
              <label>Background gradient</label>
              <select value={form.bgClass} onChange={(e) => setField('bgClass', e.target.value)}>
                {BG_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-field" style={{ justifyContent: 'flex-end' }}>
              <label>&nbsp;</label>
              <label className="form-toggle" style={{ padding: '11px 0' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} />
                <span style={{ fontSize: '0.88rem', color: 'var(--cream)' }}>Featured post (pin to top)</span>
              </label>
            </div>
          </div>

          <div className="form-field">
            <label>Excerpt (shown on cards, ~150 chars)</label>
            <textarea rows={3} value={form.excerpt} onChange={(e) => setField('excerpt', e.target.value)} placeholder="A short summary that hooks readers." />
          </div>

          <div className="form-field">
            <label>Standfirst (intro paragraph, optional)</label>
            <textarea rows={3} value={form.standfirst} onChange={(e) => setField('standfirst', e.target.value)} placeholder="A 1–2 sentence intro shown above the post body." />
          </div>

          <div className="form-field">
            <label>Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setField('tags', e.target.value)} placeholder="India vs England, Bumrah, Test cricket" />
          </div>

          <div className="form-field">
            <label>Content (markdown)</label>
            <textarea
              rows={22}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your post here in markdown.\n\n## Section heading\n\nA paragraph with **bold** and *italic*.\n\n> A blockquote\n> — Source`}
            />
            <div className="editor-help" style={{ whiteSpace: 'pre-line' }}>{HELP_TEXT}</div>
          </div>
        </div>

        <div className="form-col">
          <div className="preview-wrap">
            <div className="preview-h">Live preview</div>
            {form.standfirst && <p className="post-standfirst" style={{ marginBottom: 24 }}>{form.standfirst}</p>}
            {previewBlocks.length === 0
              ? <div className="preview-empty">Start writing — preview will appear here.</div>
              : <PostBody blocks={previewBlocks} />}
          </div>
        </div>
      </div>

      <div className="save-bar">
        <Link href="/admin" className="admin-btn admin-btn-out">Cancel</Link>
        <button className="admin-btn admin-btn-gold" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : (isEdit ? 'Update post' : 'Publish post')}
        </button>
      </div>
    </>
  );
}
