import EditPostClient from '@/components/EditPostClient';

export const dynamic = 'force-dynamic';

export default function EditPostPage({ params }) {
  return (
    <div className="admin-shell">
      <div className="admin-wrap">
        <EditPostClient id={params.id} />
      </div>
    </div>
  );
}
