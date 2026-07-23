import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FiUser, FiLock, FiMail, FiCheck, FiCamera } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateProfile, getMe } from '../../redux/slices/authSlice';
import { authService } from '../../services/apiServices';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { motion } from 'framer-motion';

const AdminProfile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // If user is from cache and has old email, use the new one for display
  const displayEmail = user?.email === 'admin@ngo.org' ? 'admin@anpuneri.org' : (user?.email || '');

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: displayEmail,
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm();

  useEffect(() => {
    // Refresh user data on mount to ensure we have the latest from DB
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    resetProfile({
      name: user?.name || '',
      email: user?.email === 'admin@ngo.org' ? 'admin@anpuneri.org' : (user?.email || ''),
    });
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    setIsUpdatingProfile(true);
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      resetPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="h-48 bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-xl">
                <div className="w-full h-full bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <FiCamera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1 pb-2">
              <h1 className="text-3xl font-bold text-gray-900 font-heading">{user?.name}</h1>
              <p className="text-gray-500 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                <FiMail className="w-4 h-4" />
                {displayEmail}
              </p>
            </div>
            <div className="pb-2 hidden md:block">
              <span className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-xl text-sm border border-primary-100 uppercase tracking-wider">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-heading">Personal Info</h2>
              <p className="text-sm text-gray-500 font-medium">Update your profile details</p>
            </div>
          </div>
          <div className="p-8 flex-1">
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6 h-full flex flex-col">
              <Input
                label="Full Name"
                icon={<FiUser className="w-5 h-5" />}
                error={profileErrors.name?.message}
                {...registerProfile('name', { required: 'Name is required' })}
              />
              <Input
                label="Email Address"
                type="email"
                icon={<FiMail className="w-5 h-5" />}
                error={profileErrors.email?.message}
                // Allowing email to be read-only since auth is usually tied to it
                disabled
                {...registerProfile('email')}
                hint="Contact super admin to change your registered email address."
              />
              <div className="pt-6 mt-auto">
                <Button type="submit" loading={isUpdatingProfile} className="w-full sm:w-auto shadow-md">
                  <FiCheck className="w-5 h-5 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
        >
          <div className="px-8 py-6 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-heading">Security</h2>
              <p className="text-sm text-gray-500 font-medium">Update your password</p>
            </div>
          </div>
          <div className="p-8 flex-1">
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6 h-full flex flex-col">
              <Input
                label="Current Password"
                type="password"
                icon={<FiLock className="w-5 h-5" />}
                error={passwordErrors.currentPassword?.message}
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
              />
              <Input
                label="New Password"
                type="password"
                icon={<FiLock className="w-5 h-5" />}
                error={passwordErrors.newPassword?.message}
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                icon={<FiLock className="w-5 h-5" />}
                error={passwordErrors.confirmPassword?.message}
                {...registerPassword('confirmPassword', { required: 'Please confirm your new password' })}
              />
              <div className="pt-6 mt-auto">
                <Button type="submit" variant="secondary" loading={isChangingPassword} className="w-full sm:w-auto shadow-md">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;
