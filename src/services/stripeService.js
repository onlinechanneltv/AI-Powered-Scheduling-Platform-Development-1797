class StripeService {
  async createSubscription(priceId, customerId) {
    console.log('Creating subscription:', { priceId, customerId });
    return { 
      success: true, 
      subscriptionId: 'sub_mock_123',
      paymentIntent: { id: 'pi_mock_123' }
    };
  }

  async createCustomer(email, name) {
    console.log('Creating customer:', { email, name });
    return { id: 'cus_mock_123', email, name };
  }

  async updateSubscription(subscriptionId, newPriceId) {
    console.log('Updating subscription:', { subscriptionId, newPriceId });
    return { id: subscriptionId, price_id: newPriceId };
  }

  async cancelSubscription(subscriptionId) {
    console.log('Canceling subscription:', subscriptionId);
    return { id: subscriptionId, status: 'canceled' };
  }

  async getInvoices(customerId) {
    return [
      { id: 'inv_001', date: '2024-01-01', amount: 12, status: 'paid' },
      { id: 'inv_002', date: '2023-12-01', amount: 12, status: 'paid' },
      { id: 'inv_003', date: '2023-11-01', amount: 12, status: 'paid' }
    ];
  }

  async createPaymentMethod(cardElement) {
    console.log('Creating payment method');
    return { 
      success: true, 
      paymentMethod: { id: 'pm_mock_123' }
    };
  }

  getPricingPlans() {
    return [
      {
        id: 'basic',
        name: 'Basic',
        price: 0,
        priceId: null,
        features: [
          'Up to 5 event types',
          'Basic calendar integration',
          'Email notifications',
          'Standard support'
        ]
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 12,
        priceId: 'price_pro_monthly',
        features: [
          'Unlimited event types',
          'Advanced integrations',
          'AI scheduling assistance',
          'Custom branding',
          'Priority support',
          '2FA security'
        ]
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 25,
        priceId: 'price_enterprise_monthly',
        features: [
          'Everything in Pro',
          'Team management',
          'Advanced analytics',
          'API access',
          'SSO integration',
          'Dedicated support'
        ]
      }
    ];
  }
}

export const stripeService = new StripeService();