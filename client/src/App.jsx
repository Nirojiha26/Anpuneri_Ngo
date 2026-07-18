import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchPublicSettings } from './redux/slices/settingsSlice';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { PageLoader } from './components/common/Loading';

// ── Public Pages ─────────────────────────────────────────────
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailsPage from './pages/public/ProjectDetailsPage';
import EventsPage from './pages/public/EventsPage';
import EventDetailsPage from './pages/public/EventDetailsPage';
import NewsPage from './pages/public/NewsPage';
import GalleryPage from './pages/public/GalleryPage';
import VolunteerPage from './pages/public/VolunteerPage';
import DonatePage from './pages/public/DonatePage';
import ContactPage from './pages/public/ContactPage';
import TeamPage from './pages/public/TeamPage';
import FAQsPage from './pages/public/FAQsPage';
import { MissionPage, VisionPage, NotFoundPage, PrivacyPage, TermsPage } from './pages/public/StaticPages';

// ── Admin Pages ─────────────────────────────────────────────
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSettings from './pages/admin/AdminSettings';
import { AdminDonations, AdminVolunteers, AdminContacts } from './pages/admin/AdminCommunity';
import { AdminEventRegistrations } from './pages/admin/AdminEventRegistrations';
import {
  AdminEvents, AdminNews, AdminGallery, AdminTeam,
  AdminTestimonials, AdminFAQs, AdminStories, AdminUsers,
} from './pages/admin/AdminContent';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublicSettings());
  }, [dispatch]);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="mission" element={<MissionPage />} />
            <Route path="vision" element={<VisionPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="volunteer" element={<VolunteerPage />} />
            <Route path="donate" element={<DonatePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faqs" element={<FAQsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin Login (standalone) ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ── Admin Protected Routes ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* Content */}
            <Route path="projects" element={<AdminProjects />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="event-registrations" element={<AdminEventRegistrations />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="stories" element={<AdminStories />} />
            {/* Community */}
            <Route path="donations" element={<AdminDonations />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            {/* Organization */}
            <Route path="team" element={<AdminTeam />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
