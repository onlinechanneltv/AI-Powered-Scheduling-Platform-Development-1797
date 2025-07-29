import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { motion } from 'framer-motion';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import OnboardingLayout from './layouts/OnboardingLayout';

// Pages - Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Pages - Onboarding
import Welcome from './pages/onboarding/Welcome';
import OrganizationSetup from './pages/onboarding/OrganizationSetup';
import TeamInvite from './pages/onboarding/TeamInvite';
import ImportContacts from './pages/onboarding/ImportContacts';

// Pages - Dashboard
import Overview from './pages/dashboard/Overview';
import Campaigns from './pages/dashboard/Campaigns';
import CampaignDetail from './pages/dashboard/CampaignDetail';
import CreateCampaign from './pages/dashboard/CreateCampaign';
import Contacts from './pages/dashboard/Contacts';
import ContactDetail from './pages/dashboard/ContactDetail';
import Templates from './pages/dashboard/Templates';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import Team from './pages/dashboard/Team';
import AIAssistant from './pages/dashboard/AIAssistant';

// Pages - Public
import LandingPage from './pages/public/LandingPage';
import NotFound from './pages/public/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-gray-200 animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// App component
function App() {
  const { isAuthenticated, user, checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        
        {/* Onboarding routes */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingLayout />
          </ProtectedRoute>
        }>
          <Route path="welcome" element={<Welcome />} />
          <Route path="organization" element={<OrganizationSetup />} />
          <Route path="team" element={<TeamInvite />} />
          <Route path="import" element={<ImportContacts />} />
        </Route>
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="campaigns/create" element={<CreateCampaign />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:id" element={<ContactDetail />} />
          <Route path="templates" element={<Templates />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="team" element={<Team />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
        </Route>
        
        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </motion.div>
  );
}

export default App;