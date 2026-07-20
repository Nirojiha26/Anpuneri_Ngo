// AdminContent.jsx — All remaining admin CRUD pages
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  FiCalendar, FiImage, FiUsers, FiStar, FiFileText,
  FiMessageSquare, FiHelpCircle, FiAward,
} from 'react-icons/fi';
import {
  eventService, newsService, galleryService, teamService,
  testimonialService, faqService, successStoryService, userService,
} from '../../services/apiServices';
import { AdminListPage } from '../../components/admin/AdminListPage';
import Input, { Textarea, Select } from '../../components/common/Input';
import Button from '../../components/common/Button';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate, getImageUrl } from '../../utils/helpers';
import {
  EVENT_CATEGORIES, NEWS_CATEGORIES, GALLERY_CATEGORIES,
} from '../../constants';

// ── Helpers ───────────────────────────────────────────────────

const FileInput = ({ id, label, currentUrl }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input id={id} type="file" accept="image/*" className="input-field py-2 text-sm" />
    {currentUrl && (
      <img src={getImageUrl(currentUrl)} alt="" className="mt-2 h-16 w-24 rounded-lg object-cover" />
    )}
  </div>
);

const appendFormData = (data, excludeKeys = []) => {
  const fd = new FormData();
  const autoExclude = ['_id', '__v', 'createdAt', 'updatedAt', 'createdBy', 'image', 'avatar', 'gallery', 'slug', 'author'];
  Object.entries(data).forEach(([k, v]) => {
    if (!autoExclude.includes(k) && !excludeKeys.includes(k) && v !== '' && v !== undefined && v !== null && !Number.isNaN(v)) {
      fd.append(k, typeof v === 'object' ? JSON.stringify(v) : v);
    }
  });
  return fd;
};

const SaveButtons = ({ onClose, loading, label }) => (
  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
    <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
    <Button type="submit" loading={loading}>{label}</Button>
  </div>
);

// ── EVENTS ───────────────────────────────────────────────────

const EventForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'upcoming', visibility: 'published', category: 'fundraiser', isFree: true },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = appendFormData(data);
    const file = document.getElementById('evt-image')?.files?.[0];
    if (file) fd.append('image', file);
    try {
      if (item) await eventService.update(item._id, fd);
      else await eventService.create(fd);
      toast.success(item ? 'Event updated!' : 'Event created!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Input label="Title" required error={errors.title?.message}
        {...register('title', { required: 'Required' })} />
      <Textarea label="Short Description" rows={2} {...register('shortDescription')} />
      <Textarea label="Full Description" rows={4} {...register('description')} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={EVENT_CATEGORIES} {...register('category')} />
        <Select label="Status" options={[
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ]} {...register('status')} />
        <Select label="Visibility" options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'hidden', label: 'Hidden' },
        ]} {...register('visibility')} />
        <Input label="Start Date" type="date" required error={errors.startDate?.message}
          {...register('startDate', { required: 'Required' })} />
        <Input label="Start Time" type="text" placeholder="e.g. 9:00 AM" {...register('startTime')} />
        <Input label="End Time" type="text" placeholder="e.g. 5:00 PM" {...register('endTime')} />
        <Input label="Venue" {...register('venue')} />
        <Input label="Location / City" {...register('location')} />
        <Input label="Max Attendees" type="number" min={0} {...register('maxAttendees', { valueAsNumber: true })} />
        <Input label="Ticket Price ($)" type="number" min={0} {...register('ticketPrice', { valueAsNumber: true })} />
        <Input label="Organizer" {...register('organizer')} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" {...register('isFree')} />
          Free Event
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" {...register('isFeatured')} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" {...register('isRegistrationOpen')} />
          Registration Open
        </label>
      </div>
      <FileInput id="evt-image" label="Event Image" currentUrl={item?.image} />
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update Event' : 'Create Event'} />
    </form>
  );
};

