import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiCheck, FiShield, FiLock } from 'react-icons/fi';
import { donationService } from '../../services/apiServices';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { DONATION_PURPOSES, DONATION_AMOUNTS } from '../../constants';
import { useScrollTop } from '../../hooks/useApi';

const DonatePage = () => {
  useScrollTop();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [donationId, setDonationId] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const onSubmit = async (data) => {
    if (!finalAmount || finalAmount < 1) return;
    setLoading(true);
    try {
      const res = await donationService.donate({
        ...data,
        amount: finalAmount,
        paymentMethod: 'card',
      });
      setDonationId(res.data.data?.donation?.transactionId || 'TXN-DEMO');
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-2">Your donation of <strong>${finalAmount}</strong> has been processed.</p>
          <p className="text-sm text-gray-400 mb-6">Transaction ID: {donationId}</p>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            Your generosity will directly fund education programs, school supplies, and community support for families in need. We will send a receipt to your email.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelectedAmount(100); setCustomAmount(''); }}
            className="btn-primary w-full"
          >
            Make Another Donation
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white font-heading mb-4">
            Make a Donation
          </h1>
          <p className="text-primary-200 text-lg max-w-xl mx-auto">
            Every contribution — large or small — creates a ripple of change that transforms lives and communities.
          </p>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Donation Details</h2>

              {/* Amount Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Amount (USD) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  {DONATION_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                      className={`py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                          : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  min="1"
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1.5">Minimum donation: $1</p>
              </div>

              {/* Purpose */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Donate Towards
                </label>
                <select className="input-field" {...register('purpose')}>
                  {DONATION_PURPOSES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    placeholder="John Doe"
                    error={errors.donorName?.message}
                    {...register('donorName', { required: 'Name is required' })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="john@example.com"
                    error={errors.donorEmail?.message}
                    {...register('donorEmail', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email required' },
                    })}
                  />
                </div>

                <Input
                  label="Phone (Optional)"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('donorPhone')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Leave a message of encouragement..."
                    className="input-field resize-none"
                    {...register('message')}
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" {...register('isAnonymous')} />
                  <span className="text-sm text-gray-600">Make my donation anonymous</span>
                </label>

                {/* Payment Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-2.5">
                    <FiShield className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 mb-1">Demo Payment Mode</p>
                      <p className="text-xs text-amber-600">
                        This is a demonstration. No real charges will be made. In production, this integrates with Stripe or PayPal.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                  icon={<FiHeart />}
                >
                  Donate ${finalAmount || '0'} Now
                </Button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {/* Impact Card */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">Your Impact</h3>
              <div className="space-y-3">
                {[
                  { amount: 25, desc: 'Buys school supplies for 1 student' },
                  { amount: 50, desc: 'Covers 1 child\'s supplies for a full year' },
                  { amount: 100, desc: 'Provides a health camp visit for a family' },
                  { amount: 250, desc: 'Pays a semester of tuition for a scholar' },
                  { amount: 500, desc: 'Funds emergency relief for a family in crisis' },
                ].map((item) => (
                  <div key={item.amount} className="flex items-start gap-3">
                    <span className="w-14 text-primary-200 font-bold text-sm shrink-0">${item.amount}</span>
                    <span className="text-primary-100 text-sm">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
