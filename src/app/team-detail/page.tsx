"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Copy, User } from "lucide-react";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  referredBy: string | null; // This is the referrer's user ID
  referralCode: string; // Added this for search functionality
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [referrerMap, setReferrerMap] = useState<{[key: string]: string}>({}); // Store referrer names

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
    toast.success("Referral code copied!");
  };

  /* -----------------------------------------
   * 🔍 Get Referrer Name
   * ----------------------------------------- */
  const getReferrerName = (referredById: string | null) => {
    if (!referredById) return "No Referrer";
    return referrerMap[referredById] || "Unknown User";
  };

  /* -----------------------------------------
   * 🔍 Search Filter
   * ----------------------------------------- */
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.referralCode && user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.referredBy && getReferrerName(user.referredBy).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /* -----------------------------------------
   * ⚙️ Toggle User Active/Inactive (Instant UI Update)
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
          `User has been ${newStatus ? "activated" : "deactivated"} successfully`
        );

        // ✅ Update local UI instantly without reloading or refetching
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
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
   * 💻 UI
   * ----------------------------------------- */
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
                  Role
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
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">
                          {user.name}
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

                  {/* 👥 Referred By - Shows actual referrer name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.referredBy ? (
                        <>
                          <User size={14} className="text-green-400" />
                          <span className="text-sm text-green-300">
                            {getReferrerName(user.referredBy)}
                          </span>
                          <button
                            onClick={() => copyReferralCode(user.referredBy!)}
                            className="text-gray-400 hover:text-green-300 transition-colors duration-200 p-1 hover:bg-green-900 hover:bg-opacity-20 rounded"
                            title="Copy referrer ID"
                          >
                            <Copy size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No Referrer</span>
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

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-purple-800 text-purple-100"
                          : "bg-blue-800 text-blue-100"
                      }`}
                    >
                      {user.role}
                    </span>
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
            <div className="text-gray-400 text-lg">No users found</div>
            <div className="text-gray-500 text-sm mt-2">
              Try adjusting your search terms
            </div>
          </motion.div>
        )}

        {/* 📊 Footer Info */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
          <div>Showing {filteredUsers.length} users</div>
          <div className="text-xs bg-gray-700 px-3 py-1 rounded-full">
            Total Users: {users.length}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;