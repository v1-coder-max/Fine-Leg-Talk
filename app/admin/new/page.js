import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  return (
    <div className="admin-shell">
      <div className="admin-wrap">
        <PostEditor mode="new" />
      </div>
    </div>
  );
}
