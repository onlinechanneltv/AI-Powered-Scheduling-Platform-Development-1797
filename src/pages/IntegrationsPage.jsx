import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/ui/Button';

const { FiSettings, FiCheck, FiX, FiExternalLink, FiPlus } = FiIcons;

const IntegrationsPage = () => {
  const [connectedIntegrations, setConnectedIntegrations] = useState([
    { id: 'google-calendar', name: 'Google Calendar', connected: true },
    { id: 'zoom', name: 'Zoom', connected: true },
  ]);

  const availableIntegrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync your events with Google Calendar',
      icon: FiSettings,
      category: 'Calendar',
      connected: true
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Connect with Outlook calendar and email',
      icon: FiSettings,
      category: 'Calendar',
      connected: false
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Automatically create Zoom meetings',
      icon: FiSettings,
      category: 'Video Conferencing',
      connected: true
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Generate Teams meeting links',
      icon: FiSettings,
      category: 'Video Conferencing',
      connected: false
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      description: 'Create Google Meet links automatically',
      icon: FiSettings,
      category: 'Video Conferencing',
      connected: false
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications to Slack channels',
      icon: FiSettings,
      category: 'Communication',
      connected: false
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 3000+ apps via Zapier',
      icon: FiSettings,
      category: 'Automation',
      connected: false
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      description: 'Send data to custom endpoints',
      icon: FiSettings,
      category: 'Developer',
      connected: false
    }
  ];

  const categories = [...new Set(availableIntegrations.map(int => int.category))];

  const handleToggleIntegration = (integrationId) => {
    const integration = availableIntegrations.find(int => int.id === integrationId);
    if (integration.connected) {
      // Disconnect
      setConnectedIntegrations(prev => prev.filter(int => int.id !== integrationId));
    } else {
      // Connect
      setConnectedIntegrations(prev => [...prev, {
        id: integrationId,
        name: integration.name,
        connected: true
      }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect your favorite tools and services</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Request Integration</span>
        </motion.button>
      </div>

      {/* Connected Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Integrations</h2>
        
        {connectedIntegrations.length > 0 ? (
          <div className="space-y-4">
            {connectedIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-green-600">Connected and syncing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleIntegration(integration.id)}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <SafeIcon icon={FiSettings} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No integrations connected yet</p>
          </div>
        )}
      </motion.div>

      {/* Available Integrations by Category */}
      {categories.map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{category}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableIntegrations
              .filter(integration => integration.category === category)
              .map((integration) => {
                const isConnected = connectedIntegrations.some(conn => conn.id === integration.id);
                
                return (
                  <motion.div
                    key={integration.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isConnected
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-primary-200'
                    }`}
                    onClick={() => handleToggleIntegration(integration.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isConnected ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <SafeIcon 
                          icon={isConnected ? FiCheck : integration.icon} 
                          className={`w-5 h-5 ${isConnected ? 'text-green-600' : 'text-gray-600'}`} 
                        />
                      </div>
                      {isConnected ? (
                        <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
                      ) : (
                        <SafeIcon icon={FiX} className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{integration.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isConnected 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {isConnected ? 'Connected' : 'Available'}
                      </span>
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      ))}

      {/* Custom Integration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Custom Integration</h2>
            <p className="text-gray-600">
              Need a specific integration? Our API allows you to build custom connections.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              View API Docs
            </Button>
            <Button>
              Contact Support
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntegrationsPage;