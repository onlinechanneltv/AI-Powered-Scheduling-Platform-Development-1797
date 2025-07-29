import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/ui/Button';
import { useSecurity } from '../contexts/SecurityContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiShield, FiSmartphone, FiMonitor, FiAlertTriangle, FiCheck, FiX } = FiIcons;

const SecuritySettings = () => {
  const {
    securitySettings,
    securityEvents,
    activeSessions,
    updateSecuritySettings,
    enableTwoFactor,
    disableTwoFactor,
    terminateSession,
    loadSecurityEvents,
    loadActiveSessions
  } = useSecurity();

  const [loading, setLoading] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  useEffect(() => {
    loadSecurityEvents();
    loadActiveSessions();
  }, []);

  const handleToggle2FA = async () => {
    if (securitySettings.twoFactorEnabled) {
      // Disable 2FA
      const token = prompt('Enter your 2FA code to disable:');
      if (token) {
        setLoading(true);
        const result = await disableTwoFactor(token);
        if (result.success) {
          toast.success('2FA disabled successfully');
        } else {
          toast.error(result.error);
        }
        setLoading(false);
      }
    } else {
      setShow2FASetup(true);
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    setLoading(true);
    const result = await updateSecuritySettings(newSettings);
    if (result.success) {
      toast.success('Security settings updated');
    } else {
      toast.error('Failed to update settings');
    }
    setLoading(false);
  };

  const handleTerminateSession = async (sessionId) => {
    const result = await terminateSession(sessionId);
    if (result.success) {
      toast.success('Session terminated');
    } else {
      toast.error('Failed to terminate session');
    }
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      'login': 'text-green-600 bg-green-50',
      'login_failed': 'text-red-600 bg-red-50',
      '2fa_enabled': 'text-blue-600 bg-blue-50',
      '2fa_disabled': 'text-orange-600 bg-orange-50',
      'settings_updated': 'text-purple-600 bg-purple-50'
    };
    return colors[eventType] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account security and privacy</p>
      </div>

      {/* Security Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <SafeIcon icon={FiShield} className="w-8 h-8 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Account Protected</p>
              <p className="text-sm text-green-600">Strong security measures active</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <SafeIcon icon={FiSmartphone} className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">2FA Status</p>
              <p className="text-sm text-blue-600">
                {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <SafeIcon icon={FiMonitor} className="w-8 h-8 text-purple-600" />
            <div>
              <p className="font-medium text-purple-900">Active Sessions</p>
              <p className="text-sm text-purple-600">{activeSessions.length} devices</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
            <p className="text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Button
            onClick={handleToggle2FA}
            loading={loading}
            variant={securitySettings.twoFactorEnabled ? 'danger' : 'primary'}
          >
            {securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </div>

        {securitySettings.twoFactorEnabled ? (
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <SafeIcon icon={FiCheck} className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">2FA is enabled</p>
              <p className="text-sm text-green-600">Your account is protected with two-factor authentication</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">2FA is disabled</p>
              <p className="text-sm text-orange-600">Enable 2FA to add extra security to your account</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Login Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Login Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email notifications for new logins</p>
              <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.loginNotifications}
                onChange={(e) => handleUpdateSettings({
                  ...securitySettings,
                  loginNotifications: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Session timeout</p>
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleUpdateSettings({
                ...securitySettings,
                sessionTimeout: parseInt(e.target.value)
              })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Sessions</h2>
        
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMonitor} className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    {session.device_info?.browser?.name || 'Unknown Browser'} on {session.device_info?.os?.name || 'Unknown OS'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {session.ip_address} • Last active: {format(new Date(session.last_activity), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTerminateSession(session.id)}
              >
                Terminate
              </Button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Security Activity</h2>
        
        <div className="space-y-3">
          {securityEvents.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.event_type).split(' ')[1]}`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {event.event_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-xs text-gray-600">
                  {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')} • {event.ip_address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettings;