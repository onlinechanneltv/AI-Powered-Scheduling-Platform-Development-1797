import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiHome, FiMail, FiUsers, FiFileText, FiBarChart2, FiSettings, FiUserPlus, FiLogOut, FiMenu, FiX, FiChevronDown, FiMoon, FiSun, FiZap, FiSearch, FiBell } from 'react-icons/fi';

const DashboardLayout = () => {
  const { user, currentOrganization, logout, organizations, switchOrganization } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: FiHome },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: FiMail },
    { name: 'Contacts', href: '/dashboard/contacts', icon: FiUsers },
    { name: 'Templates', href: '/dashboard/templates', icon: FiFileText },
    { name: 'Analytics', href: '/dashboard/analytics', icon: FiBarChart2 },
    { name: 'AI Assistant', href: '/dashboard/ai-assistant', icon: FiZap },
    { name: 'Team', href: '/dashboard/team', icon: FiUserPlus },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  ];
  
  const notifications = [
    { id: 1, title: 'Campaign "Welcome Series" completed', read: false, time: '10 minutes ago' },
    { id: 2, title: 'New subscriber: john@example.com', read: true, time: '1 hour ago' },
    { id: 3, title: 'Weekly analytics report available', read: true, time: 'Yesterday' }
  ];
  
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700">
            <div 
              className="relative flex items-center space-x-3 cursor-pointer"
              onClick={() => setOrgMenuOpen(!orgMenuOpen)}
            >
              {currentOrganization?.logo ? (
                <img 
                  src={currentOrganization.logo} 
                  alt={currentOrganization.name} 
                  className="w-8 h-8 rounded-md"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                  {currentOrganization?.name?.charAt(0) || 'M'}
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[140px]">
                  {currentOrganization?.name || 'Organization'}
                </h3>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                </div>
              </div>
              <FiChevronDown className="text-gray-500 dark:text-gray-400" />
            </div>
            
            <button 
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={closeSidebar}
            >
              <FiX className="h-5 w-5" />
            </button>
            
            {/* Organization switcher dropdown */}
            {orgMenuOpen && (
              <div 
                className="absolute top-16 left-4 z-50 mt-1 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5"
                onBlur={() => setOrgMenuOpen(false)}
              >
                <div className="py-1">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        currentOrganization?.id === org.id
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        switchOrganization(org.id);
                        setOrgMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {org.logo ? (
                          <img src={org.logo} alt={org.name} className="w-5 h-5 rounded mr-3" />
                        ) : (
                          <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold mr-3">
                            {org.name.charAt(0)}
                          </div>
                        )}
                        <span>{org.name}</span>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setOrgMenuOpen(false);
                      navigate('/onboarding/organization');
                    }}
                  >
                    + Create New Organization
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={closeSidebar}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <FiMenu className="h-5 w-5" />
                </button>
                <div className="ml-2 md:ml-0 relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {theme === 'dark' ? (
                    <FiSun className="h-5 w-5" />
                  ) : (
                    <FiMoon className="h-5 w-5" />
                  )}
                </button>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 relative"
                  >
                    <FiBell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                  </button>
                  
                  {notificationsOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      onBlur={() => setNotificationsOpen(false)}
                    >
                      <div className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  )}
                                </div>
                                <div className="ml-3 w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.title}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No notifications
                            </p>
                          </div>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="py-2 px-4 border-t border-gray-200 dark:border-gray-700">
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                            Mark all as read
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {user?.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {user?.firstName?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="hidden md:flex md:flex-col md:items-end">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    <FiChevronDown className="hidden md:block h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  
                  {userMenuOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      onBlur={() => setUserMenuOpen(false)}
                    >
                      <div className="py-1">
                        <Link
                          to="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Account Settings
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;