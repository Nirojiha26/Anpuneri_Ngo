import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { faqService } from '../../services/apiServices';
import { Spinner } from '../../components/common/Loading';
import SectionWrapper, { SectionHeader } from '../../components/common/SectionWrapper';
import { useScrollTop } from '../../hooks/useApi';

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
    >
      <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
      <FiChevronDown className={`w-5 h-5 text-primary-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-6 py-4 text-gray-600 border-t border-gray-100 text-sm leading-relaxed bg-gray-50">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQsPage = () => {
  useScrollTop();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    faqService.getAll().then((res) => setFaqs(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(faqs.map((f) => f.category))];
  const filtered = activeCategory ? faqs.filter((f) => f.category === activeCategory) : faqs;

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Answers to the most common questions about our programs, volunteering, and donations.
          </p>
        </div>
      </div>

      <div className="container-custom py-16 max-w-3xl">
        {/* Category filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[['', 'All'], ...categories.map((c) => [c, c.charAt(0).toUpperCase() + c.slice(1)])].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setActiveCategory(val)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === val ? 'bg-primary-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-primary-300'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq) => (
              <FAQItem
                key={faq._id}
                faq={faq}
                isOpen={openId === faq._id}
                onToggle={() => setOpenId(openId === faq._id ? null : faq._id)}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center card p-8">
          <FiHelpCircle className="w-10 h-10 text-primary-600 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 text-sm mb-4">We're happy to help. Reach out directly and we'll get back to you promptly.</p>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
