import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-md p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">MailGenius</span>
        </Link>
        
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
      </header>
      
      {/* Main content */}
      <motion.div 
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </motion.div>
      
      {/* Footer */}
      <footer className="py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© 2023 MailGenius. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;