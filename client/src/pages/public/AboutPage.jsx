import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiTarget, FiEye, FiUsers } from 'react-icons/fi';
import SectionWrapper, { SectionHeader } from '../../components/common/SectionWrapper';

const DEFAULT_VALUES = [
  { icon: '🤝', title: 'Integrity', desc: 'We act with complete transparency and accountability in everything we do.' },
  { icon: '💛', title: 'Compassion', desc: 'We lead with empathy, treating every person we serve with dignity and care.' },
  { icon: '🌱', title: 'Impact', desc: 'We measure our success by the real, lasting change we create in communities.' },
  { icon: '🤲', title: 'Collaboration', desc: 'We believe in the power of partnerships — with communities, donors, and volunteers.' },
];

const AboutPage = () => {
  const { data: settings } = useSelector((s) => s.settings);

  const values = [
    { icon: settings?.about_value1_icon || DEFAULT_VALUES[0].icon, title: settings?.about_value1_title || DEFAULT_VALUES[0].title, desc: settings?.about_value1_desc || DEFAULT_VALUES[0].desc },
    { icon: settings?.about_value2_icon || DEFAULT_VALUES[1].icon, title: settings?.about_value2_title || DEFAULT_VALUES[1].title, desc: settings?.about_value2_desc || DEFAULT_VALUES[1].desc },
    { icon: settings?.about_value3_icon || DEFAULT_VALUES[2].icon, title: settings?.about_value3_title || DEFAULT_VALUES[2].title, desc: settings?.about_value3_desc || DEFAULT_VALUES[2].desc },
    { icon: settings?.about_value4_icon || DEFAULT_VALUES[3].icon, title: settings?.about_value4_title || DEFAULT_VALUES[3].title, desc: settings?.about_value4_desc || DEFAULT_VALUES[3].desc },
  ];

  const exploreCards = [
    { icon: <FiTarget className="w-6 h-6" />, label: settings?.about_explore1_label || 'Our Mission', path: settings?.about_explore1_path || '/mission', desc: settings?.about_explore1_desc || 'The purpose that drives every program and decision we make.' },
    { icon: <FiEye className="w-6 h-6" />, label: settings?.about_explore2_label || 'Our Vision', path: settings?.about_explore2_path || '/vision', desc: settings?.about_explore2_desc || 'The future we are working toward — a world without educational poverty.' },
    { icon: <FiUsers className="w-6 h-6" />, label: settings?.about_explore3_label || 'Our Team', path: settings?.about_explore3_path || '/team', desc: settings?.about_explore3_desc || 'Meet the dedicated people who give their lives to this mission.' },
  ];

  return (
  <div>
    {/* Page Header */}
    <div className="page-header">
      <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white font-heading mb-4"
          >
            About {settings?.org_name || 'Anpuneri'}
          </motion.h1>
        <p className="text-primary-200 text-lg max-w-2xl mx-auto">
          Since 2009, we have been at the heart of our community — supporting families, educating children, and building hope where it's needed most.
        </p>
      </div>
    </div>

    {/* Story */}
    <SectionWrapper bg="white">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">Our Story</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-5 font-heading">
            Born from a Belief That Things Can Be Different
          </h2>
          {settings?.about_story_content ? (
            settings.about_story_content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {settings?.org_name || 'Anpuneri'} was founded in 2010 by a group of educators, doctors, and community leaders who watched helplessly as talented children dropped out of school due to poverty, and families fell deeper into hardship with no safety net.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                They started small — distributing school supplies to 50 students from a single classroom. Today, we support over 1,200 students annually, run health camps, provide emergency relief, and maintain a network of 180+ volunteers who give their time and skills to lift others.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our belief has never wavered: given the right support at the right moment, people can and do transform their lives. We are that support system.
              </p>
            </>
          )}
          <Link to="/mission" className="btn-primary">
            Our Mission <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700"
            alt="NGO community work"
            className="rounded-2xl w-full h-96 object-cover shadow-xl"
          />
          <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white rounded-2xl p-6 shadow-xl">
            <div className="text-4xl font-bold mb-1">14+</div>
            <div className="text-primary-200 text-sm">Years of Service</div>
          </div>
        </div>
      </div>
    </SectionWrapper>

    {/* Values */}
    <SectionWrapper bg="gray">
      <SectionHeader
        eyebrow={settings?.about_values_eyebrow || "What Guides Us"}
        title={settings?.about_values_title || "Our Core Values"}
        subtitle={settings?.about_values_subtitle || "These principles shape every decision we make and every program we run."}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 text-center"
          >
            <div className="text-4xl mb-3">{v.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>

    {/* Navigation Cards */}
    <SectionWrapper bg="white">
      <SectionHeader 
        eyebrow={settings?.about_explore_eyebrow || "Explore More"} 
        title={settings?.about_explore_title || "Learn About Our Organization"} 
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exploreCards.map((card) => (
          <Link key={card.path} to={card.path}>
            <motion.div
              whileHover={{ y: -4 }}
              className="card p-6 h-full hover:border-primary-200 border border-transparent transition-colors"
            >
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{card.label}</h3>
              <p className="text-sm text-gray-500 mb-4">{card.desc}</p>
              <span className="text-primary-600 text-sm font-semibold flex items-center gap-1">
                Learn more <FiArrowRight className="w-3.5 h-3.5" />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </SectionWrapper>
  </div>
  );
};

export default AboutPage;
