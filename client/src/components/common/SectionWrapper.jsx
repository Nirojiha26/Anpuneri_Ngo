import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useApi';

const SectionWrapper = ({
  children,
  className = '',
  id,
  bg = 'white',
}) => {
  const { ref, isInView } = useInView();

  const bgMap = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-600',
    dark: 'bg-gray-900',
  };

  return (
    <section
      id={id}
      ref={ref}
      className={`py-16 md:py-24 ${bgMap[bg] || ''} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="container-custom"
      >
        {children}
      </motion.div>
    </section>
  );
};

export const SectionHeader = ({ eyebrow, title, subtitle, centered = true }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    {eyebrow && (
      <span className="inline-block text-sm font-semibold text-primary-600 uppercase tracking-widest mb-3">
        {eyebrow}
      </span>
    )}
    <h2 className="section-title mb-4">{title}</h2>
    {subtitle && (
      <p className={`section-subtitle ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>
    )}
    <div className={`divider mt-4 ${centered ? 'mx-auto' : ''}`} />
  </div>
);

export default SectionWrapper;
