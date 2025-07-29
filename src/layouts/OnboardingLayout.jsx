import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const OnboardingLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const steps = [
    { id: 'welcome', path: '/onboarding/welcome', label: 'Welcome' },
    { id: 'organization', path: '/onboarding/organization', label: 'Organization Setup' },
    { id: 'team', path: '/onboarding/team', label: 'Invite Team' },
    { id: 'import', path: '/onboarding/import', label: 'Import Contacts' }
  ];
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  useEffect(() => {
    const index = steps.findIndex(step => step.path === location.pathname);
    if (index !== -1) {
      setCurrentStepIndex(index);
    }
  }, [location.pathname]);
  
  // Prevent skipping steps by directly accessing URLs
  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (location.pathname !== currentStep.path) {
      navigate(currentStep.path);
    }
  }, [currentStepIndex]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white rounded-md p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">MailGenius</span>
        </div>
      </header>
      
      {/* Progress steps */}
      <div className="py-6 px-6 sm:px-10">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} ${stepIdx !== 0 ? 'pl-8 sm:pl-20' : ''}`}>
                  {stepIdx !== 0 && (
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className={`h-0.5 w-full ${stepIdx <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                    </div>
                  )}
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        stepIdx < currentStepIndex
                          ? 'bg-blue-600'
                          : stepIdx === currentStepIndex
                          ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      {stepIdx < currentStepIndex ? (
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className={`text-sm font-medium ${stepIdx === currentStepIndex ? 'text-white' : 'text-gray-500 dark:text-gray-300'}`}>
                          {stepIdx + 1}
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-medium mt-2 text-gray-500 dark:text-gray-400">
                      {step.label}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <motion.div 
        className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl w-full">
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

export default OnboardingLayout;