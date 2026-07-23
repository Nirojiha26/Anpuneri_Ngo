import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiHeart, FiCheck, FiInfo, FiArrowRight } from 'react-icons/fi';
import { donationService } from '../../services/apiServices';
import { DONATION_PURPOSES } from '../../constants';
import { useScrollTop } from '../../hooks/useApi';

const DonatePage = () => {
  useScrollTop();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { amount: '' }
  });

  const onSubmit = async (data) => {
    const amount = parseFloat(data.amount);
    if (!amount || amount < 1) return;
    
    setLoading(true);
    try {
      await donationService.donate({
        ...data,
        amount,
        paymentMethod: 'other', 
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    reset();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/5 backdrop-blur-3xl z-0" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-primary-900/10 max-w-md w-full text-center relative z-10 border border-white"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
          >
            <FiCheck className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 font-heading tracking-tight">Thank You!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your pledge has been successfully recorded. Our team will contact you shortly to complete the donation process.
          </p>
          <button 
            onClick={handleReset} 
            className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            Make Another Pledge
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex items-center pt-24 pb-12 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary-900 via-primary-800 to-[#F8FAFC] z-0" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px] z-0" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-[120px] z-0" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-primary-900/10 border border-white/50 overflow-hidden">
            <div className="grid md:grid-cols-5 flex-col-reverse md:flex-row">
              
              {/* Left Side: Info */}
              <div className="md:col-span-2 bg-primary-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-600 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20">
                    <FiHeart className="w-7 h-7 text-accent-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight font-heading">
                    Support Our<br/>Mission
                  </h2>
                  <p className="text-primary-200 text-sm leading-relaxed mb-8">
                    Your contribution creates a ripple of change. Whether it's funding education or providing emergency relief, every pledge matters.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-primary-100">
                      <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center shrink-0">1</div>
                      <p>Fill out your pledge details</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-primary-100">
                      <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center shrink-0">2</div>
                      <p>Our team contacts you</p>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-primary-100">
                      <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center shrink-0">3</div>
                      <p>Complete your donation safely</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="md:col-span-3 p-8 md:p-12 bg-white/60">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 font-heading">Pledge Details</h3>
                  <p className="text-gray-500 text-sm mt-1">Register your intent to donate below.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    {/* Amount */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Amount (USD) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold group-focus-within:text-primary-600 transition-colors">$</span>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          placeholder="100"
                          className="w-full pl-9 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none font-semibold text-gray-900"
                          {...register('amount', { required: 'Required' })}
                        />
                      </div>
                      {errors.amount && <p className="text-red-500 text-[10px] mt-1.5 font-medium">{errors.amount.message}</p>}
                    </div>

                    {/* Purpose */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Support Fund
                      </label>
                      <select 
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none text-gray-900 font-medium appearance-none cursor-pointer" 
                        {...register('purpose')}
                      >
                        {DONATION_PURPOSES.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                        {...register('donorName', { required: 'Required' })}
                      />
                      {errors.donorName && <p className="text-red-500 text-[10px] mt-1.5 font-medium">{errors.donorName.message}</p>}
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                        {...register('donorEmail', {
                          required: 'Required',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                        })}
                      />
                      {errors.donorEmail && <p className="text-red-500 text-[10px] mt-1.5 font-medium">{errors.donorEmail.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                        {...register('donorPhone')}
                      />
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Message (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Any comments?"
                        className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                        {...register('message')}
                      />
                    </div>
                  </div>

                  {/* Info Notice */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex gap-3 items-center mt-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <FiInfo className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-[11px] md:text-xs text-blue-800 font-medium leading-relaxed">
                      Submitting this form registers your intent to donate. Our team will reach out to you directly to arrange the transfer.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg shadow-primary-600/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Submit Details <FiArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
