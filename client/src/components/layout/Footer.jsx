import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHeart, FiFacebook, FiTwitter, FiInstagram, FiLinkedin,
  FiYoutube, FiMapPin, FiPhone, FiMail, FiSend, FiArrowRight,
} from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Footer = () => {
  const { data: settings } = useSelector((s) => s.settings);
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    setEmail('');
    // In production: call newsletter API
    alert('Thank you for subscribing!');
  };

  const quickLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Our Projects', path: '/projects' },
    { label: 'Events', path: '/events' },
    { label: 'Success Stories', path: '/stories' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'News', path: '/news' },
  ];

  const supportLinks = [
    { label: 'Volunteer', path: '/volunteer' },
    { label: 'Donate', path: '/donate' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top CTA Banner */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="container-custom py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-xl font-bold mb-1">Ready to Make a Difference?</h3>
            <p className="text-primary-200 text-sm">Join thousands of donors and volunteers changing lives every day.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/donate" className="btn-accent text-sm">
              <FiHeart className="w-4 h-4" /> Donate Now
            </Link>
            <Link to="/volunteer" className="btn-outline border-white text-white hover:bg-white hover:text-primary-700 text-sm">
              Volunteer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <FiHeart className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-lg font-heading">Anpuneri</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {settings?.org_tagline || 'Empowering communities through education, health support, and social welfare programs since 2010.'}
            </p>
            {/* Social Links */}
            <div className="flex gap-2.5">
              {[
                { icon: <FiFacebook />, href: settings?.social_facebook || 'https://facebook.com' },
                { icon: <FiTwitter />, href: settings?.social_twitter || 'https://twitter.com' },
                { icon: <FiInstagram />, href: settings?.social_instagram || 'https://instagram.com' },
                { icon: <FiLinkedin />, href: settings?.social_linkedin || 'https://linkedin.com' },
                { icon: <FiYoutube />, href: 'https://youtube.com' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                  aria-label={`Social link ${i}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <FiArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get In Touch</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">{settings?.org_address || '123 Community Lane, Hope District, City 10001'}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-primary-400 shrink-0" />
                <a href={`tel:${settings?.org_phone || '+1 (555) 123-4567'}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {settings?.org_phone || '+1 (555) 123-4567'}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href={`mailto:${settings?.org_email || 'info@ngo.org'}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {settings?.org_email || 'info@ngo.org'}
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium text-white mb-2">Newsletter</p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  aria-label="Subscribe"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Anpuneri. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</Link>
            <Link to="/faqs" className="text-xs text-gray-500 hover:text-white transition-colors">FAQs</Link>
          </div>
          <p className="text-xs text-gray-600">Made with <FiHeart className="inline text-red-500 w-3 h-3" /> for the community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
