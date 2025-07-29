import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { 
  FiHome, 
  FiUsers, 
  FiActivity, 
  FiSettings, 
  FiShield, 
  FiCreditCard, 
  FiBarChart3, 
  FiLogOut, 
  FiPackage, 
  FiDollarSign 
} = FiIcons;

const AdminSidebar = () => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    // Sign out logic would go here
    navigate('/');
  };
  
  const navItems = [
    { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/plans', icon: FiPackage, label: 'Plans' },
    { to: '/admin/billing', icon: FiDollarSign, label: 'Billing' },
    { to: '/admin/analytics', icon: FiBarChart3, label: 'Analytics' },
    { to: '/admin/security', icon: FiShield, label: 'Security' },
    { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
  ];
  
  return (
    <div 
      className="w-64 bg-gray-900 text-white shadow-lg border-r border-gray-800 flex flex-col min-h-screen"
      style={{ transform: 'translateX(0)' }}
    >
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 text-sm">AI Calendar Management</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;