export const AdminEvents = () => (
  <AdminListPage
    title="Events"
    icon={<FiCalendar className="w-5 h-5" />}
    fetchFn={eventService.adminGetAll}
    deleteFn={eventService.delete}
    createLabel="Add Event"
    columns={[
      { key: 'title', label: 'Event', render: (e) => (
        <div className="flex items-center gap-3">
          {e.image && <img src={getImageUrl(e.image)} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{e.title}</p>
            <p className="text-xs text-gray-400 capitalize">{e.category}</p>
          </div>
        </div>
      )},
      { key: 'startDate', label: 'Date', render: (e) => <span className="text-sm text-gray-600">{formatDate(e.startDate)}</span> },
      { key: 'venue', label: 'Venue', render: (e) => <span className="text-sm text-gray-600 line-clamp-1">{e.venue || '—'}</span> },
      { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
      { key: 'visibility', label: 'Visibility', render: (e) => <StatusBadge status={e.visibility} /> },
      { key: 'fee', label: 'Fee', render: (e) => <span className="text-sm text-gray-600">{e.isFree ? 'Free' : `$${e.ticketPrice}`}</span> },
    ]}
    renderForm={({ item, onClose }) => <EventForm item={item} onClose={onClose} />}
  />
);

// ── NEWS ───────────────────────────────────────────────────

const NewsForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'published', category: 'news' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = appendFormData(data);
    const file = document.getElementById('news-image')?.files?.[0];
    if (file) fd.append('image', file);
    try {
      if (item) await newsService.update(item._id, fd);
      else await newsService.create(fd);
      toast.success(item ? 'Article updated!' : 'Article published!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Input label="Title" required error={errors.title?.message}
        {...register('title', { required: 'Required' })} />
      <Textarea label="Excerpt / Summary" rows={2} {...register('excerpt')} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={8}
          className="input-field resize-y font-mono text-sm"
          placeholder="HTML content or plain text..."
          {...register('content', { required: 'Content required' })}
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={NEWS_CATEGORIES} {...register('category')} />
        <Select label="Status" options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]} {...register('status')} />
      </div>
      <Input label="Tags (comma-separated)" placeholder="education, students, scholarship" {...register('tags')} />
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" {...register('isFeatured')} />
          Featured
        </label>
      </div>
      <FileInput id="news-image" label="Cover Image" currentUrl={item?.image} />
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update Article' : 'Publish Article'} />
    </form>
  );
};

export const AdminNews = () => (
  <AdminListPage
    title="News"
    icon={<FiFileText className="w-5 h-5" />}
    fetchFn={newsService.adminGetAll}
    deleteFn={newsService.delete}
    createLabel="Add Article"
    columns={[
      { key: 'title', label: 'Article', render: (n) => (
        <div className="flex items-center gap-3">
          {n.image && <img src={getImageUrl(n.image)} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{n.title}</p>
            <p className="text-xs text-gray-400 capitalize">{n.category}</p>
          </div>
        </div>
      )},
      { key: 'views', label: 'Views', render: (n) => <span className="text-sm text-gray-600">{n.views || 0}</span> },
      { key: 'publishedAt', label: 'Published', render: (n) => <span className="text-xs text-gray-500">{formatDate(n.publishedAt || n.createdAt)}</span> },
      { key: 'status', label: 'Status', render: (n) => <StatusBadge status={n.status} /> },
      { key: 'isFeatured', label: 'Featured', render: (n) => (
        <span className={`text-xs font-medium ${n.isFeatured ? 'text-primary-600' : 'text-gray-400'}`}>
          {n.isFeatured ? '★ Yes' : 'No'}
        </span>
      )},
    ]}
    renderForm={({ item, onClose }) => <NewsForm item={item} onClose={onClose} />}
  />
);

// ── GALLERY ───────────────────────────────────────────────────

const GalleryForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: item || { status: 'published', category: 'events' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = appendFormData(data);
    const file = document.getElementById('gal-image')?.files?.[0];
    if (file) fd.append('image', file);
    try {
      if (item) await galleryService.update(item._id, fd);
      else await galleryService.upload(fd);
      toast.success(item ? 'Image updated!' : 'Image uploaded!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Input label="Title / Caption" required {...register('title', { required: 'Required' })} />
      <Textarea label="Description" rows={2} {...register('description')} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={GALLERY_CATEGORIES} {...register('category')} />
        <Select label="Status" options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]} {...register('status')} />
        <Input label="Sort Order" type="number" min={0} {...register('sortOrder', { valueAsNumber: true })} />
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pt-8">
          <input type="checkbox" className="w-4 h-4" {...register('isFeatured')} />
          Show on Home Page
        </label>
      </div>
      <FileInput id="gal-image" label="Image" currentUrl={item?.image} />
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update' : 'Upload Image'} />
    </form>
  );
};

