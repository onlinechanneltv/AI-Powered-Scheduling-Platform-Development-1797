import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const {
  FiHome,
  FiCalendar,
  FiSettings,
  FiShield,
  FiCreditCard,
  FiBot,
  FiLogOut,
  FiUsers
} = FiIcons;

const Sidebar = () => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    // Sign out logic would go here
    navigate('/');
  };
  
  const navItems = [
    { to: '/app', icon: FiHome, label: 'Dashboard' },
    { to: '/app/calendar', icon: FiCalendar, label: 'Calendar' },
    { to: '/app/integrations', icon: FiSettings, label: 'Integrations' },
    { to: '/app/security', icon: FiShield, label: 'Security' },
    { to: '/app/billing', icon: FiCreditCard, label: 'Billing' },
    { to: '/app/ai-assistant', icon: FiBot, label: 'AI Assistant' },
    { to: '/admin', icon: FiUsers, label: 'Admin Panel' },
  ];

  return (
    <div
      className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col"
      style={{ transform: 'translateX(0)' }}
    >
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">AI Calendar</h1>
        <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
          Admin
        </span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;