import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopBar from '../components/admin/AdminTopBar';
import { PageLoader } from '../components/common/Loading';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);

  if (loading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  if (user && !['admin', 'editor'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminTopBar
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px' },
          success: { style: { background: '#2E7D32', color: '#fff' } },
          error: { style: { background: '#c62828', color: '#fff' } },
        }}
      />
    </div>
  );
};

export default AdminLayout;
