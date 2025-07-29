import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit, FiTrash2, FiMail, FiTag, FiClock, FiList, FiEye, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';

const ContactDetail = () => {
  const { id } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');

  useEffect(() => {
    // Mock API call to get contact details
    const fetchContact = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock contact data
        const mockContact = {
          id,
          email: 'johndoe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          status: 'active',
          tags: ['customer', 'newsletter'],
          created: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
          lastActivity: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
          customFields: {
            company: 'Acme Inc.',
            jobTitle: 'Marketing Manager',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, Anytown, USA'
          },
          activities: [
            {
              id: 'act-1',
              type: 'email_opened',
              campaign: 'Monthly Newsletter',
              date: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
              details: { device: 'iPhone', location: 'New York, USA' }
            },
            {
              id: 'act-2',
              type: 'email_clicked',
              campaign: 'Monthly Newsletter',
              date: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) + (5 * 60 * 1000)).toISOString(),
              details: { link: 'https://example.com/promo', device: 'iPhone' }
            },
            {
              id: 'act-3',
              type: 'form_submitted',
              campaign: 'Contact Form',
              date: new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)).toISOString(),
              details: { form: 'Contact Us', fields: 4 }
            }
          ],
          campaigns: [
            {
              id: 'camp-1',
              name: 'Monthly Newsletter',
              date: new Date(Date.now() - (2 * 24 * 60 * 60 * 1000)).toISOString(),
              status: 'sent',
              opened: true,
              clicked: true
            },
            {
              id: 'camp-2',
              name: 'Product Launch',
              date: new Date(Date.now() - (15 * 24 * 60 * 60 * 1000)).toISOString(),
              status: 'sent',
              opened: true,
              clicked: false
            },
            {
              id: 'camp-3',
              name: 'Webinar Invitation',
              date: new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
              status: 'sent',
              opened: false,
              clicked: false
            }
          ]
        };
        
        setContact(mockContact);
      } catch (error) {
        console.error('Failed to fetch contact:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContact();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'email_opened': return FiEye;
      case 'email_clicked': return FiClock;
      case 'form_submitted': return FiList;
      default: return FiActivity;
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'email_opened':
        return `Opened email "${activity.campaign}" using ${activity.details.device} in ${activity.details.location}`;
      case 'email_clicked':
        return `Clicked link in "${activity.campaign}" using ${activity.details.device}`;
      case 'form_submitted':
        return `Submitted the ${activity.details.form} form with ${activity.details.fields} fields`;
      default:
        return `Performed ${activity.type}`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">The contact you're looking for doesn't exist or has been deleted.</p>
        <Link to="/dashboard/contacts" className="btn btn-primary">
          Back to Contacts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center">
          <Link to="/dashboard/contacts" className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{contact.firstName} {contact.lastName}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {contact.email}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="btn btn-outline inline-flex items-center">
            <FiEdit className="mr-2 h-4 w-4" />
            Edit
          </button>
          <button className="btn btn-outline inline-flex items-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
            <FiTrash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                contact.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Added</span>
              <span className="text-gray-900 dark:text-white">{formatDate(contact.created).split(',')[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Last Activity</span>
              <span className="text-gray-900 dark:text-white">{formatDate(contact.lastActivity).split(',')[0]}</span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {tag}
                  </span>
                ))}
                <button className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  <FiTag className="mr-1 h-3 w-3" />
                  Add Tag
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2"
        >
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'activity'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'campaigns'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Campaigns
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'custom'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Custom Fields
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
                {contact.activities.length > 0 ? (
                  <div className="space-y-4">
                    {contact.activities.map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <ActivityIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {getActivityDescription(activity)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No recent activity.</p>
                )}
              </div>
            )}
            
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaigns</h2>
                {contact.campaigns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead>
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Campaign
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Opened
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Clicked
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {contact.campaigns.map((campaign) => (
                          <tr key={campaign.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/dashboard/campaigns/${campaign.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                {campaign.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(campaign.date).split(',')[0]}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                {campaign.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {campaign.opened ? (
                                <FiCheck className="h-5 w-5 text-green-500" />
                              ) : (
                                <FiX className="h-5 w-5 text-red-500" />
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {campaign.clicked ? (
                                <FiCheck className="h-5 w-5 text-green-500" />
                              ) : (
                                <FiX className="h-5 w-5 text-red-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No campaigns.</p>
                )}
              </div>
            )}
            
            {activeTab === 'custom' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Fields</h2>
                  <button className="btn btn-outline btn-sm">
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit Fields
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(contact.customFields).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">{key}</p>
                      <p className="text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Send Email Button */}
      <div className="fixed bottom-8 right-8">
        <button className="btn btn-primary rounded-full shadow-lg p-4 flex items-center justify-center">
          <FiMail className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ContactDetail;