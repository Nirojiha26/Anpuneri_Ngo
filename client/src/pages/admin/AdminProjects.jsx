import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { projectService } from '../../services/apiServices';
import { AdminListPage } from '../../components/admin/AdminListPage';
import Input, { Textarea, Select } from '../../components/common/Input';
import Button from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';
import { formatCurrency, getProgress, getImageUrl } from '../../utils/helpers';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '../../constants';

const VISIBILITY_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'hidden', label: 'Hidden' },
];

const ProjectForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'ongoing', visibility: 'published', category: 'education' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = new FormData();
    const excludeFields = ['_id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'image', 'gallery', 'slug'];
    Object.entries(data).forEach(([k, v]) => { 
      if (excludeFields.includes(k)) return;
      if (v !== '' && v !== undefined && v !== null && !Number.isNaN(v)) {
        fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v);
      } 
    });
    // file
    const fileInput = document.getElementById('proj-image');
    if (fileInput?.files?.[0]) fd.append('image', fileInput.files[0]);

    try {
      if (item) await projectService.update(item._id, fd);
      else await projectService.create(fd);
      toast.success(item ? 'Project updated!' : 'Project created!');
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
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">1. Basic Information</h3>
          <Input label="Project Title" required error={errors.title?.message} {...register('title', { required: 'Title required' })} />
          <Textarea label="Short Description (Summary for cards)" rows={2} {...register('shortDescription')} />
          <Textarea 
            label="Full Story (Facebook Post Content)" 
            rows={10} 
            placeholder="Paste the full story here. You can use line breaks to separate paragraphs..."
            {...register('description')} 
          />
          <Input label="Facebook Post/Album URL" type="url" placeholder="https://facebook.com/..." {...register('facebookUrl')} />
        </section>

        {/* Categorization */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">2. Categorization & Media</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" options={PROJECT_CATEGORIES} {...register('category')} />
            <Select label="Status" options={PROJECT_STATUSES} {...register('status')} />
            <Select label="Visibility" options={VISIBILITY_OPTIONS} {...register('visibility')} />
            <Input label="Location" {...register('location')} />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
              <input id="proj-image" type="file" accept="image/*" className="input-field py-2 text-sm bg-gray-50" />
              {item?.image && <p className="text-xs text-primary-600 font-medium mt-1">Currently uploaded: {item.image.split('/').pop()}</p>}
            </div>
          </div>
        </section>

        {/* Financials & Metrics */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 mb-4">3. Financials & Impact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Target Amount ($)" type="number" min={0} {...register('targetAmount', { valueAsNumber: true })} />
            <Input label="Raised Amount ($)" type="number" min={0} {...register('raisedAmount', { valueAsNumber: true })} />
            <Input label="Beneficiaries Count" type="number" min={0} {...register('beneficiaries', { valueAsNumber: true })} />
          </div>
          <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl mt-4">
            <input type="checkbox" id="featured" {...register('isFeatured')} className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-600" />
            <label htmlFor="featured" className="text-sm font-bold text-primary-900 cursor-pointer">Mark as Featured Project (Shows on Homepage)</label>
          </div>
        </section>
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <Button type="submit" size="lg" loading={loading} className="min-w-[120px] justify-center">
          {item ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

const COLUMNS = [
  {
    key: 'title',
    label: 'Project',
    render: (p) => (
      <div className="flex items-center gap-3">
        {p.image && <img src={getImageUrl(p.image)} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
        <div>
          <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</p>
          <p className="text-xs text-gray-400 capitalize">{p.category}</p>
        </div>
      </div>
    ),
  },
  { key: 'status', label: 'Status', render: (p) => <StatusBadge status={p.status} /> },
  { key: 'progress', label: 'Funding', render: (p) => (
    <div>
      <p className="text-xs text-gray-500 mb-1">{getProgress(p.raisedAmount, p.targetAmount)}%</p>
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${getProgress(p.raisedAmount, p.targetAmount)}%` }} />
      </div>
    </div>
  )},
  { key: 'beneficiaries', label: 'Beneficiaries', render: (p) => <span className="text-sm text-gray-700">{p.beneficiaries?.toLocaleString() || '—'}</span> },
  { key: 'visibility', label: 'Visibility', render: (p) => <StatusBadge status={p.visibility} /> },
];

const AdminProjects = () => (
  <AdminListPage
    title="Projects"
    icon={<FiFolder className="w-5 h-5" />}
    fetchFn={projectService.adminGetAll}
    deleteFn={projectService.delete}
    columns={COLUMNS}
    createLabel="Add Project"
    renderForm={({ item, onClose }) => <ProjectForm item={item} onClose={onClose} />}
  />
);

export default AdminProjects;
