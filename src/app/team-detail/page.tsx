'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Copy,
  User,
  ChevronRight,
  Users,
  Wallet,
  Activity,
  Star,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  referredBy: string | null;
  referralCode: string;
  createdAt: string;
  wallet?: number;
  level?: number;
  totalTeam?: number;
  activeUsers?: number;
  directBusiness?: number;
}

const Page = () => {
  const [myReferrals, setMyReferrals] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [referrerMap, setReferrerMap] = useState<{ [key: string]: string }>({});

  // آپ کا ID (login سے آئے گا)
  const currentUserId = localStorage.getItem('userId') || 'your-admin-user-id';

  /* -----------------------------------------
   * Fetch Sirf Apni Team (My Referrals)
   * ----------------------------------------- */
  const fetchMyTeam = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      const allUsers: User[] = data.users || [];

      // Sirf woh users jinhon ne aap se refer kiya
      const myTeam = allUsers.filter(
        (user: User) => user.referredBy === currentUserId
      );
      setMyReferrals(myTeam);

      // Referrer map (sirf name ke liye)
      const map: { [key: string]: string } = {};
      allUsers.forEach((u: User) => {
        map[u._id] = u.name;
      });
      setReferrerMap(map);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load your team');
    }
  };

  useEffect(() => {
    fetchMyTeam();
  }, [currentUserId]);

  /* -----------------------------------------
   * Copy Code
   * ----------------------------------------- */
  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied!');
  };

  const getReferrerName = (id: string | null) => {
    if (!id) return 'Direct';
    return referrerMap[id] || 'Unknown';
  };

  /* -----------------------------------------
   * Search Filter (Sirf My Team mein)
   * ----------------------------------------- */
  const filtered = myReferrals.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* -----------------------------------------
   * Toggle Status (Optional - agar chahiye to)
   * ----------------------------------------- */
  const toggleUserStatus = async (userId: string, status: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: status }),
      });

      if (res.ok) {
        toast.success(`User ${status ? 'activated' : 'deactivated'}`);
        setMyReferrals((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: status } : u))
        );
      }
    } catch (err) {
      toast.error('Failed');
    }
  };

  /* -----------------------------------------
   * Team Stats
   * ----------------------------------------- */
  const getStats = (u: User) => ({
    total: u.totalTeam || 0,
    active: u.activeUsers || 0,
    level: u.level || 0,
    wallet: u.wallet || 0,
  });

  return (
    <div className="min-h-screen p-4">
      <motion.div
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-100">My Team Only</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search in my team..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Grid Layout - Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((user) => {
            const stats = getStats(user);

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
              >
                {/* User Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">
                        {user.name}
                      </h3>
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        My Referral
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive
                        ? 'bg-green-800 text-green-100'
                        : 'bg-red-800 text-red-100'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <p className="text-gray-400 text-xs mb-1">Email</p>
                  <p className="text-white text-sm truncate">{user.email}</p>
                </div>

                {/* Referral Info */}
                <div className="mb-3">
                  <p className="text-gray-400 text-xs mb-1">Referred By</p>
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-green-400" />
                    <span className="text-green-300 text-sm">You</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Users size={16} className="text-blue-400  mb-1" />
                      <p className="text-white font-bold text-sm">
                        {stats.total}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">Total Team</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Activity size={16} className="text-green-400 mb-1" />
                      <p className="text-white font-bold text-sm">
                        {stats.active}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">Active</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Star size={16} className="text-purple-400 mb-1" />
                      <p className="text-white font-bold text-sm">
                        Lvl {stats.level}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">Level</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Wallet size={16} className="text-yellow-400  mb-1" />
                      <p className="text-white font-bold text-sm">
                        {stats.wallet}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs">Wallet</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="mb-4">
                  <p className="text-gray-400 text-xs mb-1">Referral Code</p>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                    <code className="text-green-400 text-sm font-mono">
                      {user.referralCode}
                    </code>
                    <button
                      onClick={() => copyReferralCode(user.referralCode)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleUserStatus(user._id, !user.isActive)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      user.isActive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg px-3 py-2 text-xs font-semibold transition-all">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
              <Users size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-lg mb-2">No users in your team yet</p>
              <p className="text-sm mb-4">
                Share your referral link to grow your team!
              </p>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                Share Referral Link
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Page;
