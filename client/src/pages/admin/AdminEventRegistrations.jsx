import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiUsers } from 'react-icons/fi';
import { eventService } from '../../services/apiServices';
import { AdminListPage } from '../../components/admin/AdminListPage';
import { StatusBadge } from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';

export const AdminEventRegistrations = () => {
  return (
    <AdminListPage
      title="Event Registrations"
      icon={<FiUsers className="w-5 h-5" />}
      fetchFn={eventService.adminGetRegistrations}
      createLabel={null} // Read only
      columns={[
        { key: 'attendee', label: 'Attendee', render: (r) => (
          <div>
            <p className="text-sm font-medium text-gray-900">{r.name}</p>
            <p className="text-xs text-gray-500">{r.email}</p>
            {r.phone && <p className="text-xs text-gray-500">{r.phone}</p>}
          </div>
        )},
        { key: 'event', label: 'Event', render: (r) => (
          <div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{r.event?.title}</p>
            <p className="text-xs text-gray-500">{r.event?.startDate ? formatDate(r.event.startDate) : ''}</p>
          </div>
        )},
        { key: 'tickets', label: 'Tickets', render: (r) => <span className="text-sm font-medium text-gray-900">{r.tickets}</span> },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status || 'pending'} /> },
        { key: 'date', label: 'Registration Date', render: (r) => <span className="text-sm text-gray-600">{formatDate(r.createdAt)}</span> },
      ]}
      renderForm={() => null} // Read only
      hideActions={true} // Read only
    />
  );
};

export default AdminEventRegistrations;
