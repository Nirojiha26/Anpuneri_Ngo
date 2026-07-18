import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheck, FiSend } from 'react-icons/fi';
import { contactService } from '../../services/apiServices';
import Button from '../../components/common/Button';
import Input, { Textarea } from '../../components/common/Input';
import { useScrollTop } from '../../hooks/useApi';

const ContactPage = () => {
  useScrollTop();
  const { data: settings } = useSelector((s) => s.settings);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactService.submit(data);
      setSubmitted(true);
      reset();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <FiMapPin />, label: 'Address', value: settings?.org_address || 'Ontario, Canada' },
    { icon: <FiPhone />, label: 'Phone', value: settings?.org_phone || '+1 (555) 123-4567', href: `tel:${settings?.org_phone || '+15551234567'}` },
    { icon: <FiMail />, label: 'Email', value: settings?.org_email || 'info@anpuneri.org', href: `mailto:${settings?.org_email || 'info@anpuneri.org'}` },
    { icon: <FiClock />, label: 'Office Hours', value: 'Mon–Fri: 9AM–5PM' },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">{settings?.contact_header_title || 'Contact Us'}</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            {settings?.contact_header_desc || "We'd love to hear from you. Whether you have a question, partnership inquiry, or just want to connect — reach out."}
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-heading">{settings?.contact_section_title || 'Get in Touch'}</h2>
              <p className="text-gray-600">{settings?.contact_section_desc || 'We respond to all messages within 1–2 business days.'}</p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-gray-700 hover:text-primary-600 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-700">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden bg-gray-100 h-52 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FiMapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">{settings?.org_address || 'Ontario, Canada'}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card p-10 text-center h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FiCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-6">We've received your message and will reply within 1–2 business days.</p>
                <button onClick={() => setSubmitted(false)} className="btn-outline">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <div className="card p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name" required placeholder="Your name"
                      error={errors.name?.message}
                      {...register('name', { required: 'Name required' })}
                    />
                    <Input
                      label="Email" type="email" required placeholder="your@email.com"
                      error={errors.email?.message}
                      {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                    />
                  </div>
                  <Input
                    label="Phone (Optional)" type="tel" placeholder="+1 (555) 000-0000"
                    {...register('phone')}
                  />
                  <Input
                    label="Subject" required placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register('subject', { required: 'Subject required' })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select className="input-field" {...register('category')}>
                      <option value="general">General Inquiry</option>
                      <option value="donation">Donation</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="partnership">Partnership</option>
                      <option value="media">Media</option>
                    </select>
                  </div>
                  <Textarea
                    label="Message" required rows={5} placeholder="Your message..."
                    error={errors.message?.message}
                    {...register('message', { required: 'Message required', minLength: { value: 20, message: 'Minimum 20 characters' } })}
                  />
                  <Button type="submit" loading={loading} fullWidth icon={<FiSend />}>
                    Send Message
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
