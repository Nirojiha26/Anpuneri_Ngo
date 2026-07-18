import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import {
  FiFolder, FiUsers, FiDollarSign, FiMail, FiCalendar,
  FiTrendingUp, FiArrowRight, FiHeart, FiClock
} from 'react-icons/fi';
import { dashboardService } from '../../services/apiServices';
import { Spinner } from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { StatusBadge } from '../../components/common/Badge';

const StatCard = ({ label, value, trend, bgColor }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl p-5 flex flex-col justify-between h-[110px] ${bgColor}`}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-800">{label}</p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        {trend !== undefined && (
          <div className="flex items-center text-xs font-semibold text-gray-700 bg-white/60 px-2 py-1 rounded-full">
            {trend >= 0 ? '+' : ''}{trend}%
            {trend >= 0 ? <FiTrendingUp className="ml-1 w-3 h-3 text-green-600" /> : <FiTrendingUp className="ml-1 w-3 h-3 text-red-600 transform rotate-180" />}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const COLORS = ['#818cf8', '#fbbf24', '#34d399', '#f472b6', '#38bdf8'];

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
      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left/Main Column */}
        <div className="lg:col-span-9 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Raised" value={formatCurrency(stats?.counts?.totalDonations || 0)} trend={11.01} bgColor="bg-indigo-100/50" />
            <StatCard label="Projects" value={stats?.counts?.projects || 0} trend={-0.03} bgColor="bg-orange-100/50" />
            <StatCard label="Volunteers" value={stats?.counts?.volunteers || 0} trend={15.03} bgColor="bg-blue-100/50" />
            <StatCard label="New Messages" value={stats?.counts?.contacts || 0} trend={6.08} bgColor="bg-emerald-100/50" />
          </div>

          {/* Large Area Chart */}
          <div className="card p-6 border border-gray-100 shadow-sm rounded-[24px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <h3 className="font-bold text-gray-900">Total Donations</h3>
                <div className="hidden md:flex gap-4 text-xs font-medium text-gray-400">
                  <span className="hover:text-gray-900 cursor-pointer transition-colors">Total Projects</span>
                  <span className="hover:text-gray-900 cursor-pointer transition-colors">Operating Status</span>
                </div>
              </div>
              <div className="flex gap-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> This year</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Last year</div>
              </div>
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(v) => [formatCurrency(v), 'Donations']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">No donation data yet</div>
            )}
          </div>

          {/* Bottom 2 Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6 border border-gray-100 shadow-sm rounded-[24px]">
              <h3 className="font-bold text-gray-900 mb-6">Donations Activity</h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                       {monthlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-400">No data yet</div>
              )}
            </div>

            <div className="card p-6 border border-gray-100 shadow-sm rounded-[24px]">
              <h3 className="font-bold text-gray-900 mb-6">Donations by Purpose</h3>
              {donationByPurpose.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={donationByPurpose} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="total" nameKey="_id" paddingAngle={2}>
                      {donationByPurpose.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-400">No data yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent Messages / Notifications */}
          <div className="card p-6 border border-gray-100 shadow-sm rounded-[24px] h-full">
            <h3 className="font-bold text-gray-900 mb-5">Recent Messages</h3>
            <div className="space-y-5">
              {(stats?.recentContacts || []).slice(0, 5).map((c) => (
                <div key={c._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-gray-500 mt-1">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{c.subject}</p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <FiClock className="w-3 h-3" /> {formatDate(c.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {!stats?.recentContacts?.length && (
                <p className="text-sm text-gray-400 text-center py-4">No messages yet</p>
              )}
            </div>

            <div className="mt-8">
               <h3 className="font-bold text-gray-900 mb-5">Recent Donations</h3>
               <div className="space-y-5">
                 {(stats?.recentDonations || []).slice(0, 5).map((d) => (
                   <div key={d._id} className="flex items-start gap-3">
                     <img src={`https://ui-avatars.com/api/?name=${d.isAnonymous ? 'A' : d.donorName}&background=random&color=fff&size=32`} alt="Avatar" className="w-8 h-8 rounded-full shrink-0 mt-1" />
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-gray-900 leading-tight">
                         {d.isAnonymous ? 'Anonymous' : d.donorName}
                       </p>
                       <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                         <FiDollarSign className="w-3 h-3" /> {formatCurrency(d.amount)}
                       </p>
                     </div>
                   </div>
                 ))}
                 {!stats?.recentDonations?.length && (
                   <p className="text-sm text-gray-400 text-center py-4">No donations yet</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
