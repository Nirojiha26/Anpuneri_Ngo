import { useState, useEffect } from 'react';
import { FiDollarSign, FiUsers, FiMail, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { donationService, volunteerService, contactService } from '../../services/apiServices';
import { StatusBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

// Reusable read-only admin list
const AdminReadList = ({ title, icon, fetchFn, columns, statusOptions, updateStatusFn, getItemName, renderDetails }) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [viewModal, setViewModal] = useState({ open: false, item: null });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetchFn({ page, limit: 10 });
      setItems(res.data.data || []);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [page]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatusFn(id, { status });
      toast.success('Status updated');
      fetchItems();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={8} cols={columns.length} /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No {title.toLowerCase()} found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col.label}</th>
                  ))}
                  {statusOptions && <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(item) : <span className="text-sm text-gray-700">{item[col.key] || '—'}</span>}
                      </td>
                    ))}
                    {statusOptions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setViewModal({ open: true, item })} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <FiEye className="w-4 h-4" />
                          </button>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1"
                          >
                            {statusOptions.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />

      <Modal isOpen={viewModal.open} onClose={() => setViewModal({ open: false, item: null })} title={getItemName ? getItemName(viewModal.item) : 'Details'} size="md">
        {viewModal.item && (
          <div className="p-6">
            {renderDetails ? renderDetails(viewModal.item) : (
              <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                {JSON.stringify(viewModal.item, null, 2)}
              </pre>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// ── Donations ────────────────────────────────────────────────
export const AdminDonations = () => (
  <AdminReadList
    title="Donations"
    icon={<FiDollarSign className="w-5 h-5" />}
    fetchFn={donationService.adminGetAll}
    updateStatusFn={(id, data) => donationService.updateStatus(id, data)}
    getItemName={(d) => d?.donorName || 'Donation'}
    statusOptions={['completed', 'pending', 'failed', 'refunded']}
    renderDetails={(d) => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Donor</p>
            <p className="text-sm font-medium text-gray-900">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
          </div>
          {!d.isAnonymous && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-medium text-gray-900">{d.donorEmail}</p>
            </div>
          )}
          {d.donorPhone && !d.isAnonymous && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-medium text-gray-900">{d.donorPhone}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Amount</p>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(d.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Purpose</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{d.purpose}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Transaction ID</p>
            <p className="text-sm font-medium text-gray-900">{d.transactionId || 'N/A'}</p>
          </div>
        </div>
        {d.message && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Encouragement Message</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{d.message}</p>
          </div>
        )}
      </div>
    )}
    columns={[
      { key: 'donor', label: 'Donor', render: (d) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{d.isAnonymous ? 'Anonymous' : d.donorName}</p>
          {!d.isAnonymous && <p className="text-xs text-gray-400">{d.donorEmail}</p>}
        </div>
      )},
      { key: 'amount', label: 'Amount', render: (d) => <span className="font-bold text-gray-900">{formatCurrency(d.amount)}</span> },
      { key: 'purpose', label: 'Purpose', render: (d) => <span className="text-sm capitalize text-gray-600">{d.purpose}</span> },
      { key: 'status', label: 'Status', render: (d) => <StatusBadge status={d.status} /> },
      { key: 'createdAt', label: 'Date', render: (d) => <span className="text-xs text-gray-500">{formatDate(d.createdAt)}</span> },
    ]}
  />
);

// ── Volunteers ────────────────────────────────────────────────
export const AdminVolunteers = () => (
  <AdminReadList
    title="Volunteers"
    icon={<FiUsers className="w-5 h-5" />}
    fetchFn={volunteerService.adminGetAll}
    updateStatusFn={(id, data) => volunteerService.update(id, data)}
    getItemName={(v) => v?.name || 'Volunteer'}
    statusOptions={['pending', 'approved', 'rejected']}
    renderDetails={(v) => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Applicant Name</p>
            <p className="text-sm font-medium text-gray-900">{v.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-medium text-gray-900">{v.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Phone Number</p>
            <p className="text-sm font-medium text-gray-900">{v.phone || '—'}</p>
          </div>
        </div>
        {v.motivation && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Motivation & Questions</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{v.motivation}</p>
          </div>
        )}
      </div>
    )}
    columns={[
      { key: 'name', label: 'Name', render: (v) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{v.name}</p>
          <p className="text-xs text-gray-400">{v.email}</p>
        </div>
      )},
      { key: 'phone', label: 'Phone', render: (v) => <span className="text-sm text-gray-600">{v.phone || '—'}</span> },
      { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v.status} /> },
      { key: 'createdAt', label: 'Applied', render: (v) => <span className="text-xs text-gray-500">{formatDate(v.createdAt)}</span> },
    ]}
  />
);

// ── Contacts ────────────────────────────────────────────────
export const AdminContacts = () => (
  <AdminReadList
    title="Messages"
    icon={<FiMail className="w-5 h-5" />}
    fetchFn={contactService.adminGetAll}
    updateStatusFn={(id, data) => contactService.updateStatus(id, data)}
    getItemName={(c) => c?.subject || 'Message'}
    statusOptions={['new', 'read', 'replied', 'archived']}
    renderDetails={(c) => (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">From</p>
            <p className="text-sm font-medium text-gray-900">{c.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
            <p className="text-sm font-medium text-gray-900">{c.email}</p>
          </div>
          {c.phone && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-medium text-gray-900">{c.phone}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Category</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{c.category}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Subject</p>
          <p className="text-sm font-semibold text-gray-900">{c.subject}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Message</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.message}</p>
        </div>
      </div>
    )}
    columns={[
      { key: 'name', label: 'From', render: (c) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{c.name}</p>
          <p className="text-xs text-gray-400">{c.email}</p>
        </div>
      )},
      { key: 'subject', label: 'Subject', render: (c) => <span className="text-sm text-gray-700 line-clamp-1">{c.subject}</span> },
      { key: 'category', label: 'Category', render: (c) => <span className="text-sm capitalize text-gray-600">{c.category}</span> },
      { key: 'status', label: 'Status', render: (c) => <StatusBadge status={c.status} /> },
      { key: 'createdAt', label: 'Received', render: (c) => <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span> },
    ]}
  />
);
