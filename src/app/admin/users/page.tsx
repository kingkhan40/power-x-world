"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  LucideIcon,
} from "lucide-react";

// Types definition
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface StatItem {
  name: string;
  icon: LucideIcon;
  value: string;
  color: string;
}

const userData: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Customer",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Customer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Customer",
    status: "Active",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Moderator",
    status: "Active",
  },
];

const userStats: StatItem[] = [
  {
    name: "Total Users",
    icon: Users,
    value: "152,845",
    color: "#6366F1",
  },
  {
    name: "New Users Today",
    icon: UserPlus,
    value: "243",
    color: "#10B981",
  },
  {
    name: "Active Users",
    icon: UserCheck,
    value: "98,520",
    color: "#F59E0B",
  },
  {
    name: "Churn Rate",
    icon: UserX,
    value: "2.4%",
    color: "#EF4444",
  },
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(userData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="min-h-screen p-1">
      {/* Stats Cards Grid */}
      <motion.div
        className="grid gap-5 grid-cols-2 lg:grid-cols-4 my-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {userStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.name}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
              whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="px-3 py-5 flex flex-col  sm:p-6">
                <span className="flex items-center text-sm font-medium text-gray-400">
                  <IconComponent
                    size={20}
                    className="mr-2"
                    style={{ color: stat.color }}
                  />
                  {stat.name}
                </span>
                <p className="mt-1 text-2xl font-semibold text-gray-100">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-2 border border-gray-700 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
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
                  key={user.id}
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
                        <div className="text-sm font-medium text-gray-100">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: {user.id}
                        </div>
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
                      <button className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900 px-3 py-1 rounded-lg transition-colors duration-200">
                        Edit
                      </button>
                      <button className="text-red-400 hover:text-red-300 hover:bg-red-900 px-3 py-1 rounded-lg transition-colors duration-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
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

        {/* Summary */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
          <div>
            Showing {filteredUsers.length} of {userData.length} users
          </div>
          <div className="text-xs bg-gray-700 px-3 py-1 rounded-full">
            Total Users: {userData.length}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
