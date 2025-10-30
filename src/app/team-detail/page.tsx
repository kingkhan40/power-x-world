"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Copy, User, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [referrerMap, setReferrerMap] = useState<{[key: string]: string}>({});

  // آپ کا ID (login سے آئے گا)
  const currentUserId = localStorage.getItem("userId") || "your-admin-user-id";

  /* -----------------------------------------
   * Fetch Sirf Apni Team (My Referrals)
   * ----------------------------------------- */
  const fetchMyTeam = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      const allUsers: User[] = data.users || [];

      // Sirf woh users jinhon ne aap se refer kiya
      const myTeam = allUsers.filter((user: User) => user.referredBy === currentUserId);
      setMyReferrals(myTeam);

      // Referrer map (sirf name ke liye)
      const map: {[key: string]: string} = {};
      allUsers.forEach((u: User) => {
        map[u._id] = u.name;
      });
      setReferrerMap(map);

    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load your team");
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
    toast.success("Copied!");
  };

  const getReferrerName = (id: string | null) => {
    if (!id) return "Direct";
    return referrerMap[id] || "Unknown";
  };

  /* -----------------------------------------
   * Search Filter (Sirf My Team mein)
   * ----------------------------------------- */
  const filtered = myReferrals.filter(user =>
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: status }),
      });

      if (res.ok) {
        toast.success(`User ${status ? "activated" : "deactivated"}`);
        setMyReferrals(prev => prev.map(u => u._id === userId ? { ...u, isActive: status } : u));
      }
    } catch (err) {
      toast.error("Failed");
    }
  };

  /* -----------------------------------------
   * Team Stats
   * ----------------------------------------- */
  const getStats = (u: User) => ({
    total: u.totalTeam || 0,
    active: u.activeUsers || 0,
    level: u.level || 0,
    wallet: u.wallet || 0
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
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Table - UI bilkul wahi */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Referred By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Team Stats</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Level</th>
               
              </tr>
            </thead>

            <tbody className="bg-gray-800 bg-opacity-50 divide-y divide-gray-700">
              {filtered.map((user) => {
                const stats = getStats(user);
                const isMyReferral = user.referredBy === currentUserId;

                return (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-100">
                              {user.name}
                              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                My Referral
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">Wallet: {stats.wallet}</div>
                          </div>
                        </div>
                        <button className="ml-4 p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
                          <ChevronRight size={16} />
                          <span>View Team</span>
                        </button>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">{user.email}</td>

                    {/* Referred By */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <User size={14} className="text-green-400" />
                        <span className="text-sm text-green-300">
                          {getReferrerName(user.referredBy)} (You)
                        </span>
                      </div>
                    </td>

                    {/* Team Stats */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Total:</span>
                          <span className="font-mono text-green-400 font-semibold">{stats.total}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Active:</span>
                          <span className="font-mono text-blue-400 font-semibold">{stats.active}</span>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-sm font-semibold rounded-full border border-purple-500/30">
                        Level {stats.level}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                        user.isActive ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                       
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No users in your team yet</p>
            <p className="text-sm mt-2">Share your referral link to grow your team!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Page;