import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPlus, FiFilter, FiSearch, FiChevronDown, FiCheckCircle, FiAlertTriangle, FiClock } from 'react-icons/fi';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    // Mock API call to get campaigns
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock campaign data
        const mockCampaigns = [
          {
            id: 'c1',
            name: 'Monthly Newsletter',
            subject: 'Your Monthly Update - June 2023',
            sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
            subject: 'Introducing our New Product Line!',
            sentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
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
            subject: 'Early Access: Black Friday Deals Inside',
            sentDate: null,
            status: 'scheduled',
            scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            stats: {
              recipients: 3200
            }
          },
          {
            id: 'c4',
            name: 'Customer Feedback Survey',
            subject: 'We Value Your Opinion',
            sentDate: null,
            status: 'draft',
            stats: {}
          },
          {
            id: 'c5',
            name: 'Summer Sale Announcement',
            subject: 'Hot Summer Deals Inside!',
            sentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            stats: {
              sent: 1800,
              opened: 720,
              clicked: 252,
              openRate: 40.0,
              clickRate: 14.0
            }
          }
        ];
        
        setCampaigns(mockCampaigns);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <FiCheckCircle className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <FiClock className="mr-1 h-3 w-3" />
            Scheduled
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <FiAlertTriangle className="mr-1 h-3 w-3" />
            Draft
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not sent';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Create, manage, and track your email campaigns
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/dashboard/campaigns/create" className="btn btn-primary inline-flex items-center">
            <FiPlus className="mr-2" />
            Create Campaign
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search campaigns..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <button className="w-full md:w-auto btn btn-outline inline-flex items-center">
              <FiFilter className="mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Campaigns List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiMail className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No campaigns found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' ? 
                'Try adjusting your search or filters' : 
                'Create your first campaign to get started'}
            </p>
            <Link to="/dashboard/campaigns/create" className="btn btn-primary">
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stats
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCampaigns.map((campaign, index) => (
                  <motion.tr
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Link to={`/dashboard/campaigns/${campaign.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                          {campaign.name}
                        </Link>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {campaign.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {campaign.status === 'scheduled' ? (
                        <span>Scheduled for {formatDate(campaign.scheduledDate)}</span>
                      ) : (
                        <span>{formatDate(campaign.sentDate)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.status === 'completed' ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Open rate</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats.openRate}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Click rate</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{campaign.stats.clickRate}%</span>
                          </div>
                        </div>
                      ) : campaign.status === 'scheduled' ? (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {campaign.stats.recipients?.toLocaleString()} recipients
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Not sent yet
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Campaigns;