import { Link } from 'react-router-dom';
import { FiMenu, FiExternalLink, FiBell } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const AdminTopBar = ({ onMenuClick, title }) => {
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <FiMenu className="w-5 h-5 text-gray-600" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          <FiExternalLink className="w-3.5 h-3.5" />
          View Site
        </Link>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FiBell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-none">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
