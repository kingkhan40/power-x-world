"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrashAlt, FaEdit, FaShieldAlt, FaBell, FaKey, FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';

// Types
interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface ConnectedAccount {
  id: number;
  name: string;
  connected: boolean;
  icon: string;
}

const SettingsPage = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    push: true,
    email: false,
    sms: true,
  });

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      id: 1,
      name: "Google",
      connected: true,
      icon: "https://i.pinimg.com/1200x/45/20/dd/4520ddfc56208707045c56232e946f7f.jpg",
    },
    {
      id: 2,
      name: "Facebook",
      connected: false,
      icon: "https://i.pinimg.com/736x/7b/ed/39/7bed398644d61cae7c4dd853b558a1c9.jpg",
    },
    {
      id: 3,
      name: "Twitter",
      connected: true,
      icon: "https://i.pinimg.com/736x/b3/ea/ac/b3eaacd7a29063b62d6c3b242032b7fd.jpg",
    },
  ]);

  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(true);

  const toggleNotification = (type: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const toggleAccountConnection = (id: number) => {
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === id 
          ? { ...account, connected: !account.connected }
          : account
      )
    );
  };

  const getAccountIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'google': return <FaGoogle className="w-5 h-5 text-red-500" />;
      case 'facebook': return <FaFacebook className="w-5 h-5 text-blue-500" />;
      case 'twitter': return <FaTwitter className="w-5 h-5 text-blue-400" />;
      default: return <FaPlus className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div 
      className="min-h-screen p-6"
    
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Section */}
        <motion.div
          className='bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex flex-col sm:flex-row items-center gap-6 mb-6'>
            <div className="relative">
              <img
                src='https://randomuser.me/api/portraits/men/3.jpg'
                alt='Profile'
                className='rounded-full w-24 h-24 object-cover border-4 border-blue-500'
              />
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-gray-800">
                <FaEdit className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="text-center sm:text-left">
              <h3 className='text-2xl font-bold text-gray-100'>John Doe</h3>
              <p className='text-gray-400 text-lg'>john.doe@example.com</p>
              <p className='text-gray-500 text-sm mt-1'>Administrator</p>
            </div>
          </div>

          <button className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 w-full sm:w-auto'>
            <FaEdit className="w-4 h-4" />
            Edit Profile
          </button>
        </motion.div>

        {/* Notifications & Security Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <motion.div
            className='bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-gray-700'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className='flex items-center mb-6'>
              <div className="bg-blue-500 p-2 rounded-lg">
                <FaBell className="w-6 h-6 text-white" />
              </div>
              <h2 className='text-xl font-semibold text-gray-100 ml-3'>Notifications</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className='flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-700 transition-colors duration-200'>
                  <span className='text-gray-300 capitalize'>
                    {key} Notifications
                  </span>
                  <button
                    className={`
                      relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none
                      ${value ? "bg-blue-600" : "bg-gray-600"}
                    `}
                    onClick={() => toggleNotification(key as keyof NotificationSettings)}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full 
                        ${value ? "translate-x-6" : "translate-x-1"}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            className='bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-gray-700'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className='flex items-center mb-6'>
              <div className="bg-green-500 p-2 rounded-lg">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <h2 className='text-xl font-semibold text-gray-100 ml-3'>Security</h2>
            </div>

            <div className="space-y-4">
              {/* Two-Factor Authentication */}
              <div className='flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-700 transition-colors duration-200'>
                <span className='text-gray-300'>
                  Two-Factor Authentication
                </span>
                <button
                  className={`
                    relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none
                    ${twoFactorAuth ? "bg-green-600" : "bg-gray-600"}
                  `}
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                >
                  <span
                    className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full 
                      ${twoFactorAuth ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              {/* Change Password */}
              <div className="pt-4">
                <button className='bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2 w-full'>
                  <FaKey className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connected Accounts */}
        <motion.div
          className='bg-gray-800 bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-gray-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='flex items-center justify-between mb-6'>
            <div className="flex items-center">
              <div className="bg-orange-500 p-2 rounded-lg">
                <FaPlus className="w-6 h-6 text-white" />
              </div>
              <h2 className='text-xl font-semibold text-gray-100 ml-3'>Connected Accounts</h2>
            </div>
          </div>

          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div key={account.id} className='flex items-center justify-between py-4 px-4 rounded-lg bg-gray-700 bg-opacity-50 hover:bg-gray-600 transition-colors duration-200'>
                <div className='flex items-center gap-3'>
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    {getAccountIcon(account.name)}
                  </div>
                  <div>
                    <span className='text-gray-100 font-medium'>{account.name}</span>
                    <p className={`text-xs ${account.connected ? 'text-green-400' : 'text-gray-400'}`}>
                      {account.connected ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    account.connected 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => toggleAccountConnection(account.id)}
                >
                  {account.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>

          <button className='mt-6 flex items-center text-blue-400 hover:text-blue-300 transition duration-200 font-medium'>
            <FaPlus className="w-5 h-5 mr-2" /> 
            Add New Account
          </button>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className='bg-red-900 bg-opacity-50 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-red-700'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className='flex items-center mb-4'>
            <div className="bg-red-600 p-2 rounded-lg">
              <FaTrashAlt className='text-white mr-2' size={20} />
            </div>
            <h2 className='text-xl font-semibold text-gray-100 ml-3'>Danger Zone</h2>
          </div>
          <p className='text-gray-300 mb-6'>Permanently delete your account and all of your content. This action cannot be undone.</p>
          <button
            className='bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2'
          >
            <FaTrashAlt className="w-4 h-4" />
            Delete Account
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;