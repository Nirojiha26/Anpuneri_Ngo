import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiHome, FiFolder, FiCalendar, FiImage, FiUsers, FiMessageSquare,
  FiDollarSign, FiMail, FiHelpCircle, FiSettings, FiLogOut,
  FiHeart, FiStar, FiFileText, FiAward, FiX,
} from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: <FiHome />, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Projects', path: '/admin/projects', icon: <FiFolder /> },
      { label: 'Events', path: '/admin/events', icon: <FiCalendar /> },
      { label: 'News', path: '/admin/news', icon: <FiFileText /> },
      { label: 'Gallery', path: '/admin/gallery', icon: <FiImage /> },
      { label: 'Success Stories', path: '/admin/stories', icon: <FiStar /> },
    ],
  },
  {
    label: 'Community',
    items: [
      { label: 'Volunteers', path: '/admin/volunteers', icon: <FiUsers /> },
      { label: 'Donations', path: '/admin/donations', icon: <FiDollarSign /> },
      { label: 'Messages', path: '/admin/contacts', icon: <FiMail /> },
      { label: 'Testimonials', path: '/admin/testimonials', icon: <FiMessageSquare /> },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Team', path: '/admin/team', icon: <FiAward /> },
      { label: 'FAQs', path: '/admin/faqs', icon: <FiHelpCircle /> },
      { label: 'Users', path: '/admin/users', icon: <FiUsers /> },
      { label: 'Settings', path: '/admin/settings', icon: <FiSettings /> },
    ],
  },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { data: settings } = useSelector((s) => s.settings);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiHeart className="text-white w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{settings?.org_name || 'Anpuneri'}</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white p-1">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">
                {section.label}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `admin-sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="admin-sidebar-link w-full text-red-400 hover:bg-red-900/30 hover:text-red-400"
          >
            <FiLogOut className="text-lg" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
