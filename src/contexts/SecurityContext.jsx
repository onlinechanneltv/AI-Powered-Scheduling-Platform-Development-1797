import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { securityService } from '../services/securityService';

const SecurityContext = createContext({});

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const { user } = useAuth();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    allowedIPs: [],
    deviceTrust: true
  });
  const [securityEvents, setSecurityEvents] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    if (user) {
      loadSecuritySettings();
      loadSecurityEvents();
      loadActiveSessions();
    }
  }, [user]);

  const loadSecuritySettings = async () => {
    try {
      const settings = await securityService.getSecuritySettings(user.id);
      if (settings) {
        setSecuritySettings(settings);
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
    }
  };

  const loadSecurityEvents = async () => {
    try {
      const events = await securityService.getSecurityEvents(user.id);
      setSecurityEvents(events);
    } catch (error) {
      console.error('Failed to load security events:', error);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const sessions = await securityService.getActiveSessions(user.id);
      setActiveSessions(sessions);
    } catch (error) {
      console.error('Failed to load active sessions:', error);
    }
  };

  const updateSecuritySettings = async (newSettings) => {
    try {
      await securityService.updateSecuritySettings(user.id, newSettings);
      setSecuritySettings(newSettings);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const enableTwoFactor = async (secret, token) => {
    try {
      const result = await securityService.enableTwoFactor(user.id, secret, token);
      if (result.success) {
        setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: true }));
      }
      return result;
    } catch (error) {
      return { success: false, error };
    }
  };

  const disableTwoFactor = async (token) => {
    try {
      const result = await securityService.disableTwoFactor(user.id, token);
      if (result.success) {
        setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: false }));
      }
      return result;
    } catch (error) {
      return { success: false, error };
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      await securityService.terminateSession(sessionId);
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const value = {
    securitySettings,
    securityEvents,
    activeSessions,
    updateSecuritySettings,
    enableTwoFactor,
    disableTwoFactor,
    terminateSession,
    loadSecurityEvents,
    loadActiveSessions
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};