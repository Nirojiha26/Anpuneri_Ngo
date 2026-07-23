import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import CountUp from "react-countup";
import {
  FiHeart,
  FiArrowRight,
  FiCalendar,
  FiMapPin,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import {
  dashboardService,
  projectService,
  eventService,
  newsService,
  testimonialService,
  galleryService,
  sliderService,
} from "../../services/apiServices";
import SectionWrapper, {
  SectionHeader,
} from "../../components/common/SectionWrapper";
import { CardGridSkeleton } from "../../components/common/Loading";
import { formatDate, getImageUrl, truncate } from "../../utils/helpers";
import { useInView } from "../../hooks/useApi";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await sliderService.getPublic();
        setSlides(res.data.data.sliders || []);
      } catch (error) {
        console.error("Error fetching sliders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSliders();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      6000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="h-[90vh] min-h-[600px] flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center bg-gray-900">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">Welcome</h1>
          <p className="text-gray-300 text-lg md:text-xl">Discover our mission and impact.</p>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-gray-900">
      {slides.map((s, i) => (
        <motion.div
          key={s._id || i}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${s.image.startsWith("http") ? s.image : getImageUrl(s.image)})`,
          }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: i === current ? 1 : 0,
            scale: i === current ? 1 : 1.05,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

      <div className="relative container-custom h-full flex items-center z-10">
        <div className="max-w-2xl">
          <motion.span
            key={`eyebrow-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block text-accent-400 text-sm md:text-base font-semibold uppercase tracking-widest mb-4 drop-shadow-md"
          >
            {slide.eyebrow}
          </motion.span>

          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white font-heading leading-[1.1] mb-6 drop-shadow-lg"
            style={{ whiteSpace: "pre-line" }}
          >
            {slide.title}
          </motion.h1>

          <motion.p
            key={`subtitle-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-base md:text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md max-w-xl"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            {slide.ctaLabel && slide.ctaPath && (
              <Link
                to={slide.ctaPath}
                className="btn-accent px-6 md:px-8 py-3 text-sm md:text-base shadow-xl shadow-accent-600/30 w-full sm:w-auto text-center"
              >
                <FiHeart className="w-4 h-4 md:w-5 md:h-5 inline-block mr-2" />
                {slide.ctaLabel}
              </Link>
            )}
            {slide.ctaSecondaryLabel && slide.ctaSecondaryPath && (
              <Link
                to={slide.ctaSecondaryPath}
                className="btn-outline px-6 md:px-8 py-3 text-sm md:text-base border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors w-full sm:w-auto text-center"
              >
                {slide.ctaSecondaryLabel} <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 inline-block ml-2" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full shadow-sm ${
                i === current
                  ? "w-8 md:w-10 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <div className="hidden md:block">
          <button
            onClick={() =>
              setCurrent((c) => (c - 1 + slides.length) % slides.length)
            }
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
        </div>
      )}
    </section>
  );
};

const StatsSection = ({ stats }) => {
  const { ref, isInView } = useInView();

  if (!stats) return null;

  const items = [
    {
      value: stats.studentsHelped || 0,
      label: "Students Helped",
      suffix: "+",
    },
    {
      value: stats.familiesSupported || 0,
      label: "Families Supported",
      suffix: "+",
    },
    {
      value: stats.volunteers || 0,
      label: "Active Volunteers",
      suffix: "+",
    },
    {
      value: stats.projectsCompleted || 0,
      label: "Projects Completed",
      suffix: "",
    },
  ];

  const hasStats = items.some(item => item.value > 0);
  if (!hasStats) return null;

  return (
    <section className="bg-primary-700 py-10 md:py-14" ref={ref}>
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-bold text-white mb-2 font-heading">
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
              <p className="text-primary-200 text-xs md:text-base font-medium">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project }) => (
  <motion.div whileHover={{ y: -4 }} className="card overflow-hidden group flex flex-col h-full">
    <div className="relative h-48 md:h-56 overflow-hidden shrink-0">
      <img
        src={getImageUrl(project.image)}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute top-3 left-3">
        <span className="badge-primary capitalize shadow-sm">{project.category}</span>
      </div>
    </div>
    <div className="p-4 md:p-5 flex flex-col flex-1">
      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
        {project.shortDescription}
      </p>

      <div className="mt-auto mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>${(project.raisedAmount || 0).toLocaleString()} raised</span>
          <span>
            {Math.min(
              100,
              Math.round(
                ((project.raisedAmount || 0) / (project.targetAmount || 1)) *
                  100
              )
            )}
            %
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: 0 }}
            whileInView={{
              width: `${Math.min(
                100,
                Math.round(
                  ((project.raisedAmount || 0) / (project.targetAmount || 1)) *
                    100
                )
              )}%`,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <Link
        to={`/projects/${project._id}`}
        className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 group w-max"
      >
        Learn more{" "}
        <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

const EventCard = ({ event }) => (
  <motion.div whileHover={{ y: -3 }} className="card p-4 md:p-5 flex gap-4">
    <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-50 rounded-xl flex flex-col items-center justify-center shrink-0">
      <span className="text-lg md:text-xl font-bold text-primary-700 leading-none">
        {new Date(event.startDate).getDate()}
      </span>
      <span className="text-[10px] md:text-xs text-primary-500 uppercase font-semibold mt-0.5">
        {new Date(event.startDate).toLocaleString("default", {
          month: "short",
        })}
      </span>
    </div>
    <div className="min-w-0 flex-1 flex flex-col justify-center">
      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-primary-600 transition-colors text-sm md:text-base">
        <Link to={`/events/${event._id}`}>{event.title}</Link>
      </h4>
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        <FiMapPin className="w-3 h-3 shrink-0" />
        <span className="line-clamp-1">{event.venue || event.location || "TBA"}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <FiCalendar className="w-3 h-3 shrink-0" />
        <span>{event.startTime || formatDate(event.startDate)}</span>
      </div>
    </div>
  </motion.div>
);

const TestimonialCard = ({ testimonial }) => (
  <motion.div whileHover={{ y: -3 }} className="card p-5 md:p-6 flex flex-col h-full justify-between">
    <div>
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-sm">★</span>
        ))}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
        "{truncate(testimonial.content, 200)}"
      </p>
    </div>
    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
      {testimonial.avatar ? (
        <img
          src={getImageUrl(testimonial.avatar)}
          alt={testimonial.name}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shadow-sm"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
          {testimonial.name ? testimonial.name.charAt(0).toUpperCase() : 'A'}
        </div>
      )}
      <div>
        <p className="font-bold text-gray-900 text-sm">
          {testimonial.name}
        </p>
        <p className="text-[10px] md:text-xs text-primary-600 font-medium uppercase tracking-wide">
          {testimonial.designation || 'Supporter'}
        </p>
      </div>
    </div>
  </motion.div>
);

const ReviewForm = ({ reviewForm, setReviewForm, handleReviewSubmit, isSubmittingReview }) => (
  <div className="relative group w-full max-w-md mx-auto lg:max-w-none">
    <div className="absolute -inset-0.5 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
    <div className="relative bg-white p-6 md:p-8 rounded-3xl shadow-xl">
      <div className="mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-4">
          <FiHeart className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-heading mb-2">Share Your Story</h3>
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed">We'd love to hear how we impacted you. Your words inspire others to join our cause.</p>
      </div>
      
      <form onSubmit={handleReviewSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name <span className="text-primary-500">*</span></label>
          <input type="text" required className="w-full px-4 md:px-5 py-3 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none" placeholder="e.g. John Doe" value={reviewForm.name} onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} />
        </div>
        
        <div>
          <label className="block text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Your Experience <span className="text-primary-500">*</span></label>
          <textarea required rows="4" className="w-full px-4 md:px-5 py-3 md:py-4 text-sm bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none resize-none" placeholder="Tell us how we helped or what you loved..." value={reviewForm.content} onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}></textarea>
        </div>
        
        <div className="pt-2">
          <button type="submit" disabled={isSubmittingReview} className="btn-primary w-full py-3 md:py-3.5 rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] transition-all text-sm font-semibold">
            {isSubmittingReview ? 'Submitting...' : 'Post Your Story'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const GallerySlider = ({ gallery }) => {
  const [index, setIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else setItemsToShow(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, gallery.length - itemsToShow);

  useEffect(() => {
    if (maxIndex <= 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (gallery.length === 0) return null;

  return (
    <SectionWrapper bg="gray" className="pt-0 pb-10 md:pb-16 overflow-hidden">
      <SectionHeader
        eyebrow="Our Work in Pictures"
        title="Photo Gallery"
        subtitle="A glimpse into the lives we're changing and the communities we serve."
      />
      <div className="relative overflow-hidden w-full group mt-6 md:mt-8">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / itemsToShow)}%)` }}
        >
          {gallery.map((img, i) => (
            <div
              key={img._id || i}
              className="shrink-0 px-2 md:px-3"
              style={{ width: `${100 / itemsToShow}%` }}
            >
              <div 
                onClick={() => setLightbox(img)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group/card flex flex-col h-full overflow-hidden"
              >
                <div className="relative overflow-hidden h-48 sm:h-64 md:h-[300px]">
                  <img
                    src={getImageUrl(img.image)}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 md:p-5 flex-grow flex flex-col">
                  <h3 className="text-gray-900 text-base md:text-lg font-bold mb-1.5 line-clamp-1">
                    {img.title}
                  </h3>
                  {img.description && (
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mt-auto">
                      {img.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center mt-8 md:mt-12">
        <Link to="/gallery" className="btn-primary px-6 md:px-8 text-sm md:text-base">
          View Full Gallery <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 inline-block ml-2" />
        </Link>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[101]"
            >
              <FiX className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <div 
              className="relative w-full max-w-5xl flex flex-col items-center justify-center h-full max-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={getImageUrl(lightbox.image)}
                alt={lightbox.title}
                className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain shadow-2xl rounded-lg"
              />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-4xl mt-4 md:mt-6 bg-white/10 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl text-center shadow-xl overflow-y-auto custom-scrollbar max-h-[25vh]"
              >
                <h3 className="text-white text-lg md:text-2xl font-bold mb-2 md:mb-3 font-heading tracking-wide">{lightbox.title}</h3>
                {lightbox.description && (
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">{lightbox.description}</p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
};

const HomePage = () => {
  const { data: settings } = useSelector((s) => s.settings);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({ name: '', designation: '', content: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await testimonialService.submitPublic(reviewForm);
      toast.success('Thank you! Your review has been submitted for approval.');
      setReviewForm({ name: '', designation: '', content: '' });
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, projRes, evtRes, newsRes, testRes, galRes] =
          await Promise.allSettled([
            dashboardService.getPublicStats(),
            projectService.getAll({ featured: true, limit: 3 }),
            eventService.getAll({ upcoming: true, limit: 4 }),
            newsService.getAll({ limit: 3 }),
            testimonialService.getAll({ featured: true }),
            galleryService.getAll({ featured: true, limit: 8 }),
          ]);

        if (statsRes.status === "fulfilled") setStats(statsRes.value.data.data);
        if (projRes.status === "fulfilled") setProjects(projRes.value.data.data || []);
        if (evtRes.status === "fulfilled") setEvents(evtRes.value.data.data || []);
        if (newsRes.status === "fulfilled") setNews(newsRes.value.data.data || []);
        if (testRes.status === "fulfilled") setTestimonials(testRes.value.data.data?.testimonials || []);
        if (galRes.status === "fulfilled") setGallery(galRes.value.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <HeroSlider />
      <StatsSection stats={stats} />

      <SectionWrapper bg="white">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="text-xs md:text-sm font-semibold text-primary-600 uppercase tracking-widest block mb-2">
              Our Purpose
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-5 font-heading leading-tight">
              {settings?.home_mission_title || "Empowering Communities"}
            </h2>
            {settings?.home_mission_desc1 && (
              <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.home_mission_desc1}
              </p>
            )}
            {settings?.home_mission_desc2 && (
              <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.home_mission_desc2}
              </p>
            )}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link to="/about" className="btn-primary text-sm md:text-base px-6">
                Our Story <FiArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
              <Link to="/projects" className="btn-outline text-sm md:text-base px-6">
                Our Projects
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {settings?.home_mission_image_1 && (
              <img
                src={getImageUrl(settings.home_mission_image_1)}
                alt="Mission Impact 1"
                className="rounded-xl md:rounded-2xl w-full h-32 md:h-48 lg:h-56 object-cover shadow-sm md:shadow-card"
              />
            )}
            {settings?.home_mission_image_2 && (
              <img
                src={getImageUrl(settings.home_mission_image_2)}
                alt="Mission Impact 2"
                className="rounded-xl md:rounded-2xl w-full h-32 md:h-48 lg:h-56 object-cover shadow-sm md:shadow-card mt-4 md:mt-8"
              />
            )}
            {settings?.home_mission_image_3 && (
              <img
                src={getImageUrl(settings.home_mission_image_3)}
                alt="Mission Impact 3"
                className="rounded-xl md:rounded-2xl w-full h-32 md:h-48 lg:h-56 object-cover shadow-sm md:shadow-card"
              />
            )}
            {settings?.home_mission_image_4 && (
              <img
                src={getImageUrl(settings.home_mission_image_4)}
                alt="Mission Impact 4"
                className="rounded-xl md:rounded-2xl w-full h-32 md:h-48 lg:h-56 object-cover shadow-sm md:shadow-card mt-4 md:mt-8"
              />
            )}
          </div>
        </div>
      </SectionWrapper>

      <GallerySlider gallery={gallery} />

      {projects.length > 0 && (
        <SectionWrapper bg="gray">
          <SectionHeader
            eyebrow="What We Do"
            title="Featured Projects"
            subtitle="Explore our ongoing initiatives designed to create lasting change."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mt-8 md:mt-10">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
          <div className="text-center mt-8 md:mt-12">
            <Link to="/projects" className="btn-outline px-6 md:px-8 text-sm md:text-base">
              View All Projects <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 inline-block ml-2" />
            </Link>
          </div>
        </SectionWrapper>
      )}

      {(events.length > 0 || news.length > 0) && (
        <SectionWrapper bg="white">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-14">
            {events.length > 0 && (
              <div>
                <SectionHeader eyebrow="What's On" title="Upcoming Events" centered={false} />
                <div className="space-y-4 md:space-y-5 mt-6">
                  {events.map((e) => (
                    <EventCard key={e._id} event={e} />
                  ))}
                </div>
                <div className="mt-6 md:mt-8">
                  <Link to="/events" className="btn-outline inline-flex text-sm md:text-base px-6">
                    All Events <FiArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            )}

            {news.length > 0 && (
              <div>
                <SectionHeader eyebrow="Stay Informed" title="Latest News" centered={false} />
                <div className="space-y-5 md:space-y-6 mt-6">
                  {news.map((n) => (
                    <motion.div key={n._id} whileHover={{ x: 4 }} className="flex gap-4 md:gap-5 group">
                      <div className="overflow-hidden rounded-xl shrink-0">
                        <img
                          src={getImageUrl(n.image)}
                          alt={n.title}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link to={`/news/${n._id}`}>
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base hover:text-primary-600 transition-colors mb-1.5 md:mb-2 line-clamp-2 leading-snug">
                            {n.title}
                          </h4>
                        </Link>
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-wide">
                          {formatDate(n.publishedAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 md:mt-8">
                  <Link to="/news" className="btn-outline inline-flex text-sm md:text-base px-6">
                    All News <FiArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper bg="gray">
        <SectionHeader
          eyebrow="Public Reviews"
          title="What People Say"
          subtitle="Read stories and feedback from the people whose lives we've touched."
        />
        
        <div className={`mt-8 md:mt-12 ${testimonials.length > 0 ? 'grid lg:grid-cols-3 gap-8 md:gap-10 items-start' : 'max-w-xl mx-auto'}`}>
          {testimonials.length > 0 && (
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
                {testimonials.slice(0, 4).map((t) => (
                  <TestimonialCard key={t._id} testimonial={t} />
                ))}
              </div>
            </div>
          )}

          <div className={`${testimonials.length > 0 ? 'lg:col-span-1 order-1 lg:order-2 mb-8 lg:mb-0' : ''}`}>
            <ReviewForm 
              reviewForm={reviewForm}
              setReviewForm={setReviewForm}
              handleReviewSubmit={handleReviewSubmit}
              isSubmittingReview={isSubmittingReview}
            />
          </div>
        </div>
      </SectionWrapper>

      <section className="bg-gradient-to-br from-secondary-700 via-secondary-800 to-secondary-900 py-16 md:py-24">
        <div className="container-custom text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary-300 text-xs md:text-sm font-semibold uppercase tracking-widest mb-3 block">
              Join Us
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 font-heading leading-tight">
              Offer Your Time, Strengthen Communities.
            </h2>
            <p className="text-secondary-200 text-sm md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              Make a meaningful contribution through volunteer service or financial support. 
              Your commitment helps us deliver reliable aid to those in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/volunteer" className="btn-accent w-full sm:w-auto px-8 py-3.5 md:py-4">
                Volunteer With Us <FiArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Link>
              <Link
                to="/donate"
                className="btn-outline border-2 border-white text-white hover:bg-white hover:text-secondary-800 w-full sm:w-auto px-8 py-3.5 md:py-4"
              >
                <FiHeart className="w-4 h-4 mr-2 inline-block" /> Support Our Mission
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
