import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiShield, FiAlertTriangle, FiEye, FiUsers, FiActivity, FiLock, FiRefreshCw } = FiIcons;

const AdminSecurity = () => {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    highRiskEvents: 0,
    blockedAttempts: 0,
    activeThreats: 0
  });

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      // Mock security data
      const mockStats = {
        totalEvents: 1247,
        highRiskEvents: 23,
        blockedAttempts: 156,
        activeThreats: 3
      };
      
      const mockEvents = [
        {
          id: 'sec-1',
          type: 'failed_login',
          severity: 'medium',
          description: 'Multiple failed login attempts',
          ip_address: '192.168.1.100',
          user_email: 'attacker@suspicious.com',
          timestamp: new Date(),
          status: 'blocked'
        },
        {
          id: 'sec-2',
          type: 'suspicious_activity',
          severity: 'high',
          description: 'Unusual API access pattern',
          ip_address: '10.0.0.5',
          user_email: 'user@example.com',
          timestamp: new Date(Date.now() - 3600000),
          status: 'investigating'
        }
      ];

      setStats(mockStats);
      setSecurityEvents(mockEvents);
      setThreats(mockEvents.filter(e => e.severity === 'high'));
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ipAddress) => {
    try {
      toast.success(`IP ${ipAddress} has been blocked`);
      loadSecurityData();
    } catch (error) {
      toast.error('Failed to block IP');
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600 mt-1">Monitor and manage platform security</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadSecurityData}>
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <SafeIcon icon={FiShield} className="w-4 h-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
              <p className="text-sm text-blue-600 mt-1">Last 24 hours</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Events</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.highRiskEvents}</p>
              <p className="text-sm text-red-600 mt-1">Needs attention</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blocked Attempts</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.blockedAttempts}</p>
              <p className="text-sm text-green-600 mt-1">Automatically blocked</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiShield} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Threats</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeThreats}</p>
              <p className="text-sm text-orange-600 mt-1">Being investigated</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiEye} className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Threats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Threats</h2>
        <div className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{threat.description}</p>
                  <p className="text-sm text-gray-600">
                    IP: {threat.ip_address} • {threat.user_email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(threat.timestamp, 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(threat.severity)}`}>
                  {threat.severity.toUpperCase()}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleBlockIP(threat.ip_address)}>
                  Block IP
                </Button>
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Security Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Security Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Event Type</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">IP Address</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Severity</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Time</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : securityEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No security events found
                  </td>
                </tr>
              ) : (
                securityEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">
                        {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{event.description}</span>
                      <br />
                      <span className="text-sm text-gray-500">{event.user_email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-gray-900">{event.ip_address}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">
                        {format(event.timestamp, 'MMM d, h:mm a')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {event.status !== 'blocked' && (
                          <Button variant="outline" size="sm" onClick={() => handleBlockIP(event.ip_address)}>
                            Block IP
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSecurity;