import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/Loading';
import Pagination from '../../components/common/Pagination';
import SearchBox from '../../components/common/SearchBox';
import { formatDate } from '../../utils/helpers';

// Reusable admin list page
export const AdminListPage = ({
  title,
  icon,
  fetchFn,
  deleteFn,
  searchable = true,
  columns = [],
  renderForm,
  createLabel = 'Add New',
}) => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetchFn({ page, limit: 10, search });
      setItems(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [page, search]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteFn(deleteModal.item._id);
      toast.success('Deleted successfully');
      setDeleteModal({ open: false, item: null });
      fetchItems();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditItem(null); fetchItems(); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <FiPlus className="w-4 h-4" /> {createLabel}
        </button>
      </div>

      {/* Filters */}
      {searchable && (
        <SearchBox value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}...`} className="max-w-xs" />
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton rows={8} cols={columns.length} /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiSearch className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No {title.toLowerCase()} found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(item) : (
                          <span className="text-sm text-gray-700">{item[col.key] || '—'}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, item })}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && pagination && (
        <Pagination pagination={pagination} onPageChange={setPage} />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? `Edit ${title.replace(/s$/, '')}` : createLabel}
        size="lg"
      >
        {renderForm && renderForm({ item: editItem, onClose: closeModal })}
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminListPage;
