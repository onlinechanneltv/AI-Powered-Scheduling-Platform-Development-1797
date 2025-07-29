import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { FiUpload, FiX, FiCheck, FiArrowRight } from 'react-icons/fi';

const OrganizationSetup = () => {
  const { createOrganization } = useAuth();
  const navigate = useNavigate();
  
  const [organizationName, setOrganizationName] = useState('');
  const [organizationLogo, setOrganizationLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const industries = [
    'Technology', 'Marketing', 'Education', 'Healthcare', 
    'E-commerce', 'Finance', 'Real Estate', 'Non-profit',
    'Consulting', 'Other'
  ];
  
  const sizes = [
    'Solo', '2-10 employees', '11-50 employees', 
    '51-200 employees', '201-1000 employees', '1000+ employees'
  ];
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrganizationLogo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveLogo = () => {
    setOrganizationLogo(null);
    setLogoPreview(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!organizationName.trim()) {
      setError('Organization name is required');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const result = await createOrganization({
        name: organizationName,
        logo: logoPreview, // In a real app, you'd upload this to storage first
        industry,
        size
      });
      
      if (result.success) {
        navigate('/onboarding/team');
      } else {
        setError(result.message || 'Failed to create organization');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Set up your organization
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Tell us a bit about your organization to help us personalize your experience.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization name*
            </label>
            <input
              type="text"
              id="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="input w-full"
              placeholder="Enter your organization name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization logo
            </label>
            
            {logoPreview ? (
              <div className="relative w-32 h-32 mb-4">
                <img
                  src={logoPreview}
                  alt="Organization logo preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mb-4">
                <label
                  htmlFor="logoUpload"
                  className="cursor-pointer flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <div className="text-center">
                    <FiUpload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Upload logo</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="logoUpload"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Industry
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input w-full"
            >
              <option value="">Select your industry</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization size
            </label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input w-full"
            >
              <option value="">Select organization size</option>
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full btn btn-primary py-3 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <>
                  Continue <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              * Required fields
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default OrganizationSetup;