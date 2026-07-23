import { Link } from 'react-router-dom';
import { FiMenu, FiExternalLink, FiBell } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const AdminTopBar = ({ onMenuClick, title }) => {
  const { user } = useSelector((s) => s.auth);

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-all">
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
          className="hidden sm:flex items-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg shadow-primary-500/30"
        >
          <FiExternalLink className="w-4 h-4" />
          View Live Site
        </Link>

        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <FiBell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <Link to="/admin/profile" className="flex items-center gap-3 pl-4 ml-2 border-l border-gray-200 hover:bg-gray-50 p-2 rounded-xl transition-colors cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-extrabold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">{user?.name}</p>
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-0.5">{user?.role}</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-full flex items-center justify-center text-white text-base font-bold shadow-md shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default AdminTopBar;
