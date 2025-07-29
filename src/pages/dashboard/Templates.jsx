import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiEdit, FiTrash2, FiCopy } from 'react-icons/fi';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Mock API call to get templates
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock template data
        const mockTemplates = [
          {
            id: 'tpl-1',
            name: 'Welcome Email',
            description: 'Welcome new subscribers to your newsletter',
            category: 'newsletter',
            thumbnail: 'https://via.placeholder.com/300x200?text=Welcome+Email',
            lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'tpl-2',
            name: 'Product Announcement',
            description: 'Announce a new product or feature',
            category: 'marketing',
            thumbnail: 'https://via.placeholder.com/300x200?text=Product+Announcement',
            lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'tpl-3',
            name: 'Monthly Newsletter',
            description: 'Monthly updates and news for your subscribers',
            category: 'newsletter',
            thumbnail: 'https://via.placeholder.com/300x200?text=Monthly+Newsletter',
            lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'tpl-4',
            name: 'Special Offer',
            description: 'Promote a limited-time discount or special offer',
            category: 'marketing',
            thumbnail: 'https://via.placeholder.com/300x200?text=Special+Offer',
            lastModified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'tpl-5',
            name: 'Event Invitation',
            description: 'Invite subscribers to an upcoming event',
            category: 'event',
            thumbnail: 'https://via.placeholder.com/300x200?text=Event+Invitation',
            lastModified: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'tpl-6',
            name: 'Feedback Request',
            description: 'Ask subscribers for feedback on your product or service',
            category: 'feedback',
            thumbnail: 'https://via.placeholder.com/300x200?text=Feedback+Request',
            lastModified: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  const handleDuplicateTemplate = (templateId) => {
    const templateToDuplicate = templates.find(template => template.id === templateId);
    if (templateToDuplicate) {
      const duplicatedTemplate = {
        ...templateToDuplicate,
        id: `tpl-${Date.now()}`,
        name: `${templateToDuplicate.name} (Copy)`,
        lastModified: new Date().toISOString()
      };
      
      setTemplates([duplicatedTemplate, ...templates]);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== templateId));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'newsletter', name: 'Newsletter' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'event', name: 'Event' },
    { id: 'feedback', name: 'Feedback' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Create and manage your email templates
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/dashboard/templates/create" className="btn btn-primary inline-flex items-center">
            <FiPlus className="mr-2 h-4 w-4" />
            Create Template
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
                placeholder="Search templates..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <FiGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              <FiList className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Templates */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <FiFilter className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No templates found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchTerm || selectedCategory !== 'all' ? 
              'Try adjusting your search or filters' : 
              'Create your first template to get started'}
          </p>
          <Link to="/dashboard/templates/create" className="btn btn-primary">
            Create Template
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 p-2 flex space-x-1">
                  <button
                    onClick={() => handleDuplicateTemplate(template.id)}
                    className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm"
                    title="Duplicate template"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="p-1.5 bg-white dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 shadow-sm"
                    title="Delete template"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <Link
                  to={`/dashboard/templates/${template.id}`}
                  className="block text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-1"
                >
                  {template.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last edited {formatDate(template.lastModified)}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {template.category}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/dashboard/templates/${template.id}/edit`}
                  className="w-full btn btn-outline inline-flex items-center justify-center"
                >
                  <FiEdit className="mr-2 h-4 w-4" />
                  Edit Template
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Template
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTemplates.map((template, index) => (
                  <motion.tr
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                          <img
                            src={template.thumbnail}
                            alt=""
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/dashboard/templates/${template.id}`}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {template.name}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {template.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(template.lastModified)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/dashboard/templates/${template.id}/edit`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicateTemplate(template.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <FiCopy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Templates;