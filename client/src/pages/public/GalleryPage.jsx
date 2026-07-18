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
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, i) => (
              <motion.div
                key={img._id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightbox(img)}
                className="break-inside-avoid cursor-pointer rounded-2xl overflow-hidden group relative"
              >
                <img
                  src={getImageUrl(img.image)}
                  alt={img.title}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-medium">{img.title}</span>
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
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={getImageUrl(lightbox.image)}
              alt={lightbox.title}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {lightbox.title && (
              <p className="absolute bottom-6 text-white/80 text-sm">{lightbox.title}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
