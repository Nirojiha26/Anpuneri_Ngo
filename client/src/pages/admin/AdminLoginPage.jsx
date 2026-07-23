import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiHeart, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { login, clearError } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import bgImage from '../../assets/images/admin-login-bg.png';

const AdminLoginPage = () => {
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const { data: settings } = useSelector((s) => s.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin', { replace: true });
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left section - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/30 mix-blend-multiply z-10" />
        <img 
          src={bgImage} 
          alt="Humanitarian relief" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent z-20" />
        
        <div className="relative z-30 flex flex-col justify-end p-12 xl:p-16 h-full text-white w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30 shadow-xl">
              <FiHeart className="text-white w-8 h-8 drop-shadow-md" />
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold font-heading mb-6 leading-tight drop-shadow-lg">
              Making a difference, <br />
              <span className="text-primary-300">together.</span>
            </h1>
            <p className="text-lg xl:text-xl text-primary-50/90 max-w-lg leading-relaxed drop-shadow-md font-medium">
              Welcome to the {settings?.org_name || 'Anpuneri'} NGO Admin Portal. Manage operations, track relief efforts, and coordinate volunteers efficiently.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 xl:p-16 bg-gray-50/50">
        <div className="w-full max-w-md relative">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors mb-10 group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200/60 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
              <FiArrowLeft className="w-4 h-4" />
            </div>
            Back to Website
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Mobile Header */}
            <div className="lg:hidden mb-10 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-primary-200/50">
                <FiHeart className="text-primary-600 w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 font-heading tracking-tight">Admin Portal</h1>
              <p className="text-gray-500 text-base mt-2 font-medium">{settings?.org_name || 'Anpuneri'} NGO</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 font-heading tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 mt-3 text-lg font-medium">Sign in to your administrator account</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8 shadow-sm"
              >
                <FiAlertCircle className="text-red-500 shrink-0 w-5 h-5 mt-0.5" />
                <p className="text-red-700 text-sm font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="admin@ngo.org"
                icon={<FiMail className="w-5 h-5" />}
                error={errors.email?.message}
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                })}
              />
              
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                icon={<FiLock className="w-5 h-5" />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                  className="shadow-lg shadow-primary-600/30 text-base font-semibold py-4 rounded-xl hover:shadow-primary-600/40 transition-all hover:-translate-y-0.5"
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
