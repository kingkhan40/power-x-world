"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Copy, User, Users, Award } from "lucide-react";
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
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [referrerMap, setReferrerMap] = useState<{[key: string]: string}>({});
  const [myReferrals, setMyReferrals] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "myReferrals">("all");

  // Your admin user ID - you might want to get this from auth context
  const adminUserId = "your-admin-user-id"; // Replace with actual admin ID

  /* -----------------------------------------
   * ✅ Fetch All Users
   * ----------------------------------------- */
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
      
      // Create a map of referrer IDs to names
      const referrerData: {[key: string]: string} = {};
      data.users.forEach((user: User) => {
        referrerData[user._id] = user.name;
      });
      setReferrerMap(referrerData);

      // Filter users that you referred (where referredBy matches your admin ID)
      const myReferredUsers = data.users.filter((user: User) => 
        user.referredBy === adminUserId
      );
      setMyReferrals(myReferredUsers);

    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* -----------------------------------------
   * 📋 Copy Referral Code to Clipboard
   * ----------------------------------------- */
  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  /* -----------------------------------------
   * 🔍 Get Referrer Name
   * ----------------------------------------- */
  const getReferrerName = (referredById: string | null) => {
    if (!referredById) return "Direct Signup";
    return referrerMap[referredById] || "Unknown User";
  };

  /* -----------------------------------------
   * 🔍 Search Filter
   * ----------------------------------------- */
  const filteredUsers = activeTab === "all" 
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.referralCode && user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.referredBy && getReferrerName(user.referredBy).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : myReferrals.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

  /* -----------------------------------------
   * ⚙️ Toggle User Active/Inactive
   * ----------------------------------------- */
  const toggleUserStatus = async (userId: string, newStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        toast.success(
          `User ${newStatus ? "activated" : "deactivated"} successfully`
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isActive: newStatus } : user
          )
        );

        setMyReferrals((prevReferrals) =>
          prevReferrals.map((user) =>
            user._id === userId ? { ...user, isActive: newStatus } : user
          )
        );
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  /* -----------------------------------------
   * 📊 Stats Calculation
   * ----------------------------------------- */
  const totalMyReferrals = myReferrals.length;
  const activeMyReferrals = myReferrals.filter(user => user.isActive).length;

  return (
    <div className="min-h-screen p-4">
      <motion.div
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700 max-w-7xl mx-auto" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* 🔎 Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-100">Users Management</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* 📊 Stats & Tabs */}
        <div className="mb-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="text-blue-400" size={24} />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">My Referrals</p>
                  <p className="text-2xl font-bold text-green-400">{totalMyReferrals}</p>
                </div>
                <Award className="text-green-400" size={24} />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Referrals</p>
                  <p className="text-2xl font-bold text-cyan-400">{activeMyReferrals}</p>
                </div>
                <User className="text-cyan-400" size={24} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-4 font-medium transition-colors duration-200 ${
                activeTab === "all"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("myReferrals")}
              className={`pb-2 px-4 font-medium transition-colors duration-200 ${
                activeTab === "myReferrals"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              My Referrals ({totalMyReferrals})
            </button>
          </div>
        </div>

        {/* 🧾 Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Referred By
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-gray-800 bg-opacity-50 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${
                          user.referredBy === adminUserId 
                            ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                            : "bg-gradient-to-r from-purple-500 to-blue-600"
                        }`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">
                          {user.name}
                          {user.referredBy === adminUserId && (
                            <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                              My Referral
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {user._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {user.email}
                  </td>

                  {/* 👥 Referred By */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.referredBy ? (
                        <>
                          <User size={14} className={
                            user.referredBy === adminUserId 
                              ? "text-green-400" 
                              : "text-blue-400"
                          } />
                          <span className={`text-sm ${
                            user.referredBy === adminUserId 
                              ? "text-green-300" 
                              : "text-gray-300"
                          }`}>
                            {getReferrerName(user.referredBy)}
                            {user.referredBy === adminUserId && " (You)"}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Direct Signup</span>
                      )}
                    </div>
                  </td>

                  {/* 📋 Referral Code */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-cyan-300 bg-cyan-900 bg-opacity-30 px-2 py-1 rounded">
                        {user.referralCode}
                      </span>
                      <button
                        onClick={() => copyReferralCode(user.referralCode)}
                        className="text-gray-400 hover:text-cyan-300 transition-colors duration-200 p-1 hover:bg-cyan-900 hover:bg-opacity-20 rounded"
                        title="Copy referral code"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>

                  {/* 📅 Join Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ⚙️ Action Buttons */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleUserStatus(user._id, false)}
                        disabled={!user.isActive}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900 px-3 py-1 rounded-lg transition-colors duration-200 disabled:opacity-40"
                      >
                        Inactivate
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user._id, true)}
                        disabled={user.isActive}
                        className="text-green-400 hover:text-green-300 hover:bg-green-900 px-3 py-1 rounded-lg transition-colors duration-200 disabled:opacity-40"
                      >
                        Activate
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🚫 No Users Found */}
        {filteredUsers.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-400 text-lg">
              {activeTab === "myReferrals" 
                ? "You haven't referred any users yet" 
                : "No users found"}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {activeTab === "myReferrals" 
                ? "Share your referral link to get started!" 
                : "Try adjusting your search terms"}
            </div>
          </motion.div>
        )}

        {/* 📊 Footer Info */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
          <div>
            Showing {filteredUsers.length} {activeTab === "myReferrals" ? "referrals" : "users"}
          </div>
          <div className="text-xs bg-gray-700 px-3 py-1 rounded-full">
            {activeTab === "myReferrals" 
              ? `Your Referrals: ${totalMyReferrals}` 
              : `Total Users: ${users.length}`}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;