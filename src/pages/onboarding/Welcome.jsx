import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleContinue = () => {
    navigate('/onboarding/organization');
  };
  
  const features = [
    {
      icon: FiMail,
      title: 'Smart Email Campaigns',
      description: 'Create and manage AI-powered email campaigns with intelligent automation.'
    },
    {
      icon: FiCalendar,
      title: 'Content Calendar',
      description: 'Plan and schedule your content with our visual calendar interface.'
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Invite team members and collaborate on campaigns seamlessly.'
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to MailGenius, {user?.firstName || 'there'}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          We're excited to help you create amazing email campaigns. Let's get your account set up in just a few steps.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="btn btn-primary px-8 py-3 text-lg inline-flex items-center"
        >
          Let's get started
          <FiArrowRight className="ml-2" />
        </motion.button>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          This will only take a few minutes to complete
        </p>
      </div>
    </motion.div>
  );
};

export default Welcome;