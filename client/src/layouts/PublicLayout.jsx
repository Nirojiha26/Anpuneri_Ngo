import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff', borderRadius: '12px' },
          success: { style: { background: '#2E7D32', color: '#fff' } },
          error: { style: { background: '#c62828', color: '#fff' } },
        }}
      />
    </div>
  );
};

export default PublicLayout;
