"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Types
interface Withdrawal {
  id: string;
  user: string;
  amount: number;
  method: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  account: string;
}

const withdrawalData: Withdrawal[] = [
  { id: '1', user: 'John Doe', amount: 500, method: 'Bank Transfer', status: 'Pending', date: '2024-01-15', account: '****1234' },
  { id: '2', user: 'Jane Smith', amount: 1200, method: 'PayPal', status: 'Approved', date: '2024-01-14', account: 'jane@paypal' },
  { id: '3', user: 'Bob Johnson', amount: 300, method: 'Crypto', status: 'Rejected', date: '2024-01-13', account: '0x742...d35' },
  { id: '4', user: 'Alice Brown', amount: 750, method: 'Bank Transfer', status: 'Pending', date: '2024-01-12', account: '****5678' },
  { id: '5', user: 'Charlie Wilson', amount: 1500, method: 'PayPal', status: 'Approved', date: '2024-01-11', account: 'charlie@paypal' },
  { id: '6', user: 'Diana Lee', amount: 200, method: 'Crypto', status: 'Approved', date: '2024-01-10', account: '0x8a3...f92' },
];

const monthlyData = [
  { month: 'Jan', withdrawals: 45, amount: 12500 },
  { month: 'Feb', withdrawals: 52, amount: 14200 },
  { month: 'Mar', withdrawals: 48, amount: 13800 },
  { month: 'Apr', withdrawals: 61, amount: 16800 },
  { month: 'May', withdrawals: 55, amount: 15200 },
  { month: 'Jun', withdrawals: 68, amount: 18900 },
];

const methodData = [
  { name: 'Bank Transfer', value: 45 },
  { name: 'PayPal', value: 30 },
  { name: 'Crypto', value: 25 },
];

const statusData = [
  { name: 'Approved', value: 65 },
  { name: 'Pending', value: 20 },
  { name: 'Rejected', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const WithdrawalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);

  const filteredWithdrawals = withdrawalData.filter(withdrawal => 
    withdrawal.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'All' || withdrawal.status === statusFilter)
  );

  const stats = {
    totalWithdrawals: withdrawalData.length,
    pending: withdrawalData.filter(w => w.status === 'Pending').length,
    approved: withdrawalData.filter(w => w.status === 'Approved').length,
    totalAmount: withdrawalData.reduce((sum, w) => sum + w.amount, 0),
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Withdrawals Management</h1>
          <p className="text-gray-400">Manage and track all withdrawal requests</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Withdrawals</p>
                <p className="text-2xl font-bold text-gray-100">{stats.totalWithdrawals}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-100">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-100">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold text-gray-100">${stats.totalAmount}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Withdrawals Chart */}
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Monthly Withdrawals</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                      borderColor: '#4B5563',
                      color: '#F3F4F6'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="withdrawals" fill="#8884d8" name="Number of Withdrawals" />
                  <Bar dataKey="amount" fill="#82ca9d" name="Total Amount ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Method Distribution */}
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Withdrawal Methods</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                      borderColor: '#4B5563',
                      color: '#F3F4F6'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Withdrawals Table */}
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-gray-100">Withdrawal Requests</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">User</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Method</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-gray-100 font-medium">{withdrawal.user}</p>
                        <p className="text-gray-400 text-sm">{withdrawal.account}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-100 font-medium">${withdrawal.amount}</td>
                    <td className="py-4 px-4 text-gray-300">{withdrawal.method}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(withdrawal.status)}`}>
                        {getStatusIcon(withdrawal.status)}
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{withdrawal.date}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {withdrawal.status === 'Pending' && (
                          <>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              Approve
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                        <button className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WithdrawalsPage;