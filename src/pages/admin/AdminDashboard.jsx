import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUsers, FiActivity, FiDollarSign, FiTrendingUp, FiShield, FiAlertTriangle } = FiIcons;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    revenue: 15420,
    securityAlerts: 3
  });
  
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  useEffect(() => {
    // Mock data - in real app, fetch from API
    setUserGrowthData([
      { month: 'Jan', users: 100, percentage: 10 },
      { month: 'Feb', users: 250, percentage: 25 },
      { month: 'Mar', users: 400, percentage: 40 },
      { month: 'Apr', users: 650, percentage: 65 },
      { month: 'May', users: 850, percentage: 85 },
      { month: 'Jun', users: 1247, percentage: 100 }
    ]);
    
    setRevenueData([
      { month: 'Jan', revenue: 2000, percentage: 13 },
      { month: 'Feb', revenue: 4500, percentage: 29 },
      { month: 'Mar', revenue: 7200, percentage: 47 },
      { month: 'Apr', revenue: 9800, percentage: 64 },
      { month: 'May', revenue: 12500, percentage: 81 },
      { month: 'Jun', revenue: 15420, percentage: 100 }
    ]);
  }, []);
  
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: FiUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: FiActivity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%'
    },
    {
      title: 'Security Alerts',
      value: stats.securityAlerts,
      icon: FiShield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-2'
    }
  ];
  
  // Simple CSS-based chart component
  const SimpleChart = ({ data, title, type = 'bar', color = 'bg-blue-500' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600 w-8">{item.month}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                className={`h-full ${color} rounded-full`} 
                style={{ width: `${item.percentage}%`, transition: 'width 1s ease' }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900 w-16 text-right">
              {type === 'bar' ? item.users?.toLocaleString() : `$${item.revenue?.toLocaleString()}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your AI Calendar platform</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={stat.title} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            style={{ opacity: 1, transform: 'translateY(0)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={{ opacity: 1, transform: 'translateY(0)' }}>
          <SimpleChart data={userGrowthData} title="User Growth" type="bar" color="bg-blue-500" />
        </div>
        <div style={{ opacity: 1, transform: 'translateY(0)' }}>
          <SimpleChart data={revenueData} title="Revenue Growth" type="revenue" color="bg-green-500" />
        </div>
      </div>
      
      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {[
              { name: 'John Doe', email: 'john@example.com', plan: 'Pro', joined: '2 hours ago' },
              { name: 'Jane Smith', email: 'jane@example.com', plan: 'Basic', joined: '5 hours ago' },
              { name: 'Mike Johnson', email: 'mike@example.com', plan: 'Enterprise', joined: '1 day ago' },
              { name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'Pro', joined: '2 days ago' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {user.plan}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Security Alerts */}
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Alerts</h2>
          <div className="space-y-4">
            {[
              {
                type: 'warning',
                title: 'Multiple failed login attempts',
                description: 'IP: 192.168.1.100 - 5 failed attempts',
                time: '10 minutes ago'
              },
              {
                type: 'info',
                title: 'New device login',
                description: 'User: john@example.com from Chrome/Windows',
                time: '1 hour ago'
              },
              {
                type: 'error',
                title: 'Suspicious API activity',
                description: 'Rate limit exceeded from IP: 10.0.0.5',
                time: '2 hours ago'
              }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <SafeIcon
                  icon={alert.type === 'error' ? FiAlertTriangle : FiShield}
                  className={`w-5 h-5 mt-0.5 ${
                    alert.type === 'error'
                      ? 'text-red-500'
                      : alert.type === 'warning'
                      ? 'text-orange-500'
                      : 'text-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;