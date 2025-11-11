'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  isActive: boolean;
}

// Simulated logged-in user (replace with real auth/context)
const loggedInUser = { role: "Admin" }; // Example: "Admin" or "User"

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const normalizedSearch = (searchTerm || "").toLowerCase();

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes(normalizedSearch) ||
      (user.email?.toLowerCase() || "").includes(normalizedSearch)
  );

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

  return (
    <div className="min-h-screen p-4">
      <motion.div
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-4 border border-gray-700 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header & Search */}
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

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {loggedInUser.role === "Admin" && <th>Actions</th>}
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
                  <td>{user.name || "Unnamed User"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.role || "User"}</td>
                  <td>{user.isActive ? "Active" : "Inactive"}</td>

                  {/* ⚙️ Only show actions to Admin */}
                  {loggedInUser.role === "Admin" && (
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user._id, false)}
                          disabled={!user.isActive}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900 px-3 py-1 rounded-lg disabled:opacity-40"
                        >
                          Inactivate
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user._id, true)}
                          disabled={user.isActive}
                          className="text-green-400 hover:text-green-300 hover:bg-green-900 px-3 py-1 rounded-lg disabled:opacity-40"
                        >
                          Activate
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Users Found */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">No users found</div>
        )}

      </motion.div>
    </div>
  );
};

export default Page;
