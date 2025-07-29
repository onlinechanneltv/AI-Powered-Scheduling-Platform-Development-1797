import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiUsers, FiSend, FiPieChart, FiActivity, FiArrowRight, FiBarChart2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Overview = () => {
  const { currentOrganization, user } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 12,
    totalContacts: 2458,
    totalSent: 18254,
    openRate: 24.8,
    clickRate: 3.7,
    bounceRate: 0.8
  });
  const [recentCampaigns, setRecentCampaigns] = useState([
    {
      id: 'c1',
      name: 'Monthly Newsletter',
      sentDate: '2023-11-15T10:30:00Z',
      status: 'completed',
      stats: {
        sent: 1245,
        opened: 432,
        clicked: 187,
        openRate: 34.7,
        clickRate: 15.0
      }
    },
    {
      id: 'c2',
      name: 'Product Launch Announcement',
      sentDate: '2023-11-10T14:15:00Z',
      status: 'completed',
      stats: {
        sent: 2500,
        opened: 875,
        clicked: 345,
        openRate: 35.0,
        clickRate: 13.8
      }
    },
    {
      id: 'c3',
      name: 'Black Friday Promotion',
      sentDate: null,
      status: 'scheduled',
      scheduledDate: '2023-11-22T08:00:00Z',
      stats: {
        recipients: 3200
      }
    }
  ]);

  // Chart data
  const engagementChartData = {
    labels: ['Oct 15', 'Oct 22', 'Oct 29', 'Nov 5', 'Nov 12', 'Nov 19'],
    datasets: [
      {
        label: 'Opens',
        data: [320, 420, 380, 490, 550, 450],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Clicks',
        data: [120, 150, 130, 180, 200, 160],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4,
      }
    ]
  };
  
  const deviceChartData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [45, 40, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%'
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Welcome back, {user?.firstName || 'User'}! Here's what's happening with your emails.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/dashboard/campaigns/create" className="btn btn-primary">
            Create Campaign
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center justify-center">
              <FiMail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaigns</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCampaigns}</p>
                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">total</p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Last campaign sent</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {recentCampaigns[0]?.sentDate ? formatDate(recentCampaigns[0].sentDate) : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-md flex items-center justify-center">
              <FiUsers className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contacts</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalContacts.toLocaleString()}</p>
                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">subscribers</p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link to="/dashboard/contacts" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center">
              <span>Manage contacts</span>
              <FiArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
              <FiSend className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Emails Sent</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalSent.toLocaleString()}</p>
                <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">all time</p>
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. open rate</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{stats.openRate}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Engagement Over Time</h3>
            <div className="relative">
              <select className="form-select block w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <Line data={engagementChartData} options={lineChartOptions} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Device Breakdown</h3>
          </div>
          <div className="h-64">
            <Doughnut data={deviceChartData} options={doughnutChartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">45%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Desktop</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">40%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mobile</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">15%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tablet</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Campaigns */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="card mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Campaigns</h3>
          <Link to="/dashboard/campaigns" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center">
            <span>View all</span>
            <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/dashboard/campaigns/${campaign.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
                      {campaign.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.status === 'completed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <FiCheckCircle className="mr-1 h-3 w-3" />
                        Completed
                      </span>
                    ) : campaign.status === 'scheduled' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        <FiActivity className="mr-1 h-3 w-3" />
                        Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <FiAlertCircle className="mr-1 h-3 w-3" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {campaign.status === 'scheduled' ? (
                      <span>Scheduled for {formatDate(campaign.scheduledDate)}</span>
                    ) : (
                      <span>Sent {formatDate(campaign.sentDate)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.status === 'completed' ? (
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="flex items-center">
                            <FiPieChart className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats.openRate}%</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Open rate</p>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <FiBarChart2 className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats.clickRate}%</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Click rate</p>
                        </div>
                      </div>
                    ) : campaign.status === 'scheduled' ? (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.stats.recipients} recipients
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Not sent yet
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/campaigns/create" className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <FiMail className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-3" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Create Campaign</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              Design and send a new email campaign
            </p>
          </Link>
          
          <Link to="/dashboard/contacts" className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <FiUsers className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Manage Contacts</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              Add, import or segment your contacts
            </p>
          </Link>
          
          <Link to="/dashboard/ai-assistant" className="flex flex-col items-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <FiActivity className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-3" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">AI Assistant</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
              Generate content with our AI assistant
            </p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;