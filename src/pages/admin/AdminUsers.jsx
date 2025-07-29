import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiSearch, FiFilter, FiMoreHorizontal, FiEdit, FiTrash2, FiMail, FiShield, FiPlus, FiX, FiCheck, FiBan } = FiIcons;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    loadUsers();
    loadPlans();
  }, [selectedFilter, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters = {
        status: selectedFilter === 'all' ? null : selectedFilter,
        search: searchTerm || null
      };
      const userData = await adminService.getUsers(filters);
      setUsers(userData);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const plansData = await adminService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to load plans:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const result = await adminService.createUser(userData);
      if (result.success) {
        toast.success('User created successfully');
        setShowCreateModal(false);
        loadUsers();
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const result = await adminService.updateUser(userId, updates);
      if (result.success) {
        toast.success('User updated successfully');
        setShowEditModal(false);
        setSelectedUser(null);
        loadUsers();
      } else {
        toast.error(result.error || 'Failed to update user');
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await adminService.deleteUser(userId);
      if (result.success) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      const result = await adminService.suspendUser(userId);
      if (result.success) {
        toast.success('User suspended successfully');
        loadUsers();
      } else {
        toast.error(result.error || 'Failed to suspend user');
      }
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      const result = await adminService.reactivateUser(userId);
      if (result.success) {
        toast.success('User reactivated successfully');
        loadUsers();
      } else {
        toast.error(result.error || 'Failed to reactivate user');
      }
    } catch (error) {
      toast.error('Failed to reactivate user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_metadata?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_metadata?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || user.subscription_status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Basic': return 'bg-blue-100 text-blue-800';
      case 'Pro': return 'bg-purple-100 text-purple-800';
      case 'Enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, subscriptions, and access</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Plan</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Meetings</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Joined</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Last Active</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {(user.user_metadata?.first_name?.charAt(0) || '') + (user.user_metadata?.last_name?.charAt(0) || '')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPlanColor(user.plan_name)}`}>
                        {user.plan_name || 'Basic'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(user.subscription_status)}`}>
                        {user.subscription_status || 'active'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-medium">{user.total_meetings || 0}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">
                        {user.created_at ? format(new Date(user.created_at), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">
                        {user.last_activity ? format(new Date(user.last_activity), 'MMM d, yyyy') : 'Never'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit user"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Send email"
                        >
                          <SafeIcon icon={FiMail} className="w-4 h-4" />
                        </button>
                        {user.subscription_status === 'suspended' ? (
                          <button
                            onClick={() => handleReactivateUser(user.id)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Reactivate user"
                          >
                            <SafeIcon icon={FiCheck} className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title="Suspend user"
                          >
                            <SafeIcon icon={FiBan} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          plans={plans}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          plans={plans}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSubmit={(updates) => handleUpdateUser(selectedUser.id, updates)}
        />
      )}
    </div>
  );
};

// Create User Modal Component
const CreateUserModal = ({ plans, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    planId: 'basic'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan
            </label>
            <select
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal Component  
const EditUserModal = ({ user, plans, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: user.user_metadata?.first_name || '',
    lastName: user.user_metadata?.last_name || '',
    email: user.email,
    role: user.user_metadata?.role || 'user',
    planId: user.plan_id || 'basic',
    status: user.subscription_status || 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan
            </label>
            <select
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Update User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUsers;