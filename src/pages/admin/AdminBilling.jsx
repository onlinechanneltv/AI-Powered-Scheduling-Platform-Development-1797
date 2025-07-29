import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const { FiDollarSign, FiTrendingUp, FiUsers, FiRefreshCw, FiDownload, FiSearch, FiFilter } = FiIcons;

const AdminBilling = () => {
  const [billingData, setBillingData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadBillingData();
    loadRevenueData();
    loadStats();
  }, []);

  const loadBillingData = async () => {
    try {
      const data = await adminService.getBillingData({ status: statusFilter });
      setBillingData(data);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    }
  };

  const loadRevenueData = async () => {
    try {
      const data = await adminService.getRevenueData('30d');
      setRevenueData(data);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (subscriptionId) => {
    const amount = prompt('Enter refund amount:');
    const reason = prompt('Enter refund reason:');
    
    if (amount && reason) {
      try {
        const result = await adminService.processRefund(subscriptionId, parseFloat(amount), reason);
        if (result.success) {
          toast.success('Refund processed successfully');
          loadBillingData();
        } else {
          toast.error(result.error || 'Failed to process refund');
        }
      } catch (error) {
        toast.error('Failed to process refund');
      }
    }
  };

  const filteredBilling = billingData.filter(item => {
    const matchesSearch = item.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.plan_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
          <p className="text-gray-600 mt-1">Monitor revenue, subscriptions, and payments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadBillingData}>
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${stats.revenue?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-green-600 mt-1">+{stats.revenueGrowth || 0}% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.activeUsers?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-blue-600 mt-1">+{stats.userGrowth || 0}% this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${Math.round((stats.revenue || 0) * 0.8).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-1">+15% this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.churnRate || 0}%</p>
              <p className="text-sm text-green-600 mt-1">-0.5% this month</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiRefreshCw} className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Billing Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Plan</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
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
              ) : filteredBilling.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    No billing data found
                  </td>
                </tr>
              ) : (
                filteredBilling.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {item.user_email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{item.user_email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{item.plan_name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">${item.amount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">
                        {format(new Date(item.created_at), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {item.status === 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefund(item.id)}
                          >
                            Refund
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminBilling;