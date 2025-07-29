import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiUpload, FiUserPlus, FiMail, FiTrash2, FiEdit, FiCheck, FiX } from 'react-icons/fi';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    // Mock API call to get contacts
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock contact data
        const mockContacts = Array(15).fill().map((_, index) => ({
          id: `c-${index + 1}`,
          email: `user${index + 1}@example.com`,
          firstName: ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emily'][index % 6],
          lastName: ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][index % 6],
          status: ['active', 'active', 'active', 'inactive', 'unsubscribed'][index % 5],
          tags: [
            ['customer', 'newsletter'],
            ['prospect', 'webinar'],
            ['newsletter'],
            ['customer', 'product-update'],
            ['prospect']
          ][index % 5],
          created: new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000)).toISOString(),
          lastActivity: index % 3 === 0 ? new Date(Date.now() - (index * 60 * 60 * 1000)).toISOString() : null
        }));
        
        setContacts(mockContacts);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(contact => contact.id));
      setShowBulkActions(true);
    } else {
      setSelectedContacts([]);
      setShowBulkActions(false);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => {
      const isSelected = prev.includes(contactId);
      const newSelection = isSelected
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedContacts.length} contacts?`)) {
      setContacts(prev => prev.filter(contact => !selectedContacts.includes(contact.id)));
      setSelectedContacts([]);
      setShowBulkActions(false);
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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || contact.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <FiCheck className="mr-1 h-3 w-3" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <FiX className="mr-1 h-3 w-3" />
            Inactive
          </span>
        );
      case 'unsubscribed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            <FiMail className="mr-1 h-3 w-3" />
            Unsubscribed
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your contacts and subscribers
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn btn-outline inline-flex items-center"
          >
            <FiUpload className="mr-2 h-4 w-4" />
            Import
          </button>
          <Link to="/dashboard/contacts/create" className="btn btn-primary inline-flex items-center">
            <FiUserPlus className="mr-2 h-4 w-4" />
            Add Contact
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
                placeholder="Search contacts..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button className="btn btn-outline inline-flex items-center">
              <FiFilter className="mr-2 h-4 w-4" />
              Filter
            </button>
            <button className="btn btn-outline inline-flex items-center">
              <FiDownload className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800/30 p-4 mb-6 flex items-center justify-between"
        >
          <div className="flex items-center">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {selectedContacts.length} contacts selected
            </span>
          </div>
          <div className="flex space-x-3">
            <button className="btn btn-outline inline-flex items-center">
              Add Tag
            </button>
            <button 
              className="btn btn-outline inline-flex items-center text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              onClick={handleBulkDelete}
            >
              <FiTrash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Contacts Table */}
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
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiMail className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No contacts found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || selectedFilter !== 'all' ? 
                'Try adjusting your search or filters' : 
                'Add your first contact to get started'}
            </p>
            <Link to="/dashboard/contacts/create" className="btn btn-primary">
              Add Contact
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        onChange={handleSelectAll}
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContacts.map((contact, index) => (
                  <motion.tr
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => handleSelectContact(contact.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <Link to={`/dashboard/contacts/${contact.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                          {contact.firstName} {contact.lastName}
                        </Link>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(contact.created)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contact.lastActivity ? formatDate(contact.lastActivity) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{filteredContacts.length}</span> of <span className="font-medium">{contacts.length}</span> contacts
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline text-sm py-1 px-3">
            Previous
          </button>
          <button className="btn btn-outline text-sm py-1 px-3">
            Next
          </button>
        </div>
      </div>
      
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowImportModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Import Contacts
                </h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload a CSV file with your contacts. The file should have the following headers: email, first_name, last_name.
                </p>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop a file here, or click to browse
                  </p>
                  <input type="file" className="hidden" />
                  <button className="mt-4 btn btn-outline">
                    Browse Files
                  </button>
                </div>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Maximum file size: 10MB. Supported formats: .csv
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowImportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;