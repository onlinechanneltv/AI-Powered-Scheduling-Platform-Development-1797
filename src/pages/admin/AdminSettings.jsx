import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const { FiSettings, FiShield, FiMail, FiDatabase, FiActivity, FiSave } = FiIcons;

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    system: {
      siteName: 'AI Calendar',
      siteDescription: 'Smart scheduling platform',
      maintenanceMode: false,
      allowRegistrations: true,
      requireEmailVerification: true,
      maxUsersPerPlan: {
        basic: 1000,
        pro: 5000,
        enterprise: -1
      }
    },
    security: {
      enforceSSL: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedDomains: [],
      ipWhitelist: []
    },
    email: {
      provider: 'sendgrid',
      fromEmail: 'noreply@aicalendar.com',
      fromName: 'AI Calendar',
      welcomeEmailEnabled: true,
      newsletterEnabled: true,
      transactionalEnabled: true
    },
    integrations: {
      stripeEnabled: true,
      googleCalendarEnabled: true,
      zoomEnabled: true,
      slackEnabled: true,
      webhooksEnabled: true,
      apiRateLimit: 1000
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('system');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In a real app, load from API
      console.log('Loading admin settings...');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const result = await adminService.updateSystemSettings(settings);
      if (result.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(result.error || 'Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'system', label: 'System', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'email', label: 'Email', icon: FiMail },
    { id: 'integrations', label: 'Integrations', icon: FiDatabase }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} loading={loading}>
          <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {activeTab === 'system' && (
              <SystemSettings 
                settings={settings.system} 
                updateSetting={(key, value) => updateSetting('system', key, value)}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySettings 
                settings={settings.security} 
                updateSetting={(key, value) => updateSetting('security', key, value)}
              />
            )}
            {activeTab === 'email' && (
              <EmailSettings 
                settings={settings.email} 
                updateSetting={(key, value) => updateSetting('email', key, value)}
              />
            )}
            {activeTab === 'integrations' && (
              <IntegrationSettings 
                settings={settings.integrations} 
                updateSetting={(key, value) => updateSetting('integrations', key, value)}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SystemSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">System Configuration</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => updateSetting('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <input
          type="text"
          value={settings.siteDescription}
          onChange={(e) => updateSetting('siteDescription', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
          <p className="text-sm text-gray-600">Temporarily disable access to the platform</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Allow Registrations</h3>
          <p className="text-sm text-gray-600">Allow new users to create accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.allowRegistrations}
            onChange={(e) => updateSetting('allowRegistrations', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Require Email Verification</h3>
          <p className="text-sm text-gray-600">Users must verify email before accessing platform</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireEmailVerification}
            onChange={(e) => updateSetting('requireEmailVerification', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
);

const SecuritySettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Security Configuration</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Login Attempts
        </label>
        <input
          type="number"
          value={settings.maxLoginAttempts}
          onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Enforce SSL</h3>
          <p className="text-sm text-gray-600">Redirect all HTTP traffic to HTTPS</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enforceSSL}
            onChange={(e) => updateSetting('enforceSSL', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Require Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600">Force all users to enable 2FA</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireTwoFactor}
            onChange={(e) => updateSetting('requireTwoFactor', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  </div>
);

const EmailSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Email Configuration</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Email
        </label>
        <input
          type="email"
          value={settings.fromEmail}
          onChange={(e) => updateSetting('fromEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          From Name
        </label>
        <input
          type="text"
          value={settings.fromName}
          onChange={(e) => updateSetting('fromName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Provider
      </label>
      <select
        value={settings.provider}
        onChange={(e) => updateSetting('provider', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="sendgrid">SendGrid</option>
        <option value="mailgun">Mailgun</option>
        <option value="ses">Amazon SES</option>
        <option value="smtp">SMTP</option>
      </select>
    </div>

    <div className="space-y-4">
      {[
        { key: 'welcomeEmailEnabled', label: 'Welcome Email', description: 'Send welcome email to new users' },
        { key: 'newsletterEnabled', label: 'Newsletter', description: 'Enable newsletter subscriptions' },
        { key: 'transactionalEnabled', label: 'Transactional Emails', description: 'Send booking confirmations, reminders, etc.' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[item.key]}
              onChange={(e) => updateSetting(item.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  </div>
);

const IntegrationSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Integration Settings</h2>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        API Rate Limit (requests per minute)
      </label>
      <input
        type="number"
        value={settings.apiRateLimit}
        onChange={(e) => updateSetting('apiRateLimit', parseInt(e.target.value))}
        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <div className="space-y-4">
      {[
        { key: 'stripeEnabled', label: 'Stripe Payments', description: 'Enable Stripe payment processing' },
        { key: 'googleCalendarEnabled', label: 'Google Calendar', description: 'Allow Google Calendar integration' },
        { key: 'zoomEnabled', label: 'Zoom', description: 'Enable Zoom meeting creation' },
        { key: 'slackEnabled', label: 'Slack', description: 'Allow Slack notifications' },
        { key: 'webhooksEnabled', label: 'Webhooks', description: 'Enable webhook functionality' }
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings[item.key]}
              onChange={(e) => updateSetting(item.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  </div>
);

export default AdminSettings;