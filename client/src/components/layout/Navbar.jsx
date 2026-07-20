import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiHeart,
  FiUser,
  FiLogOut,
  FiSettings,
  FiLogIn,
  FiPhone,
  FiMail,
  FiYoutube,
} from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { logout } from "../../redux/slices/authSlice";
import { useClickOutside } from "../../hooks/useApi";
import logo from "../../assets/images/logo.jpg";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Events", path: "/events" },
  { label: "News", path: "/news" },
  { label: "Gallery", path: "/gallery" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { isAuthenticated } = useSelector((s) => s.auth);
  const { data: settings } = useSelector((s) => s.settings);
  const location = useLocation();

  const dropdownRef = useClickOutside(() => setOpenDropdown(null));

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300 shadow-sm bg-white">
      <div className="bg-[#1565C0] text-white transition-all duration-300 hidden md:block py-2">
        <div className="container-custom flex justify-between items-center text-[13px] font-medium tracking-wide">
          <div className="flex items-center gap-8">
            <a
              href={`tel:${settings?.org_phone || "+6478008724"}`}
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <div className="bg-[#25D366] shadow-sm p-1.5 rounded-full">
                <FiPhone className="w-3.5 h-3.5 text-white" />
              </div>
              {settings?.org_phone || "+64 7-800 8724"}
            </a>
            <a
              href={`mailto:${settings?.org_email || "anpunericanada@gmail.com"}`}
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <div className="bg-[#EA4335] shadow-sm p-1.5 rounded-full">
                <FiMail className="w-3.5 h-3.5 text-white" />
              </div>
              {settings?.org_email || "anpunericanada@gmail.com"}
            </a>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {settings?.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center bg-[#1877F2] shadow-sm border border-transparent rounded-full hover:scale-110 transition-all text-white"
                >
                  <FaFacebookF className="w-3.5 h-3.5" />
                </a>
              )}
              {settings?.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 flex items-center justify-center bg-[#FF0000] shadow-sm border border-transparent rounded-full hover:scale-110 transition-all text-white"
                >
                  <FiYoutube className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div
        className={`bg-white transition-all duration-300 ${isScrolled ? "py-3 shadow-md" : "py-4"}`}
      >
        <div className="container-custom flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative w-24 h-16 flex items-center justify-center">
              <img
                src={logo}
                alt="Anpuneri Logo"
                className="absolute h-[90px] w-auto max-w-none object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <span className="font-bold text-2xl text-[#1565C0] font-heading leading-none block tracking-wide uppercase">
                Anpuneri
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-5 xl:gap-7"
            ref={dropdownRef}
          >
            {NAV_ITEMS.map((item) => (
              <div key={item.path} className="relative">
                {item.children ? (
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.path ? null : item.path,
                      )
                    }
                    className="flex items-center gap-1 text-[13px] font-bold text-gray-900 uppercase tracking-wider hover:text-[#1565C0] transition-colors"
                  >
                    {item.label}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-[13px] font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-[#1565C0]"
                          : "text-gray-900 hover:text-[#1565C0]"
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
                      className="absolute top-full left-0 mt-4 w-52 bg-white shadow-xl border border-gray-100 py-1.5 overflow-hidden rounded-b-lg"
                    >
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={() => setOpenDropdown(null)}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm font-bold transition-colors ${
                              isActive
                                ? "text-[#1565C0] bg-blue-50"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#1565C0]"
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
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-4">
              <Link
                to="/donate"
                className="bg-[#F57C00] text-white text-[15px] font-bold px-7 py-3 rounded-2xl hover:bg-[#F57C00]/90 shadow-[0_4px_15px_rgba(245,124,0,0.4)] hover:shadow-[0_4px_20px_rgba(245,124,0,0.6)] transition-all duration-300 flex items-center gap-2.5"
              >
                <FiHeart className="w-5 h-5" strokeWidth={2.5} />
                Donate Now
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.path}>
                  {item.children ? (
                    <>
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-3 mb-1">
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm font-bold transition-colors ${
                              isActive
                                ? "text-[#1565C0] bg-blue-50"
                                : "text-gray-700 hover:bg-gray-50 hover:text-[#1565C0]"
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
                        `block px-3 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${
                          isActive
                            ? "text-[#1565C0] bg-blue-50"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#1565C0]"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  to="/donate"
                  className="bg-[#F57C00] text-white text-center text-[15px] font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(245,124,0,0.4)]"
                >
                  <FiHeart className="w-5 h-5" strokeWidth={2.5} />
                  Donate Now
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
