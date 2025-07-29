import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUserPlus, FiX, FiArrowRight, FiMail, FiUsers } from 'react-icons/fi';

const TeamInvite = () => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState([
    { email: '', role: 'member' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'editor', label: 'Editor', description: 'Can create and edit campaigns' },
    { value: 'member', label: 'Member', description: 'Limited access to view campaigns' }
  ];
  
  const handleEmailChange = (index, email) => {
    const updatedInvites = [...invites];
    updatedInvites[index].email = email;
    setInvites(updatedInvites);
  };
  
  const handleRoleChange = (index, role) => {
    const updatedInvites = [...invites];
    updatedInvites[index].role = role;
    setInvites(updatedInvites);
  };
  
  const handleAddInvite = () => {
    setInvites([...invites, { email: '', role: 'member' }]);
  };
  
  const handleRemoveInvite = (index) => {
    const updatedInvites = [...invites];
    updatedInvites.splice(index, 1);
    setInvites(updatedInvites);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter out empty emails
    const validInvites = invites.filter(invite => invite.email.trim() !== '');
    
    if (validInvites.length > 0) {
      setIsLoading(true);
      
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Invites sent:', validInvites);
      } catch (error) {
        console.error('Error sending invites:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    navigate('/onboarding/import');
  };
  
  const handleSkip = () => {
    navigate('/onboarding/import');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Invite your team
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Collaborate with your team members by inviting them to join your organization.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team members</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invite people to collaborate on your campaigns
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {invites.map((invite, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={invite.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      className="input pl-10 w-full"
                      placeholder="Email address"
                    />
                  </div>
                </div>
                
                <div className="w-32">
                  <select
                    value={invite.role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                    className="input w-full"
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                
                {invites.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInvite(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={handleAddInvite}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            <FiUserPlus className="mr-2" />
            Add another invite
          </button>
          
          <div className="flex items-center pt-4 space-x-4">
            <button
              type="button"
              onClick={handleSkip}
              className="btn btn-outline flex-1"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <>
                  Continue <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Role permissions</h3>
            <div className="space-y-2">
              {roles.map((role) => (
                <div key={role.value} className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300 w-16">
                    {role.label}:
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {role.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default TeamInvite;