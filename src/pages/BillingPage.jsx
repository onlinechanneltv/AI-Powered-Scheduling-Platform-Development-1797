import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/ui/Button';
import { stripeService } from '../services/stripeService';

const { FiCreditCard, FiCheck, FiDownload, FiStar } = FiIcons;

const BillingPage = () => {
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [billing, setBilling] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  
  const plans = stripeService.getPricingPlans();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      // Mock customer ID - in real app, get from user context
      const customerInvoices = await stripeService.getInvoices('customer-id');
      setInvoices(customerInvoices);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      setLoading(true);
      
      // In a real app, you'd handle the Stripe subscription flow here
      console.log(`Upgrading to ${planId}`);
      
      // Mock successful upgrade
      setCurrentPlan(planId);
    } catch (error) {
      console.error('Failed to upgrade:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanPrice = (plan) => {
    if (billing === 'yearly') {
      return Math.floor(plan.price * 12 * 0.8); // 20% discount for yearly
    }
    return plan.price;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiStar} className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">{currentPlan} Plan</h3>
              <p className="text-gray-600">
                {currentPlan === 'basic' ? 'Free Forever' : `$${plans.find(p => p.id === currentPlan)?.price || 0}/month`}
              </p>
            </div>
          </div>
          
          {currentPlan !== 'enterprise' && (
            <Button>
              Upgrade Plan
            </Button>
          )}
        </div>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billing === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billing === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              20% off
            </span>
          </button>
        </div>
      </motion.div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm border-2 p-6 relative ${
              plan.id === 'pro'
                ? 'border-primary-500 ring-2 ring-primary-100'
                : 'border-gray-200'
            } ${currentPlan === plan.id ? 'bg-primary-50' : ''}`}
          >
            {plan.id === 'pro' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ${getPlanPrice(plan)}
                {plan.price > 0 && (
                  <span className="text-lg font-normal text-gray-600">
                    /{billing === 'yearly' ? 'year' : 'month'}
                  </span>
                )}
              </div>
              {billing === 'yearly' && plan.price > 0 && (
                <p className="text-sm text-gray-600">
                  ${plan.price * 12} billed annually
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-3">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handleUpgrade(plan.id)}
              loading={loading}
              disabled={currentPlan === plan.id}
              variant={plan.id === 'pro' ? 'primary' : 'outline'}
              className="w-full"
            >
              {currentPlan === plan.id ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
          <Button variant="outline">
            Update Payment
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
            <SafeIcon icon={FiCreditCard} className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
            <p className="text-sm text-gray-600">Expires 12/25</p>
          </div>
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing History</h2>
        
        <div className="space-y-4">
          {/* Mock invoices */}
          {[
            { id: 'inv_001', date: '2024-01-01', amount: 12, status: 'paid' },
            { id: 'inv_002', date: '2023-12-01', amount: 12, status: 'paid' },
            { id: 'inv_003', date: '2023-11-01', amount: 12, status: 'paid' }
          ].map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Professional Plan</p>
                <p className="text-sm text-gray-600">{invoice.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">${invoice.amount}</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Paid
                </span>
                <Button variant="outline" size="sm">
                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BillingPage;