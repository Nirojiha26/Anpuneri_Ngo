import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { sliderService } from '../../services/apiServices';
import { AdminListPage } from '../../components/admin/AdminListPage';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getImageUrl } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Badge';

const SliderForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { isActive: true, order: 0, ctaLabel: 'Donate Now', ctaPath: '/donate' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = new FormData();
    const excludeFields = ['_id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'image'];
    Object.entries(data).forEach(([k, v]) => { 
      if (excludeFields.includes(k)) return;
      if (v !== '' && v !== undefined && v !== null) {
        fd.append(k, v);
      } 
    });
    // file
    const fileInput = document.getElementById('slider-image');
    if (fileInput?.files?.[0]) {
      fd.append('image', fileInput.files[0]);
    } else if (!item) {
      toast.error('Image is required for a new slide');
      setLoading(false);
      return;
    }

    try {
      if (item) await sliderService.update(item._id, fd);
      else await sliderService.create(fd);
      toast.success(item ? 'Slide updated!' : 'Slide created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Content Info */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">1. Text Content</h3>
          <Input label="Eyebrow (Small text above title)" {...register('eyebrow')} placeholder="e.g. Together We Can" />
          <Input label="Main Title" required error={errors.title?.message} {...register('title', { required: 'Title required' })} placeholder="e.g. Empowering Communities" />
          <Input label="Subtitle (Description)" {...register('subtitle')} placeholder="Brief description text..." />
        </section>

        {/* Call to Actions */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">2. Buttons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Primary Button Label" {...register('ctaLabel')} placeholder="e.g. Donate Now" />
            <Input label="Primary Button URL" {...register('ctaPath')} placeholder="e.g. /donate" />
            <Input label="Secondary Button Label" {...register('ctaSecondaryLabel')} placeholder="e.g. Our Work" />
            <Input label="Secondary Button URL" {...register('ctaSecondaryPath')} placeholder="e.g. /projects" />
          </div>
        </section>

        {/* Media & Settings */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">3. Media & Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Display Order (0 is first)" type="number" {...register('order')} />
            <div className="flex items-center mt-6">
              <input type="checkbox" id="isActive" {...register('isActive')} className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600 mr-2" />
              <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer">Active (Show on Home Page)</label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Background Image</label>
              <input id="slider-image" type="file" accept="image/*" className="input-field py-2 text-sm bg-gray-50" />
              {item?.image && <p className="text-xs text-primary-600 font-medium mt-1">Currently uploaded: {item.image.split('/').pop()}</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <Button type="submit" size="lg" loading={loading} className="min-w-[120px] justify-center">
          {item ? 'Save Changes' : 'Create Slide'}
        </Button>
      </div>
    </form>
  );
};

const COLUMNS = [
  {
    key: 'title',
    label: 'Slide',
    render: (s) => (
      <div className="flex items-center gap-3">
        {s.image && <img src={getImageUrl(s.image)} alt={s.title} className="w-16 h-10 rounded-lg object-cover shrink-0" />}
        <div>
          <p className="text-sm font-medium text-gray-900 line-clamp-1">{s.title}</p>
          {s.eyebrow && <p className="text-xs text-gray-500">{s.eyebrow}</p>}
        </div>
      </div>
    ),
  },
  { key: 'order', label: 'Order', render: (s) => <span className="text-sm font-medium text-gray-700">{s.order}</span> },
  { key: 'isActive', label: 'Status', render: (s) => <StatusBadge status={s.isActive ? 'published' : 'hidden'} /> },
  { key: 'buttons', label: 'Buttons', render: (s) => (
    <div className="flex flex-col gap-1 text-xs">
      {s.ctaLabel && <span className="text-primary-600">{s.ctaLabel}</span>}
      {s.ctaSecondaryLabel && <span className="text-secondary-600">{s.ctaSecondaryLabel}</span>}
    </div>
  )},
];

const AdminSliders = () => (
  <AdminListPage
    title="Hero Slider"
    icon={<FiImage className="w-5 h-5" />}
    fetchFn={sliderService.adminGetAll}
    deleteFn={sliderService.delete}
    columns={COLUMNS}
    createLabel="Add Slide"
    renderForm={({ item, onClose }) => <SliderForm item={item} onClose={onClose} />}
  />
);

export default AdminSliders;
