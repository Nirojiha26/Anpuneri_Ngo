import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  FiHeart, FiArrowRight, FiCalendar, FiMapPin, FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { dashboardService, projectService, eventService, newsService, testimonialService, galleryService } from '../../services/apiServices';
import SectionWrapper, { SectionHeader } from '../../components/common/SectionWrapper';
import { CardGridSkeleton } from '../../components/common/Loading';
import { formatDate, getImageUrl, truncate } from '../../utils/helpers';
import { useInView } from '../../hooks/useApi';

const HeroSlider = () => {
  const { data: settings } = useSelector((s) => s.settings);
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80',
      eyebrow: 'Together We Can',
      title: settings?.home_hero_title || 'Empowering Communities,\nTransforming Lives',
      subtitle: settings?.home_hero_subtitle || 'We believe every child deserves education, every family deserves dignity, and every community deserves hope.',
      cta: { label: 'Donate Now', path: '/donate' },
      ctaSecondary: { label: 'Our Work', path: '/projects' },
    },
    {
      image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1600&q=80',
      eyebrow: 'Education First',
      title: 'Every Child Deserves\na Chance to Learn',
      subtitle: 'From school supplies to full scholarships, we remove every barrier between a child and their education.',
      cta: { label: 'See Projects', path: '/projects' },
      ctaSecondary: { label: 'Volunteer', path: '/volunteer' },
    },
    {
      image: 'https://images.unsplash.com/photo-1593113580332-628d5bb5ce8a?w=1600&q=80',
      eyebrow: 'Join Our Mission',
      title: 'Hundreds of Volunteers,\nOne Purpose',
      subtitle: 'Whether you give your time, skills, or resources — you become part of something bigger than yourself.',
      cta: { label: 'Volunteer With Us', path: '/volunteer' },
      ctaSecondary: { label: 'Learn More', path: '/about' },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-gray-900">
      {/* Background Images */}
      {slides.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${s.image})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: i === current ? 1 : 0, scale: i === current ? 1 : 1.05 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      ))}

      {/* Modern Smooth Gradient Overlay (Removed noisy pattern) */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative container-custom h-full flex items-center z-10">
        <div className="max-w-2xl">
          <motion.span
            key={`eyebrow-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-block text-accent-400 text-sm font-semibold uppercase tracking-widest mb-4 drop-shadow-md"
          >
            {slide.eyebrow}
          </motion.span>

          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white font-heading leading-[1.1] mb-6 drop-shadow-lg"
            style={{ whiteSpace: 'pre-line' }}
          >
            {slide.title}
          </motion.h1>

          <motion.p
            key={`subtitle-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md max-w-xl"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-wrap gap-4"
          >
            <Link to={slide.cta.path} className="btn-accent px-8 py-3.5 text-base shadow-xl shadow-accent-600/30">
              <FiHeart className="w-5 h-5" /> {slide.cta.label}
            </Link>
            <Link to={slide.ctaSecondary.path} className="btn-outline px-8 py-3.5 text-base border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors">
              {slide.ctaSecondary.label} <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full shadow-sm ${i === current ? 'w-10 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all z-20"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all z-20"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

// ── Stats Section ────────────────────────────────────────────────
const StatsSection = ({ stats }) => {
  const { ref, isInView } = useInView();

  const items = [
    { value: stats?.studentsHelped || 1250, label: 'Students Helped', suffix: '+', color: 'text-primary-600' },
    { value: stats?.familiesSupported || 520, label: 'Families Supported', suffix: '+', color: 'text-secondary-600' },
    { value: stats?.volunteers || 180, label: 'Active Volunteers', suffix: '+', color: 'text-accent-600' },
    { value: stats?.projectsCompleted || 24, label: 'Projects Completed', suffix: '', color: 'text-primary-600' },
  ];

  return (
    <section className="bg-primary-700 py-14" ref={ref}>
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-heading">
                {isInView && (
                  <CountUp
                    end={item.value}
                    duration={2.5}
                    separator=","
                    delay={i * 0.1}
                  />
                )}
                {item.suffix}
              </div>
              <p className="text-primary-200 text-sm md:text-base font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Project Card ────────────────────────────────────────────────
const ProjectCard = ({ project }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card overflow-hidden group"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={getImageUrl(project.image)}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute top-3 left-3">
        <span className="badge-primary capitalize">{project.category}</span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.shortDescription}</p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>${(project.raisedAmount || 0).toLocaleString()} raised</span>
          <span>{Math.min(100, Math.round(((project.raisedAmount || 0) / (project.targetAmount || 1)) * 100))}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, Math.round(((project.raisedAmount || 0) / (project.targetAmount || 1)) * 100))}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      <Link
        to={`/projects/${project._id}`}
        className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
      >
        Learn more <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

// ── Event Card ────────────────────────────────────────────────
const EventCard = ({ event }) => (
  <motion.div whileHover={{ y: -3 }} className="card p-5 flex gap-4">
    <div className="w-14 h-14 bg-primary-50 rounded-xl flex flex-col items-center justify-center shrink-0">
      <span className="text-xl font-bold text-primary-700 leading-none">
        {new Date(event.startDate).getDate()}
      </span>
      <span className="text-xs text-primary-500">
        {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
      </span>
    </div>
    <div className="min-w-0">
      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-primary-600 transition-colors">
        <Link to={`/events/${event._id}`}>{event.title}</Link>
      </h4>
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
        <FiMapPin className="w-3 h-3" /> {event.venue || event.location || 'TBA'}
      </div>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <FiCalendar className="w-3 h-3" /> {event.startTime || formatDate(event.startDate)}
      </div>
    </div>
  </motion.div>
);

// ── Testimonial Card ────────────────────────────────────────────────
const TestimonialCard = ({ testimonial }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="card p-6"
  >
    <div className="flex gap-1 mb-3">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
    <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
      "{truncate(testimonial.content, 200)}"
    </p>
    <div className="flex items-center gap-3">
      <img
        src={getImageUrl(testimonial.avatar)}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full object-cover"
        loading="lazy"
      />
      <div>
        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
        <p className="text-xs text-gray-500">{testimonial.designation}</p>
      </div>
    </div>
  </motion.div>
);

// ── Main Page ────────────────────────────────────────────────
const HomePage = () => {
  const { data: settings } = useSelector((s) => s.settings);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, projRes, evtRes, newsRes, testRes, galRes] = await Promise.allSettled([
          dashboardService.getPublicStats(),
          projectService.getAll({ featured: true, limit: 3 }),
          eventService.getAll({ upcoming: true, limit: 4 }),
          newsService.getAll({ limit: 3 }),
          testimonialService.getAll({ featured: true }),
          galleryService.getAll({ featured: true, limit: 8 }),
        ]);

        if (statsRes.status === 'fulfilled') setStats(statsRes.value.data.data);
        if (projRes.status === 'fulfilled') setProjects(projRes.value.data.data || []);
        if (evtRes.status === 'fulfilled') setEvents(evtRes.value.data.data || []);
        if (newsRes.status === 'fulfilled') setNews(newsRes.value.data.data || []);
        if (testRes.status === 'fulfilled') setTestimonials(testRes.value.data.data?.testimonials || []);
        if (galRes.status === 'fulfilled') setGallery(galRes.value.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Mission Statement */}
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Our Purpose</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-5 font-heading">
              {settings?.home_mission_title || 'We Exist to Lift People Out of Poverty Through Education'}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {settings?.home_mission_desc1 || 'Every day, children across our communities wake up facing a choice between eating and going to school. Families break under the weight of poverty, unable to give their children the future they deserve.'}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {settings?.home_mission_desc2 || 'We believe education is the most powerful lever for change. Through scholarships, school supplies, and community programs, we turn that lever for over 1,200 families every year.'}
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="btn-primary">
                Our Story <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/projects" className="btn-outline">
                Our Projects
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600"
              alt="Students learning"
              className="rounded-2xl w-full h-48 object-cover shadow-card"
            />
            <img
              src="https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=600"
              alt="Children with supplies"
              className="rounded-2xl w-full h-48 object-cover shadow-card mt-8"
            />
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600"
              alt="Volunteers working"
              className="rounded-2xl w-full h-48 object-cover shadow-card"
            />
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"
              alt="Health camp"
              className="rounded-2xl w-full h-48 object-cover shadow-card mt-8"
            />
          </div>
        </div>
      </SectionWrapper>

      {/* Featured Projects */}
      <SectionWrapper bg="gray">
        <SectionHeader
          eyebrow="What We Do"
          title="Featured Projects"
          subtitle="From scholarships to school supplies, every project is designed to create lasting change in our communities."
        />
        {loading ? (
          <CardGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/projects" className="btn-outline">
            View All Projects <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </SectionWrapper>

      {/* Events + News side by side */}
      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Events */}
          <div>
            <SectionHeader eyebrow="What's On" title="Upcoming Events" centered={false} />
            <div className="space-y-4">
              {events.slice(0, 4).map((e) => <EventCard key={e._id} event={e} />)}
            </div>
            <Link to="/events" className="btn-outline mt-6 inline-flex">
              All Events <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* News */}
          <div>
            <SectionHeader eyebrow="Stay Informed" title="Latest News" centered={false} />
            <div className="space-y-5">
              {news.slice(0, 3).map((n) => (
                <motion.div key={n._id} whileHover={{ x: 4 }} className="flex gap-4">
                  <img
                    src={getImageUrl(n.image)}
                    alt={n.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <Link to={`/news/${n._id}`}>
                      <h4 className="font-semibold text-gray-900 text-sm hover:text-primary-600 transition-colors mb-1 line-clamp-2">
                        {n.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-500">{formatDate(n.publishedAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/news" className="btn-outline mt-6 inline-flex">
              All News <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* Volunteer CTA */}
      <section className="bg-gradient-to-br from-secondary-700 via-secondary-800 to-secondary-900 py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary-300 text-sm font-semibold uppercase tracking-widest mb-3 block">Join Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
              Give Your Time. Change a Life.
            </h2>
            <p className="text-secondary-200 text-lg mb-8 max-w-xl mx-auto">
              Whether you have 2 hours or 20, your skills and passion can make a real difference in someone's life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/volunteer" className="btn-accent">
                Become a Volunteer <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/donate" className="btn-outline border-white text-white hover:bg-white hover:text-secondary-800">
                <FiHeart className="w-4 h-4" /> Donate Instead
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <SectionWrapper bg="gray">
        <SectionHeader
          eyebrow="Their Words"
          title="What People Say"
          subtitle="Real stories from the people whose lives have been touched by your generosity."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.slice(0, 4).map((t) => (
            <TestimonialCard key={t._id} testimonial={t} />
          ))}
        </div>
      </SectionWrapper>

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <SectionWrapper bg="white">
          <SectionHeader
            eyebrow="Our Work in Pictures"
            title="Photo Gallery"
            subtitle="A glimpse into the lives we're changing and the communities we serve."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.slice(0, 8).map((img, i) => (
              <motion.div
                key={img._id || i}
                whileHover={{ scale: 1.02 }}
                className={`relative overflow-hidden rounded-xl ${i === 0 || i === 5 ? 'md:col-span-2' : ''}`}
              >
                <img
                  src={getImageUrl(img.image)}
                  alt={img.title}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <span className="text-white text-xs font-medium">{img.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/gallery" className="btn-outline">
              View Full Gallery <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </SectionWrapper>
      )}

      {/* Donation CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-2 font-heading">Every Dollar Counts</h2>
              <p className="text-primary-200 text-lg">
                $50 buys a child's school supplies for a full year. $100 provides a health camp visit for a family.
              </p>
            </div>
            <Link to="/donate" className="btn-accent shrink-0 text-base px-8 py-4">
              <FiHeart className="w-5 h-5" /> Donate Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
