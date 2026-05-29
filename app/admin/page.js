import AdminDashboard from '@/components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <div className="admin-shell">
      <div className="admin-wrap">
        <AdminDashboard />
      </div>
    </div>
  );
}
