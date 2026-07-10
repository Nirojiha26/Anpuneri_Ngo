import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCheck, FiUsers, FiClock, FiHeart, FiStar } from 'react-icons/fi';
import { volunteerService } from '../../services/apiServices';
import Button from '../../components/common/Button';
import Input, { Textarea, Select } from '../../components/common/Input';
import SectionWrapper, { SectionHeader } from '../../components/common/SectionWrapper';
import { VOLUNTEER_AVAILABILITY } from '../../constants';
import { useScrollTop } from '../../hooks/useApi';

const SKILL_OPTIONS = ['Teaching', 'Medical', 'Counseling', 'IT/Technology', 'Graphic Design', 'Photography', 'Event Management', 'Fundraising', 'Administration', 'Social Work', 'Cooking', 'Transport/Driving', 'Construction', 'Other'];

const INTEREST_OPTIONS = ['Education Programs', 'Health Camps', 'Emergency Relief', 'Community Events', 'Administrative Support', 'Fundraising', 'Social Media & Communications', 'Technical Support'];

const WHY_VOLUNTEER = [
  { icon: <FiHeart />, title: 'Make Real Impact', desc: 'Your time directly changes lives — not statistics.' },
  { icon: <FiUsers />, title: 'Join a Community', desc: '180+ volunteers who share your values and passion.' },
  { icon: <FiStar />, title: 'Grow Skills', desc: 'Gain leadership, mentoring, and professional experience.' },
  { icon: <FiClock />, title: 'Flexible Hours', desc: 'Volunteer on your schedule — from 2 hours to full weeks.' },
];

const VolunteerPage = () => {
  useScrollTop();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await volunteerService.apply({ ...data, skills: selectedSkills, interests: selectedInterests });
      setSubmitted(true);
      reset();
      setSelectedSkills([]);
      setSelectedInterests([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for volunteering with us! Our coordinator will review your application and contact you within 3–5 business days.
          </p>
          <button onClick={() => setSubmitted(false)} className="btn-primary w-full">
            Submit Another Application
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">Volunteer With Us</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Your time and skills can change someone's life. Join 180+ volunteers who give what they can to build something that lasts.
          </p>
        </div>
      </div>

      {/* Why Volunteer */}
      <SectionWrapper bg="gray">
        <SectionHeader eyebrow="Why Volunteer" title="What You'll Gain" subtitle="Volunteering is a two-way street — you give your time, and you grow in ways you never expected." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_VOLUNTEER.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 text-center"
            >
              <div className="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Application Form */}
      <SectionWrapper bg="white">
        <div className="max-w-3xl mx-auto">
          <SectionHeader eyebrow="Apply Now" title="Volunteer Application" subtitle="Fill out the form below and we'll be in touch within 3-5 business days." />

          <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name" required placeholder="Jane Smith"
                  error={errors.name?.message}
                  {...register('name', { required: 'Full name is required' })}
                />
                <Input
                  label="Email Address" type="email" required placeholder="jane@example.com"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' },
                  })}
                />
                <Input
                  label="Phone Number" type="tel" required placeholder="+1 (555) 000-0000"
                  error={errors.phone?.message}
                  {...register('phone', { required: 'Phone is required' })}
                />
                <Input
                  label="City / Area" placeholder="Your city or neighborhood"
                  {...register('city')}
                />
                <Input
                  label="Occupation" placeholder="Your current job or student status"
                  {...register('occupation')}
                />
                <Select
                  label="Availability"
                  options={VOLUNTEER_AVAILABILITY}
                  {...register('availability')}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Skills & Expertise</h3>
              <p className="text-sm text-gray-500 mb-3">Select all that apply:</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${
                      selectedSkills.includes(skill)
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-200 text-gray-600 hover:border-primary-300'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Areas of Interest</h3>
              <p className="text-sm text-gray-500 mb-3">Where would you like to contribute?</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-secondary-600 text-white border-secondary-600'
                        : 'border-gray-200 text-gray-600 hover:border-secondary-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">About You</h3>
              <div className="space-y-4">
                <Textarea
                  label="Why do you want to volunteer with us?"
                  required
                  placeholder="Tell us what motivates you to give back..."
                  rows={4}
                  error={errors.motivation?.message}
                  {...register('motivation', { required: 'Please tell us your motivation' })}
                />
                <Textarea
                  label="Relevant Experience (Optional)"
                  placeholder="Share any previous volunteer or relevant professional experience..."
                  rows={3}
                  {...register('experience')}
                />
                <Input
                  label="Hours per week you can volunteer"
                  type="number"
                  placeholder="e.g. 4"
                  min={1}
                  max={40}
                  {...register('hoursPerWeek', { valueAsNumber: true })}
                />
              </div>
            </div>

            <Button type="submit" loading={loading} fullWidth size="lg" icon={<FiHeart />}>
              Submit Volunteer Application
            </Button>
          </form>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default VolunteerPage;
