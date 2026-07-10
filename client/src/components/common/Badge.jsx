import { capitalize } from '../../utils/helpers';

const colorMap = {
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  secondary: 'bg-gray-50 text-gray-600 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  accent: 'bg-orange-50 text-orange-700 border-orange-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
};

const statusMap = {
  published: 'success',
  ongoing: 'primary',
  completed: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  new: 'info',
  read: 'secondary',
  replied: 'success',
  upcoming: 'accent',
  cancelled: 'danger',
  draft: 'warning',
  archived: 'secondary',
  active: 'success',
  inactive: 'secondary',
  planning: 'info',
  hidden: 'secondary',
  failed: 'danger',
  refunded: 'warning',
};

const Badge = ({ children, color = 'primary', className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorMap[color] || colorMap.secondary} ${className}`}>
    {children}
  </span>
);

export const StatusBadge = ({ status }) => {
  const color = statusMap[status] || 'secondary';
  return <Badge color={color}>{capitalize(status)}</Badge>;
};

export const CategoryBadge = ({ category }) => (
  <Badge color="primary">{capitalize(category)}</Badge>
);

export default Badge;
