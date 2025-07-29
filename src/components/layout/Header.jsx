import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiBell, FiUser } = FiIcons;

const Header = () => {
  // Mock user data
  const user = {
    user_metadata: {
      first_name: 'Admin',
      last_name: 'User'
    },
    email: 'admin@example.com'
  };
  
  return (
    <header 
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
      style={{ opacity: 1, transform: 'translateY(0)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back, {user?.user_metadata?.first_name || 'User'}
          </h2>
          <p className="text-gray-600">Manage your schedule efficiently</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <SafeIcon icon={FiBell} className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;