import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiImage } from 'react-icons/fi';
import { galleryService } from '../../services/apiServices';
import { Spinner } from '../../components/common/Loading';
import { getImageUrl } from '../../utils/helpers';
import { GALLERY_CATEGORIES } from '../../constants';
import { useScrollTop } from '../../hooks/useApi';

const GalleryPage = () => {
  const { data: settings } = useSelector((s) => s.settings);
  useScrollTop();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await galleryService.getAll({ category, limit: 50 });
        setImages(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
            {settings?.gallery_title || 'Photo Gallery'}
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            {settings?.gallery_subtitle || 'A visual journey through our programs, events, and the communities we serve.'}
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[{ value: '', label: 'All Photos' }, ...GALLERY_CATEGORIES].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.value ? 'bg-primary-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : images.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FiImage className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No photos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {images.map((img, i) => (
              <motion.div
                key={img._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                onClick={() => setLightbox(img)}
                className="cursor-pointer rounded-2xl overflow-hidden group relative shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={getImageUrl(img.image)}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-white text-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title || 'Gallery Image'}
                  </span>
                  <span className="text-white/80 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Click to view full size
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[60]"
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
                className="max-w-full max-h-[75vh] md:max-h-[80vh] rounded-xl object-contain shadow-2xl"
              />
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-4xl mt-4 md:mt-6 bg-white/10 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl text-center shadow-xl overflow-y-auto custom-scrollbar max-h-[25vh]"
              >
                {lightbox.title && (
                  <h3 className="text-white text-lg md:text-2xl font-bold mb-2 font-heading tracking-wide">{lightbox.title}</h3>
                )}
                {lightbox.description && (
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-3xl mx-auto">{lightbox.description}</p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
