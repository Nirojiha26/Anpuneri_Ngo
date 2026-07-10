import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  FiFolder, FiUsers, FiDollarSign, FiMail, FiCalendar,
  FiTrendingUp, FiArrowRight, FiHeart,
} from 'react-icons/fi';
import { dashboardService } from '../../services/apiServices';
import { Spinner } from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Badge';

const StatCard = ({ icon, label, value, trend, color = 'primary', href }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="card p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 font-heading mb-1">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
    {href && (
      <Link to={href} className="text-xs font-semibold text-primary-600 mt-3 flex items-center gap-1 hover:gap-2 transition-all">
        View all <FiArrowRight className="w-3 h-3" />
      </Link>
    )}
  </motion.div>
);

const COLORS = ['#1565C0', '#2E7D32', '#E65100', '#6366f1', '#ec4899'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStats().then((res) => setStats(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96"><Spinner size="lg" /></div>
  );

  const monthlyData = stats?.monthlyDonations || [];
  const donationByPurpose = stats?.donationsByPurpose || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back. Here's what's happening today.</p>
        </div>
        <Link to="/" target="_blank" className="btn-outline text-sm px-4 py-2">
          View Site
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiFolder className="w-5 h-5" />} label="Total Projects" value={stats?.counts?.projects || 0} color="primary" href="/admin/projects" />
        <StatCard icon={<FiUsers className="w-5 h-5" />} label="Volunteers" value={stats?.counts?.volunteers || 0} color="secondary" href="/admin/volunteers" />
        <StatCard icon={<FiDollarSign className="w-5 h-5" />} label="Total Raised" value={formatCurrency(stats?.counts?.totalDonations || 0)} color="accent" href="/admin/donations" />
        <StatCard icon={<FiMail className="w-5 h-5" />} label="New Messages" value={stats?.counts?.contacts || 0} color="primary" href="/admin/contacts" />
        <StatCard icon={<FiCalendar className="w-5 h-5" />} label="Events" value={stats?.counts?.events || 0} color="secondary" href="/admin/events" />
        <StatCard icon={<FiUsers className="w-5 h-5" />} label="Team Members" value={stats?.counts?.teamMembers || 0} color="primary" href="/admin/team" />
        <StatCard icon={<FiHeart className="w-5 h-5" />} label="Total Donations" value={stats?.counts?.donations || 0} color="accent" href="/admin/donations" />
        <StatCard icon={<FiTrendingUp className="w-5 h-5" />} label="News Articles" value={stats?.counts?.news || 0} color="secondary" href="/admin/news" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Donations */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-6">Monthly Donations (6 months)</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1565C0" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(v) => [formatCurrency(v), 'Donations']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#1565C0" strokeWidth={2} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No donation data yet</div>
          )}
        </div>

        {/* Donation by Purpose */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Donations by Purpose</h3>
          {donationByPurpose.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={donationByPurpose} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="total" nameKey="_id" paddingAngle={3}>
                  {donationByPurpose.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12 }} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Recent Donations</h3>
            <Link to="/admin/donations" className="text-xs text-primary-600 font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(stats?.recentDonations || []).slice(0, 5).map((d) => (
              <div key={d._id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                  <FiDollarSign className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {d.isAnonymous ? 'Anonymous' : d.donorName}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(d.createdAt)}</p>
                </div>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(d.amount)}</span>
              </div>
            ))}
            {!stats?.recentDonations?.length && (
              <p className="text-sm text-gray-400 text-center py-4">No donations yet</p>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-gray-900">Recent Messages</h3>
            <Link to="/admin/contacts" className="text-xs text-primary-600 font-medium hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {(stats?.recentContacts || []).slice(0, 5).map((c) => (
              <div key={c._id} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-gray-500">
                  {c.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 truncate">{c.subject}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
            {!stats?.recentContacts?.length && (
              <p className="text-sm text-gray-400 text-center py-4">No messages yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
