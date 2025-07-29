import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { FiArrowLeft, FiCopy, FiDownload, FiExternalLink, FiEye, FiMail, FiRefreshCw, FiUsers, FiCheckCircle, FiX, FiAlertTriangle } from 'react-icons/fi';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock campaign data
        const mockCampaign = {
          id,
          name: 'Monthly Newsletter',
          subject: 'Your Monthly Update - June 2023',
          sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          stats: {
            sent: 1245,
            delivered: 1230,
            opened: 432,
            clicked: 187,
            bounced: 15,
            complained: 2,
            unsubscribed: 8,
            openRate: 34.7,
            clickRate: 15.0,
            bounceRate: 1.2,
            unsubRate: 0.6
          },
          content: `
            <h1>Monthly Newsletter</h1>
            <p>Hello {{firstName}},</p>
            <p>Welcome to our monthly newsletter. We have some exciting updates to share with you!</p>
            <h2>Latest Updates</h2>
            <ul>
              <li>New product launch</li>
              <li>Upcoming events</li>
              <li>Team spotlight</li>
            </ul>
            <p>Thank you for being a valued subscriber!</p>
          `,
          recipients: {
            total: 1245,
            segments: [
              { name: 'Active Subscribers', count: 845 },
              { name: 'New Customers', count: 400 }
            ]
          },
          activityLog: [
            { type: 'created', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), user: 'John Doe' },
            { type: 'updated', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), user: 'John Doe' },
            { type: 'scheduled', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), user: 'Jane Smith' },
            { type: 'sent', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), user: 'System' }
          ]
        };
        
        setCampaign(mockCampaign);
      } catch (error) {
        console.error('Failed to fetch campaign:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
  }, [id]);
  
  const engagementChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Opens',
        data: [210, 120, 50, 20, 15, 10, 7],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Clicks',
        data: [95, 60, 15, 8, 5, 3, 1],
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
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">The campaign you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard/campaigns" className="btn btn-primary">
          Back to Campaigns
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <Link to="/dashboard/campaigns" className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.name}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {campaign.subject}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="btn btn-outline flex items-center">
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="btn btn-primary flex items-center">
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Campaign Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            {campaign.status === 'completed' ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <FiCheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Campaign Sent</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sent on {formatDate(campaign.sentDate)}
                  </p>
                </div>
              </div>
            ) : campaign.status === 'scheduled' ? (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                  <FiMail className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Campaign Scheduled</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Will be sent on {formatDate(campaign.scheduledDate)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-4">
                  <FiAlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Draft Campaign</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Not scheduled or sent yet
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center">
              <div className="flex items-center mr-6">
                <FiUsers className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Recipients</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{campaign.stats?.sent?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="flex items-center">
                <FiEye className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Open Rate</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{campaign.stats?.openRate || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sent</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{campaign.stats?.sent?.toLocaleString() || 0}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats?.delivered?.toLocaleString() || 0}</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Opened</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{campaign.stats?.opened?.toLocaleString() || 0}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Open Rate</p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{campaign.stats?.openRate || 0}%</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clicked</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{campaign.stats?.clicked?.toLocaleString() || 0}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Click Rate</p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{campaign.stats?.clickRate || 0}%</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issues</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {((campaign.stats?.bounced || 0) + (campaign.stats?.complained || 0)).toLocaleString()}
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Bounced</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats?.bounced?.toLocaleString() || 0}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Complaints</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats?.complained?.toLocaleString() || 0}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Engagement Over Time</h3>
          <div className="h-80">
            <Line data={engagementChartData} options={lineChartOptions} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
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
      
      {/* Campaign Content Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Content</h3>
          <div className="flex space-x-2">
            <button className="btn btn-outline btn-sm flex items-center">
              <FiCopy className="mr-2 h-4 w-4" />
              Copy HTML
            </button>
            <button className="btn btn-primary btn-sm flex items-center">
              <FiExternalLink className="mr-2 h-4 w-4" />
              View Full Email
            </button>
          </div>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-96">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: campaign.content }}
          />
        </div>
      </motion.div>
      
      {/* Recipients & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recipients</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 dark:text-gray-400">Total Recipients</p>
              <p className="font-medium text-gray-900 dark:text-white">{campaign.recipients?.total?.toLocaleString() || 0}</p>
            </div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Segments</h4>
            <div className="space-y-2">
              {campaign.recipients?.segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{segment.name}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{segment.count?.toLocaleString() || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Log</h3>
          <div className="space-y-4">
            {campaign.activityLog.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'created' && <FiMail className="h-5 w-5 text-blue-500" />}
                  {activity.type === 'updated' && <FiRefreshCw className="h-5 w-5 text-green-500" />}
                  {activity.type === 'scheduled' && <FiCopy className="h-5 w-5 text-purple-500" />}
                  {activity.type === 'sent' && <FiCheckCircle className="h-5 w-5 text-green-500" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Campaign {activity.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.user} • {formatDate(activity.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampaignDetail;