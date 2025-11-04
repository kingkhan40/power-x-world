'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, ChevronRight, Users, UserCheck, UserX } from 'lucide-react';
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
   * Team Statistics Calculate Karein
   * ----------------------------------------- */
  const teamStats = {
    totalMembers: myReferrals.length,
    activeMembers: myReferrals.filter(user => user.isActive).length,
    inactiveMembers: myReferrals.filter(user => !user.isActive).length
  };

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

        {/* Team Statistics Cards - Exactly like Deposit Page */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Total Team Members Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl"
          >
            {/* Animated Border */}
            <div
              className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
              style={{
                background:
                  'conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)',
                animationDuration: '9000ms',
                zIndex: 0,
              }}
            ></div>
            <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

            {/* Animated Gradient Circles */}
            <div
              className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
              style={{
                background: 'linear-gradient(45deg, #7d9efb, #a83bf8)',
                animationDuration: '9000ms',
                filter: 'blur(12px)',
                opacity: '0.6',
              }}
            ></div>

            <div
              className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
              style={{
                background: 'linear-gradient(135deg, #a83bf8, #7d9efb)',
                animationDuration: '4000ms',
                filter: 'blur(10px)',
                opacity: '0.4',
              }}
            ></div>

            {/* Main Content */}
            <div className="relative z-20 bg-gradient-to-br from-gray-800 to-blue-900 p-6 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-300 text-sm font-semibold mb-2">Total Team Members</h3>
                  <p className="text-3xl font-bold text-white">{teamStats.totalMembers}</p>
                  <p className="text-blue-200 text-sm mt-1">All registered users</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-2xl border border-blue-500/30">
                  <Users className="text-blue-400" size={32} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active/Inactive Members Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:p-5 p-1 rounded-2xl relative overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl"
          >
            {/* Animated Border */}
            <div
              className="absolute -inset-2 rounded-2xl animate-spin opacity-70"
              style={{
                background:
                  'conic-gradient(from 0deg, #51cf66, #7d9efb, #a83bf8, #ff6b6b, #51cf66)',
                animationDuration: '9000ms',
                zIndex: 0,
              }}
            ></div>
            <div className="absolute inset-0.5 rounded-2xl bg-gray-900 z-1"></div>

            {/* Animated Gradient Circles */}
            <div
              className="absolute -top-12 -left-12 w-24 h-24 rounded-full z-10 animate-spin"
              style={{
                background: 'linear-gradient(45deg, #51cf66, #7d9efb)',
                animationDuration: '9000ms',
                filter: 'blur(12px)',
                opacity: '0.6',
              }}
            ></div>

            <div
              className="absolute -bottom-12 -right-12 w-28 h-28 rounded-full z-10 animate-spin"
              style={{
                background: 'linear-gradient(135deg, #7d9efb, #51cf66)',
                animationDuration: '4000ms',
                filter: 'blur(10px)',
                opacity: '0.4',
              }}
            ></div>

            {/* Main Content */}
            <div className="relative z-20 bg-gradient-to-br from-gray-800 to-green-900 p-6 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 text-sm font-semibold">Team Status</h3>
                <div className="flex gap-2">
                  <UserCheck className="text-green-400" size={20} />
                  <UserX className="text-red-400" size={20} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Active Members */}
                <div className="text-center">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <UserCheck className="text-green-400" size={20} />
                    <p className="text-2xl font-bold text-green-400">{teamStats.activeMembers}</p>
                    </div>
                    <p className="text-green-300 text-xs">Active</p>
                  </div>
                </div>

                {/* Inactive Members */}
                <div className="text-center">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                   <div className="flex items-center justify-between">
                    <UserX className="text-red-400 " size={20} />
                    <p className="text-2xl font-bold text-red-400">{teamStats.inactiveMembers}</p>
                    </div>
                    <p className="text-red-300 text-xs">Inactive</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Grid Layout - Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((user) => {
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
                <div className="mb-3 flex gap-2 items-center">
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm truncate">{user.email}</p>
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