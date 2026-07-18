import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi';
import { teamService } from '../../services/apiServices';
import { CardGridSkeleton } from '../../components/common/Loading';
import { getImageUrl, getInitials } from '../../utils/helpers';
import SectionWrapper, { SectionHeader } from '../../components/common/SectionWrapper';
import { useScrollTop } from '../../hooks/useApi';

const TeamCard = ({ member }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="card p-6 text-center"
  >
    <div className="relative w-24 h-24 mx-auto mb-4">
      {member.avatar ? (
        <img
          src={getImageUrl(member.avatar)}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-primary-50"
          loading="lazy"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(member.name)}
        </div>
      )}
    </div>
    <h3 className="font-bold text-gray-900 mb-0.5">{member.name}</h3>
    <p className="text-primary-600 text-sm font-medium mb-1">{member.designation}</p>
    {member.department && (
      <p className="text-xs text-gray-400 mb-3 capitalize">{member.department}</p>
    )}
    {member.bio && (
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{member.bio}</p>
    )}
    <div className="flex justify-center gap-2.5">
      {member.social?.linkedin && (
        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 bg-gray-100 hover:bg-primary-600 text-gray-500 hover:text-white rounded-lg flex items-center justify-center transition-all">
          <FiLinkedin className="w-4 h-4" />
        </a>
      )}
      {member.social?.twitter && (
        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 bg-gray-100 hover:bg-sky-500 text-gray-500 hover:text-white rounded-lg flex items-center justify-center transition-all">
          <FiTwitter className="w-4 h-4" />
        </a>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`}
          className="w-8 h-8 bg-gray-100 hover:bg-accent-600 text-gray-500 hover:text-white rounded-lg flex items-center justify-center transition-all">
          <FiMail className="w-4 h-4" />
        </a>
      )}
    </div>
  </motion.div>
);

const TeamPage = () => {
  useScrollTop();
  const { data: settings } = useSelector((s) => s.settings);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamService.getAll().then((res) => {
      // The API returns { data: { team: [...] } } inside the axios response
      setTeam(res.data?.data?.team || []);
    }).finally(() => setLoading(false));
  }, []);

  const leadership = team.filter((m) => m.department === 'leadership');
  const others = team.filter((m) => m.department !== 'leadership');

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">{settings?.team_header_title || 'Our Team'}</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            {settings?.team_header_desc || 'Meet the dedicated individuals who give their expertise and passion to fulfil our mission every day.'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="container-custom py-16"><CardGridSkeleton count={6} /></div>
      ) : (
        <>
          {leadership.length > 0 && (
            <SectionWrapper bg="white">
              <SectionHeader 
                eyebrow={settings?.team_leadership_eyebrow || "Our Leaders"} 
                title={settings?.team_leadership_title || "Leadership Team"} 
                subtitle={settings?.team_leadership_subtitle || "The visionaries who guide our strategy and drive our impact."} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {leadership.map((m) => <TeamCard key={m._id} member={m} />)}
              </div>
            </SectionWrapper>
          )}

          {others.length > 0 && (
            <SectionWrapper bg="gray">
              <SectionHeader 
                eyebrow={settings?.team_program_eyebrow || "Our People"} 
                title={settings?.team_program_title || "Program Team"} 
                subtitle={settings?.team_program_subtitle || "The talented staff who execute our programs and serve our communities."} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((m) => <TeamCard key={m._id} member={m} />)}
              </div>
            </SectionWrapper>
          )}
        </>
      )}
    </div>
  );
};

export default TeamPage;
