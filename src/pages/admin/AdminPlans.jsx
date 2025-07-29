import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiDollarSign, FiUsers, FiSettings } = FiIcons;

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await adminService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to load plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (planData) => {
    try {
      const result = await adminService.createPlan(planData);
      if (result.success) {
        toast.success('Plan created successfully');
        setShowCreateModal(false);
        loadPlans();
      } else {
        toast.error(result.error || 'Failed to create plan');
      }
    } catch (error) {
      toast.error('Failed to create plan');
    }
  };

  const handleUpdatePlan = async (planId, updates) => {
    try {
      const result = await adminService.updatePlan(planId, updates);
      if (result.success) {
        toast.success('Plan updated successfully');
        setShowEditModal(false);
        setSelectedPlan(null);
        loadPlans();
      } else {
        toast.error(result.error || 'Failed to update plan');
      }
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await adminService.deletePlan(planId);
      if (result.success) {
        toast.success('Plan deleted successfully');
        loadPlans();
      } else {
        toast.error(result.error || 'Failed to delete plan');
      }
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600 mt-1">Manage pricing plans and features</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${
                plan.name === 'Pro' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              {plan.name === 'Pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ${plan.price}
                  {plan.price > 0 && (
                    <span className="text-lg font-normal text-gray-600">
                      /{plan.billing_interval}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Max Events</span>
                  <span className="font-medium">
                    {plan.max_events === -1 ? 'Unlimited' : plan.max_events}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Integrations</span>
                  <span className="font-medium">
                    {plan.max_integrations === -1 ? 'Unlimited' : plan.max_integrations}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Support</span>
                  <span className="font-medium capitalize">{plan.support_level}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features?.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${plan.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm text-gray-600">
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit plan"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete plan"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <PlanModal
          title="Create New Plan"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePlan}
        />
      )}

      {/* Edit Plan Modal */}
      {showEditModal && selectedPlan && (
        <PlanModal
          title="Edit Plan"
          plan={selectedPlan}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlan(null);
          }}
          onSubmit={(updates) => handleUpdatePlan(selectedPlan.id, updates)}
        />
      )}
    </div>
  );
};

// Plan Modal Component
const PlanModal = ({ title, plan, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price || 0,
    billingInterval: plan?.billing_interval || 'monthly',
    maxEvents: plan?.max_events || 50,
    maxIntegrations: plan?.max_integrations || 3,
    supportLevel: plan?.support_level || 'email',
    features: plan?.features || ['Basic features'],
    isActive: plan?.is_active ?? true,
    stripePriceId: plan?.stripe_price_id || ''
  });
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Interval
              </label>
              <select
                value={formData.billingInterval}
                onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Events
              </label>
              <input
                type="number"
                value={formData.maxEvents === -1 ? '' : formData.maxEvents}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maxEvents: e.target.value === '' ? -1 : parseInt(e.target.value) || 0 
                })}
                placeholder="Unlimited"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Integrations
              </label>
              <input
                type="number"
                value={formData.maxIntegrations === -1 ? '' : formData.maxIntegrations}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  maxIntegrations: e.target.value === '' ? -1 : parseInt(e.target.value) || 0 
                })}
                placeholder="Unlimited"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Level
              </label>
              <select
                value={formData.supportLevel}
                onChange={(e) => setFormData({ ...formData, supportLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="email">Email Support</option>
                <option value="priority">Priority Support</option>
                <option value="dedicated">Dedicated Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stripe Price ID
              </label>
              <input
                type="text"
                value={formData.stripePriceId}
                onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="price_..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="space-y-2 mb-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                  <span className="flex-1 text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add new feature"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Plan is active
            </label>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {plan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPlans;