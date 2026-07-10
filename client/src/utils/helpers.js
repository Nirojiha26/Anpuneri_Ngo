import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date
export const formatDate = (date, pattern = 'MMM d, yyyy') => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern);
  } catch { return ''; }
};

// Relative time
export const timeAgo = (date) => {
  if (!date) return '';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch { return ''; }
};

// Truncate text
export const truncate = (text, length = 120) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length).trim() + '...' : text;
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount || 0);
};

// Format number with commas
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num || 0);
};

// Get image URL (handles both relative and absolute)
export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${path}`;
};

// Get initials from name
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Progress percentage
export const getProgress = (raised, target) => {
  if (!target) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
};

// Status badge color map
export const getStatusColor = (status) => {
  const map = {
    published: 'success',
    ongoing: 'primary',
    completed: 'secondary',
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    new: 'primary',
    read: 'secondary',
    replied: 'success',
    upcoming: 'accent',
    cancelled: 'danger',
    draft: 'warning',
    archived: 'secondary',
    active: 'success',
    inactive: 'secondary',
  };
  return map[status] || 'secondary';
};

// Build query string from object
export const buildQueryString = (params) => {
  const filtered = Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null);
  return new URLSearchParams(Object.fromEntries(filtered)).toString();
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Strip HTML tags
export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// Validate email
export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// Scroll to element
export const scrollToElement = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
