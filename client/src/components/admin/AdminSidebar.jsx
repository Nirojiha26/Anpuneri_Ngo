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
    label: 'Core Activities',
    items: [
      { label: 'Projects', path: '/admin/projects', icon: <FiFolder /> },
      { label: 'Events', path: '/admin/events', icon: <FiCalendar /> },
      { label: 'Event Registrations', path: '/admin/event-registrations', icon: <FiUsers /> },
      { label: 'Success Stories', path: '/admin/stories', icon: <FiStar /> },
    ],
  },
  {
    label: 'Media & Comms',
    items: [
      { label: 'News & Updates', path: '/admin/news', icon: <FiFileText /> },
      { label: 'Photo Gallery', path: '/admin/gallery', icon: <FiImage /> },
      { label: 'Banners / Sliders', path: '/admin/sliders', icon: <FiImage /> },
      { label: 'Inbox / Messages', path: '/admin/contacts', icon: <FiMail /> },
      { label: 'Public Reviews', path: '/admin/testimonials', icon: <FiMessageSquare /> },
    ],
  },
  {
    label: 'Community Support',
    items: [
      { label: 'Donations', path: '/admin/donations', icon: <FiDollarSign /> },
      { label: 'Volunteers', path: '/admin/volunteers', icon: <FiUsers /> },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Team Members', path: '/admin/team', icon: <FiAward /> },
      { label: 'FAQs', path: '/admin/faqs', icon: <FiHelpCircle /> },
      { label: 'Admin Users', path: '/admin/users', icon: <FiUsers /> },
      { label: 'Site Settings', path: '/admin/settings', icon: <FiSettings /> },
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
    navigate('/admin/login');
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
        className={`fixed top-0 left-0 h-full w-[280px] bg-slate-950 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 shadow-2xl border-r border-white/5 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiHeart className="text-white w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">{settings?.org_name || 'Anpuneri'}</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white p-1">
            <FiX className="w-5 h-5" />
          </button>
        </div>


        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">
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
        <div className="p-4 border-t border-white/5">
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
