import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

const { FiTrendingUp, FiClock, FiUsers, FiCalendar, FiBarChart3, FiPieChart, FiDownload, FiFilter, FiTarget, FiBrain, FiZap } = FiIcons;

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon, color, bgColor, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center space-x-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <SafeIcon icon={change.startsWith('+') ? FiTrendingUp : FiTrendingUp} className="w-4 h-4" />
              <span>{change}</span>
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <SafeIcon icon={icon} className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="outline">
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={analytics.totalUsers?.toLocaleString() || '0'}
          change={`+${analytics.userGrowth || 0}%`}
          icon={FiUsers}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <MetricCard
          title="Active Users"
          value={analytics.activeUsers?.toLocaleString() || '0'}
          change={`+${analytics.userGrowth || 0}%`}
          icon={FiCalendar}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${analytics.revenue?.toLocaleString() || '0'}`}
          change={`+${analytics.revenueGrowth || 0}%`}
          icon={FiTrendingUp}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <MetricCard
          title="Churn Rate"
          value={`${analytics.churnRate || 0}%`}
          change="-0.5%"
          icon={FiTarget}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="space-y-3">
            {[
              { month: 'Jan', users: 100, percentage: 20 },
              { month: 'Feb', users: 250, percentage: 50 },
              { month: 'Mar', users: 400, percentage: 80 },
              { month: 'Apr', users: 650, percentage: 100 },
              { month: 'May', users: 850, percentage: 85 },
              { month: 'Jun', users: 1247, percentage: 95 }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 w-8">{item.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  {item.users.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Growth</h3>
          <div className="space-y-3">
            {[
              { month: 'Jan', revenue: 2000, percentage: 25 },
              { month: 'Feb', revenue: 4500, percentage: 45 },
              { month: 'Mar', revenue: 7200, percentage: 70 },
              { month: 'Apr', revenue: 9800, percentage: 85 },
              { month: 'May', revenue: 12500, percentage: 95 },
              { month: 'Jun', revenue: 15420, percentage: 100 }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 w-8">{item.month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-green-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  ${item.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Distribution</h3>
          <div className="space-y-4">
            {[
              { name: 'Basic', count: 450, percentage: 60, color: 'bg-blue-500' },
              { name: 'Pro', count: 280, percentage: 40, color: 'bg-purple-500' },
              { name: 'Enterprise', count: 120, percentage: 20, color: 'bg-orange-500' }
            ].map((plan, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`}></div>
                  <span className="text-gray-700">{plan.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{plan.count}</span>
                  <span className="text-sm text-gray-500 ml-2">({plan.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Features</h3>
          <div className="space-y-3">
            {[
              { feature: 'Calendar Sync', usage: 85 },
              { feature: 'Meeting Links', usage: 78 },
              { feature: 'Reminders', usage: 65 },
              { feature: 'AI Assistant', usage: 42 },
              { feature: 'Team Sharing', usage: 38 }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 flex-1">{item.feature}</span>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.usage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.usage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium text-gray-900">120ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Error Rate</span>
              <span className="font-medium text-green-600">0.01%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Connections</span>
              <span className="font-medium text-gray-900">450</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;