export const AdminGallery = () => (
  <AdminListPage
    title="Gallery"
    icon={<FiImage className="w-5 h-5" />}
    fetchFn={galleryService.adminGetAll}
    deleteFn={galleryService.delete}
    createLabel="Upload Image"
    columns={[
      { key: 'image', label: 'Preview', render: (g) => (
        <img src={getImageUrl(g.image)} alt={g.title} className="w-16 h-12 rounded-lg object-cover" />
      )},
      { key: 'title', label: 'Title', render: (g) => <span className="text-sm font-medium text-gray-900">{g.title}</span> },
      { key: 'category', label: 'Category', render: (g) => <span className="text-sm capitalize text-gray-600">{g.category}</span> },
      { key: 'status', label: 'Status', render: (g) => <StatusBadge status={g.status} /> },
      { key: 'isFeatured', label: 'Show on Home', render: (g) => (
        <span className={`text-xs font-medium ${g.isFeatured ? 'text-primary-600' : 'text-gray-400'}`}>
          {g.isFeatured ? '★ Yes' : 'No'}
        </span>
      )},
    ]}
    renderForm={({ item, onClose }) => <GalleryForm item={item} onClose={onClose} />}
  />
);

// ── TEAM ───────────────────────────────────────────────────

const DEPARTMENTS = [
  { value: 'leadership', label: 'Leadership' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'community', label: 'Community' },
  { value: 'finance', label: 'Finance' },
  { value: 'communications', label: 'Communications' },
  { value: 'other', label: 'Other' },
];

const TeamForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'active', department: 'leadership' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = appendFormData(data);
    const file = document.getElementById('team-avatar')?.files?.[0];
    if (file) fd.append('avatar', file);
    try {
      if (item) await teamService.update(item._id, fd);
      else await teamService.create(fd);
      toast.success(item ? 'Member updated!' : 'Member added!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" required error={errors.name?.message}
          {...register('name', { required: 'Required' })} />
        <Input label="Designation / Title" required error={errors.designation?.message}
          {...register('designation', { required: 'Required' })} />
        <Select label="Department" options={DEPARTMENTS} {...register('department')} />
        <Input label="Email" type="email" {...register('email')} />
        <Input label="Phone" {...register('phone')} />
        <Input label="Joined Year" type="number" {...register('joinedYear', { valueAsNumber: true })} />
        <Input label="Sort Order" type="number" min={0} {...register('sortOrder', { valueAsNumber: true })} />
        <Select label="Status" options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]} {...register('status')} />
      </div>
      <Textarea label="Bio" rows={3} {...register('bio')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="LinkedIn URL" type="url" {...register('social.linkedin')} />
        <Input label="Twitter URL" type="url" {...register('social.twitter')} />
      </div>
      <FileInput id="team-avatar" label="Profile Photo" currentUrl={item?.avatar} />
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update Member' : 'Add Member'} />
    </form>
  );
};

export const AdminTeam = () => (
  <AdminListPage
    title="Team Members"
    icon={<FiAward className="w-5 h-5" />}
    fetchFn={teamService.adminGetAll}
    deleteFn={teamService.delete}
    createLabel="Add Member"
    columns={[
      { key: 'member', label: 'Member', render: (m) => (
        <div className="flex items-center gap-3">
          {m.avatar
            ? <img src={getImageUrl(m.avatar)} className="w-9 h-9 rounded-full object-cover" />
            : <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">{m.name?.[0]}</div>
          }
          <div>
            <p className="text-sm font-medium text-gray-900">{m.name}</p>
            <p className="text-xs text-gray-400">{m.designation}</p>
          </div>
        </div>
      )},
      { key: 'department', label: 'Department', render: (m) => <span className="text-sm capitalize text-gray-600">{m.department}</span> },
      { key: 'email', label: 'Email', render: (m) => <span className="text-xs text-gray-500">{m.email || '—'}</span> },
      { key: 'status', label: 'Status', render: (m) => <StatusBadge status={m.status} /> },
      { key: 'sortOrder', label: 'Order', render: (m) => <span className="text-sm text-gray-600">{m.sortOrder || 0}</span> },
    ]}
    renderForm={({ item, onClose }) => <TeamForm item={item} onClose={onClose} />}
  />
);

// ── TESTIMONIALS ───────────────────────────────────────────────────

const TestimonialForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'published', rating: 5, category: 'beneficiary' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = appendFormData(data);
    const file = document.getElementById('test-avatar')?.files?.[0];
    if (file) fd.append('avatar', file);
    try {
      if (item) await testimonialService.update(item._id, fd);
      else await testimonialService.create(fd);
      toast.success(item ? 'Updated!' : 'Added!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Input label="Name" required error={errors.name?.message}
        {...register('name', { required: 'Required' })} />
      <Input label="Designation / Role" {...register('designation')} />
      <Textarea label="Testimonial Content" required rows={4}
        error={errors.content?.message}
        {...register('content', { required: 'Required' })} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={[
          { value: 'beneficiary', label: 'Beneficiary' },
          { value: 'donor', label: 'Donor' },
          { value: 'volunteer', label: 'Volunteer' },
          { value: 'partner', label: 'Partner' },
        ]} {...register('category')} />
        <Select label="Rating" options={[5,4,3,2,1].map((r) => ({ value: r, label: `${r} Stars` }))}
          {...register('rating', { valueAsNumber: true })} />
        <Select label="Status" options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]} {...register('status')} />
        <Input label="Sort Order" type="number" min={0} {...register('sortOrder', { valueAsNumber: true })} />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" className="w-4 h-4" {...register('isFeatured')} />
        Featured on Homepage
      </label>
      <FileInput id="test-avatar" label="Profile Photo" currentUrl={item?.avatar} />
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update' : 'Add Testimonial'} />
    </form>
  );
};

export const AdminTestimonials = () => (
  <AdminListPage
    title="Testimonials"
    icon={<FiMessageSquare className="w-5 h-5" />}
    fetchFn={testimonialService.adminGetAll}
    deleteFn={testimonialService.delete}
    createLabel="Add Testimonial"
    columns={[
      { key: 'person', label: 'Person', render: (t) => (
        <div className="flex items-center gap-3">
          {t.avatar
            ? <img src={getImageUrl(t.avatar)} className="w-9 h-9 rounded-full object-cover" />
            : <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold">{t.name?.[0]}</div>
          }
          <div>
            <p className="text-sm font-medium text-gray-900">{t.name}</p>
            <p className="text-xs text-gray-400">{t.designation}</p>
          </div>
        </div>
      )},
      { key: 'content', label: 'Quote', render: (t) => <span className="text-sm text-gray-600 line-clamp-2 max-w-xs">{t.content}</span> },
      { key: 'rating', label: 'Rating', render: (t) => <span className="text-yellow-500">{'★'.repeat(t.rating)}</span> },
      { key: 'category', label: 'Category', render: (t) => <span className="text-sm capitalize text-gray-600">{t.category}</span> },
      { key: 'status', label: 'Status', render: (t) => <StatusBadge status={t.status} /> },
    ]}
    renderForm={({ item, onClose }) => <TestimonialForm item={item} onClose={onClose} />}
  />
);

// ── FAQs ───────────────────────────────────────────────────

const FAQForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'published', category: 'general' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (item) await faqService.update(item._id, data);
      else await faqService.create(data);
      toast.success(item ? 'FAQ updated!' : 'FAQ added!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Textarea label="Question" required rows={2} error={errors.question?.message}
        {...register('question', { required: 'Required' })} />
      <Textarea label="Answer" required rows={4} error={errors.answer?.message}
        {...register('answer', { required: 'Required' })} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={[
          { value: 'general', label: 'General' },
          { value: 'donation', label: 'Donation' },
          { value: 'volunteer', label: 'Volunteer' },
          { value: 'programs', label: 'Programs' },
        ]} {...register('category')} />
        <Select label="Status" options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]} {...register('status')} />
        <Input label="Sort Order" type="number" min={0} {...register('sortOrder', { valueAsNumber: true })} />
      </div>
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update FAQ' : 'Add FAQ'} />
    </form>
  );
};

export const AdminFAQs = () => (
  <AdminListPage
    title="FAQs"
    icon={<FiHelpCircle className="w-5 h-5" />}
    fetchFn={faqService.adminGetAll}
    deleteFn={faqService.delete}
    createLabel="Add FAQ"
    columns={[
      { key: 'question', label: 'Question', render: (f) => <span className="text-sm font-medium text-gray-900 line-clamp-2 max-w-sm">{f.question}</span> },
      { key: 'category', label: 'Category', render: (f) => <span className="text-sm capitalize text-gray-600">{f.category}</span> },
      { key: 'sortOrder', label: 'Order', render: (f) => <span className="text-sm text-gray-600">{f.sortOrder || 0}</span> },
      { key: 'status', label: 'Status', render: (f) => <StatusBadge status={f.status} /> },
    ]}
    renderForm={({ item, onClose }) => <FAQForm item={item} onClose={onClose} />}
  />
);

// ── SUCCESS STORIES ───────────────────────────────────────────────────

const StoryForm = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item || { status: 'published', category: 'education' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = appendFormData(data);
    const file = document.getElementById('story-image')?.files?.[0];
    if (file) fd.append('image', file);
    try {
      if (item) await successStoryService.update(item._id, fd);
      else await successStoryService.create(fd);
      toast.success(item ? 'Story updated!' : 'Story published!');
      onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <Input label="Story Title" required error={errors.title?.message}
        {...register('title', { required: 'Required' })} />
      <Input label="Person's Name" required error={errors.personName?.message}
        {...register('personName', { required: 'Required' })} />
      <Textarea label="Short Excerpt" rows={2} {...register('excerpt')} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Story (HTML) <span className="text-red-500">*</span>
        </label>
        <textarea rows={6} className="input-field resize-y font-mono text-sm"
          {...register('story', { required: 'Required' })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Category" options={[
          { value: 'education', label: 'Education' },
          { value: 'scholarship', label: 'Scholarship' },
          { value: 'health', label: 'Health' },
          { value: 'emergency', label: 'Emergency' },
          { value: 'community', label: 'Community' },
        ]} {...register('category')} />
        <Select label="Status" options={[
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]} {...register('status')} />
        <Input label="Age (optional)" type="number" {...register('age', { valueAsNumber: true })} />
        <Input label="Location" {...register('location')} />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input type="checkbox" className="w-4 h-4" {...register('isFeatured')} />
        Featured Story
      </label>
      <FileInput id="story-image" label="Story Image" currentUrl={item?.image} />
      <SaveButtons onClose={onClose} loading={loading} label={item ? 'Update Story' : 'Publish Story'} />
    </form>
  );
};

export const AdminStories = () => (
  <AdminListPage
    title="Success Stories"
    icon={<FiStar className="w-5 h-5" />}
    fetchFn={successStoryService.adminGetAll}
    deleteFn={successStoryService.delete}
    createLabel="Add Story"
    columns={[
      { key: 'story', label: 'Story', render: (s) => (
        <div className="flex items-center gap-3">
          {s.image && <img src={getImageUrl(s.image)} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{s.title}</p>
            <p className="text-xs text-gray-400">{s.personName}</p>
          </div>
        </div>
      )},
      { key: 'category', label: 'Category', render: (s) => <span className="text-sm capitalize text-gray-600">{s.category}</span> },
      { key: 'isFeatured', label: 'Featured', render: (s) => (
        <span className={`text-xs font-medium ${s.isFeatured ? 'text-primary-600' : 'text-gray-400'}`}>
          {s.isFeatured ? '★ Yes' : 'No'}
        </span>
      )},
      { key: 'status', label: 'Status', render: (s) => <StatusBadge status={s.status} /> },
      { key: 'createdAt', label: 'Created', render: (s) => <span className="text-xs text-gray-500">{formatDate(s.createdAt)}</span> },
    ]}
    renderForm={({ item, onClose }) => <StoryForm item={item} onClose={onClose} />}
  />
);

// ── USERS ───────────────────────────────────────────────────

export const AdminUsers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll({ page, limit: 20 });
      setItems(res.data.data || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const toggleStatus = async (id, isActive) => {
    try {
      await userService.updateStatus(id, !isActive);
      toast.success('Status updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
          <FiUsers className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-sm text-gray-600">{u.email}</span></td>
                  <td className="px-4 py-3"><span className="text-sm capitalize text-gray-600">{u.role}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={u.isActive ? 'active' : 'inactive'} /></td>
                  <td className="px-4 py-3"><span className="text-xs text-gray-400">{formatDate(u.createdAt)}</span></td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u._id, u.isActive)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        u.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
