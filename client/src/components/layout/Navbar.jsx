import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiChevronDown, FiHeart, FiUser, FiLogOut,
  FiSettings, FiLogIn,
} from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { useClickOutside } from '../../hooks/useApi';
import logo from '../../assets/images/logo.jpg';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  {
    label: 'About',
    path: '/about',
    children: [
      { label: 'Who We Are', path: '/about' },
      { label: 'Our Mission', path: '/mission' },
      { label: 'Our Vision', path: '/vision' },
      { label: 'Our Team', path: '/team' },
    ],
  },
  { label: 'Projects', path: '/projects' },
  { label: 'Events', path: '/events' },
  { label: 'News', path: '/news' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Volunteer', path: '/volunteer' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { data: settings } = useSelector((s) => s.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenuRef = useClickOutside(() => setUserMenuOpen(false));
  const dropdownRef = useClickOutside(() => setOpenDropdown(null));

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/60 backdrop-blur-md border-b border-white/20 ${
        isScrolled ? 'shadow-md py-3' : 'py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-16 h-10 flex items-center justify-center">
            <img 
              src={logo} 
              alt="Anpuneri Logo" 
              className="absolute h-[70px] w-auto max-w-none object-contain mix-blend-multiply" 
            />
          </div>
          <div>
            <span className="font-bold text-xl text-gray-900 font-heading leading-none block tracking-wide">
              Anpuneri
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
          {NAV_ITEMS.map((item) => (
            <div key={item.path} className="relative">
              {item.children ? (
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.path ? null : item.path)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all"
                >
                  {item.label}
                  <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.path ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {item.children && openDropdown === item.path && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden"
                  >
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        onClick={() => setOpenDropdown(null)}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'text-primary-600 bg-primary-50 font-medium'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link to="/donate" className="hidden sm:flex btn-accent text-sm px-4 py-2 gap-1.5">
            <FiHeart className="w-4 h-4" />
            Donate
          </Link>



          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.path}>
                  {item.children ? (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'text-primary-600 bg-primary-50 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Link to="/donate" className="btn-accent w-full justify-center text-sm">
                  <FiHeart className="w-4 h-4" /> Donate Now
                </Link>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
