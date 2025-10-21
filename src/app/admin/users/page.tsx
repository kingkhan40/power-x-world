"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// Types definition
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from MongoDB via API route
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users"); // You need to create this API
      const data = await res.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search handler (real-time)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    );
  };

  // Toggle user status
  const toggleStatus = async (id: string, status: "Active" | "Inactive") => {
    try {
      await fetch(`/api/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });
      fetchUsers(); // refresh table
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen p-2">
      {/* Users Table */}
      <motion.div
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-2 border border-gray-700 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-100">Users Management</h2>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

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
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">{user.name}</div>
                        <div className="text-xs text-gray-400">ID: {user._id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-purple-800 text-purple-100"
                          : user.role === "Moderator"
                          ? "bg-orange-800 text-orange-100"
                          : "bg-blue-800 text-blue-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleStatus(user._id, "Inactive")}
                        className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        Inactive
                      </button>
                      <button
                        onClick={() => toggleStatus(user._id, "Active")}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900 px-3 py-1 rounded-lg transition-colors duration-200"
                      >
                        Active
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-400 text-lg">No users found</div>
            <div className="text-gray-500 text-sm mt-2">Try adjusting your search terms</div>
          </motion.div>
        )}

        <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
          <div>Showing {filteredUsers.length} of {users.length} users</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
