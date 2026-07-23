import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  FiFolder,
  FiUsers,
  FiDollarSign,
  FiMail,
  FiCalendar,
  FiArrowRight,
  FiHeart,
  FiClock,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { dashboardService } from "../../services/apiServices";
import { Spinner } from "../../components/common/Loading";
import { formatCurrency, formatDate } from "../../utils/helpers";

const StatCard = ({ label, value, bgGradient, link, subLabel }) => (
  <Link to={link} className="block">
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-2xl p-4 flex flex-col justify-between h-[105px] ${bgGradient} text-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] overflow-hidden group`}
    >
      {/* Decorative circle */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-110 transition-transform duration-500 blur-[2px]"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
          {subLabel}
        </p>
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
      </div>
      
      <div className="relative z-10 mt-auto">
        <h3 className="text-lg md:text-xl font-bold font-heading mb-1.5 leading-tight truncate">{label}</h3>
        <div className="inline-block px-2.5 py-0.5 bg-white/15 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
          <p className="text-[10px] md:text-xs font-bold text-white drop-shadow-sm">{value}</p>
        </div>
      </div>
    </motion.div>
  </Link>
);

const COLORS = ["#818cf8", "#fbbf24", "#34d399", "#f472b6", "#38bdf8"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );

  const dashboardStats = stats?.stats || {};
  const recentContacts = stats?.recentActivities?.contacts || [];
  const recentDonations = stats?.recentActivities?.donations || [];
  const monthlyData = (stats?.charts?.monthlyDonations || []).map((item) => ({
    month: item._id?.month
      ? new Date(item._id.year, item._id.month - 1, 1).toLocaleString(
          "default",
          { month: "short" },
        )
      : "N/A",
    amount: item.total || 0,
    count: item.count || 0,
  }));
  const donationByPurpose = [];

  return (
    <div className="space-y-6">
      {/* Stat Cards - 5 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Raised"
          value={formatCurrency(dashboardStats?.donations?.totalRaised || 0)}
          bgGradient="bg-gradient-to-br from-[#25244E] to-[#393976]"
          subLabel="DONATIONS"
          link="/admin/donations"
        />
        <StatCard
          label="Projects"
          value={`${dashboardStats?.projects?.total || 0} Active`}
          bgGradient="bg-gradient-to-br from-[#7B52FF] to-[#4C65FF]"
          subLabel="INITIATIVES"
          link="/admin/projects"
        />
        <StatCard
          label="Volunteers"
          value={`${dashboardStats?.volunteers?.total || 0} Registered`}
          bgGradient="bg-gradient-to-br from-[#33B2B2] to-[#4AC8C8]"
          subLabel="COMMUNITY"
          link="/admin/volunteers"
        />
        <StatCard
          label="Events"
          value={`${dashboardStats?.events?.total || 0} Scheduled`}
          bgGradient="bg-gradient-to-br from-[#F24C4C] to-[#F58C4A]"
          subLabel="UPCOMING"
          link="/admin/events"
        />
        <StatCard
          label="Messages"
          value={`${dashboardStats?.contacts?.total || 0} Total`}
          bgGradient="bg-gradient-to-br from-[#2D2A5D] to-[#403B75]"
          subLabel="INBOX"
          link="/admin/contacts"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-9 space-y-6">
          {/* Area Chart */}
          <div className="card p-6 border border-gray-100 shadow-sm rounded-2xl bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Total Donations</h3>
              <div className="flex gap-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>{" "}
                  This year
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>{" "}
                  Last year
                </div>
              </div>
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorAmount"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#4f46e5"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(v) => [formatCurrency(v), "Donations"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No donation data yet
              </div>
            )}
          </div>

          {/* Bottom Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6 border border-gray-100 shadow-sm rounded-2xl bg-white">
              <h3 className="font-bold text-gray-900 mb-6">
                Donations Activity
              </h3>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                    />
                    <Tooltip
                      cursor={{ fill: "#f3f4f6" }}
                      contentStyle={{ borderRadius: "12px", border: "none" }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                      {monthlyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-400">
                  No data yet
                </div>
              )}
            </div>

            <div className="card p-6 border border-gray-100 shadow-sm rounded-2xl bg-white">
              <h3 className="font-bold text-gray-900 mb-6">
                Donations by Purpose
              </h3>
              {donationByPurpose.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donationByPurpose}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      dataKey="total"
                      nameKey="_id"
                      paddingAngle={2}
                    >
                      {donationByPurpose.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => formatCurrency(v)}
                      contentStyle={{ borderRadius: "12px", border: "none" }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-400">
                  No data yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6 border border-gray-100 shadow-sm rounded-2xl bg-white h-full">
            <h3 className="font-bold text-gray-900 mb-5">Recent Messages</h3>
            <div className="space-y-5">
              {recentContacts.slice(0, 5).map((c) => (
                <div key={c._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-gray-500 mt-1">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {c.subject}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <FiClock className="w-3 h-3" /> {formatDate(c.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {!recentContacts.length && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No messages yet
                </p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-bold text-gray-900 mb-5">Recent Donations</h3>
              <div className="space-y-5">
                {recentDonations.slice(0, 5).map((d) => (
                  <div key={d._id} className="flex items-start gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${d.isAnonymous ? "A" : d.donorName}&background=random&color=fff&size=32`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full shrink-0 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-tight">
                        {d.isAnonymous ? "Anonymous" : d.donorName}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <FiDollarSign className="w-3 h-3" />{" "}
                        {formatCurrency(d.amount)}
                      </p>
                    </div>
                  </div>
                ))}
                {!recentDonations.length && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No donations yet
                  </p>
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
