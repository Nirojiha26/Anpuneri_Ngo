import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiHeart, FiAlertCircle } from 'react-icons/fi';
import { login, clearError } from '../../redux/slices/authSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-8 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-white w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">Admin Portal</h1>
            <p className="text-primary-200 text-sm mt-1">{settings?.org_name || 'Anpuneri'} NGO</p>
          </div>

          <div className="px-8 py-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sign in to your account</h2>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5">
                <FiAlertCircle className="text-red-500 shrink-0 w-4 h-4" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="admin@ngo.org"
                icon={<FiMail className="w-4 h-4" />}
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
                placeholder="Your password"
                icon={<FiLock className="w-4 h-4" />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password', { required: 'Password is required' })}
              />

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="mt-2"
              >
                Sign In
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-700 mb-1">Demo Credentials</p>
              <p className="text-xs text-amber-600">Email: <span className="font-mono">admin@ngo.org</span></p>
              <p className="text-xs text-amber-600">Password: <span className="font-mono">Admin@123456</span></p>
            </div>

            <div className="text-center mt-5">
              <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
