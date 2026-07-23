import { useState, useEffect, useMemo } from 'react';
import { FiSettings, FiSave, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { settingsService } from '../../services/apiServices';
import { getImageUrl } from '../../utils/helpers';
import Button from '../../components/common/Button';
import { Spinner } from '../../components/common/Loading';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_LABELS = {
  home: 'Home Page',
  general: 'Footer Details',
  about: 'About Page Overview',
  about_values: 'About Page - Values',
  about_explore: 'About Page - Explore',
  contact: 'Contact Page',
  social: 'Social Media Links',
  seo: 'Search Engine (SEO)',
  stats: 'Public Impact Statistics',
  appearance: 'Website Appearance',
  legal: 'Legal & Privacy Policy',
};

const getCategoryLabel = (key) => CATEGORY_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const AdminSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({});
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    settingsService.adminGetAll().then((res) => {
      const data = res.data.data?.settings || [];
      setSettings(data);
      const vals = {};
      data.forEach((s) => { vals[s.key] = s.value; });
      setValues(vals);
    }).finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    return settings.reduce((acc, s) => {
      const group = s.group || 'general';
      if (!acc[group]) acc[group] = [];
      acc[group].push(s);
      return acc;
    }, {});
  }, [settings]);

  const categories = Object.keys(grouped);

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab]);

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    const toastId = toast.loading('Uploading image...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await settingsService.uploadImage(formData);
      const url = res.data.data.url;
      setValues({ ...values, [key]: url });
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload image', { id: toastId });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = { settings: Object.entries(values).map(([key, value]) => ({ key, value })) };
      await settingsService.update(updatedData);
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm pb-4 pt-2 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
            <FiSettings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Platform Settings</h1>
            <p className="text-sm text-gray-500">Manage your website content and configurations.</p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          loading={saving} 
          icon={<FiSave />} 
          size="lg" 
          className="shadow-lg shadow-primary-500/30 whitespace-nowrap px-6"
        >
          Save Changes
        </Button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 bg-white border border-gray-100 shadow-sm rounded-2xl p-3 flex flex-col gap-1 md:sticky md:top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Categories
          </div>
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`text-left w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {getCategoryLabel(cat)}
              </button>
            );
          })}
        </div>

        {/* Settings Form Content */}
        <div className="flex-1 w-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab && grouped[activeTab] && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 md:p-8"
              >
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <h2 className="text-3xl font-extrabold text-primary-700 tracking-tight capitalize">
                    {getCategoryLabel(activeTab)}
                  </h2>
                  <p className="text-base text-gray-500 mt-2">
                    Update information related to {getCategoryLabel(activeTab).toLowerCase()}.
                  </p>
                </div>
                
                <div className="space-y-8 max-w-3xl">
                  {grouped[activeTab].map((setting) => {
                    let labelColorClass = 'text-gray-600';
                    if (setting.key.includes('mission')) labelColorClass = 'text-purple-600';
                    else if (setting.key.includes('vision')) labelColorClass = 'text-emerald-600';
                    else if (setting.key.includes('about')) labelColorClass = 'text-blue-600';
                    return (
                    <div key={setting.key} className="flex flex-col gap-2">
                      <label className={`block text-sm font-bold ${labelColorClass} uppercase tracking-wider`}>
                        {setting.label}
                        {setting.isPublic && (
                          <span className="ml-3 text-[10px] uppercase font-bold tracking-wider text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full align-middle">
                            Public
                          </span>
                        )}
                      </label>
                      {setting.type === 'number' ? (
                        <input
                          type="number"
                          value={values[setting.key] || ''}
                          onChange={(e) => setValues({ ...values, [setting.key]: Number(e.target.value) })}
                          className="input-field"
                        />
                      ) : setting.inputType === 'textarea' ? (
                        <textarea
                          value={values[setting.key] || ''}
                          onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                          className="input-field min-h-[250px] resize-y p-4 text-base leading-relaxed"
                        />
                      ) : setting.inputType === 'image' ? (
                        <div className="flex items-center gap-6">
                          {values[setting.key] && (
                            <img src={getImageUrl(values[setting.key])} alt="Setting Image" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                          )}
                          <label className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium">
                            <FiUpload /> Choose Image
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(setting.key, e.target.files[0])} />
                          </label>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={values[setting.key] || ''}
                          onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
                          className="input-field p-3"
                        />
                      )}
                    </div>
                  ); })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
