import { supabase } from '../lib/supabase';

class AdminService {
  // ============ USER MANAGEMENT ============
  async getUsers(filters = {}) {
    try {
      let query = supabase.from('users_admin_view').select(`
        id,
        email,
        user_metadata,
        created_at,
        last_sign_in_at,
        email_confirmed_at,
        plan_id,
        plan_name,
        subscription_status,
        total_meetings,
        last_activity
      `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.plan) {
        query = query.eq('plan_id', filters.plan);
      }
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,user_metadata->>first_name.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return this.getMockUsers(filters);
    }
  }

  async createUser(userData) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'user',
          plan_id: userData.planId || 'basic'
        }
      });

      if (error) throw error;

      // Create user profile
      await this.createUserProfile(data.user.id, userData);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Failed to create user:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        email: updates.email,
        user_metadata: {
          first_name: updates.firstName,
          last_name: updates.lastName,
          role: updates.role,
          plan_id: updates.planId
        }
      });

      if (error) throw error;

      // Update user profile
      await supabase
        .from('user_profiles_admin')
        .update({
          plan_id: updates.planId,
          status: updates.status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Failed to update user:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteUser(userId) {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to delete user:', error);
      return { success: false, error: error.message };
    }
  }

  async suspendUser(userId) {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: '876000h' // 100 years
      });

      if (error) throw error;

      await supabase
        .from('user_profiles_admin')
        .update({ status: 'suspended' })
        .eq('user_id', userId);

      return { success: true };
    } catch (error) {
      console.error('Failed to suspend user:', error);
      return { success: false, error: error.message };
    }
  }

  async reactivateUser(userId) {
    try {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: 'none'
      });

      if (error) throw error;

      await supabase
        .from('user_profiles_admin')
        .update({ status: 'active' })
        .eq('user_id', userId);

      return { success: true };
    } catch (error) {
      console.error('Failed to reactivate user:', error);
      return { success: false, error: error.message };
    }
  }

  // ============ PLAN MANAGEMENT ============
  async getPlans() {
    try {
      const { data, error } = await supabase
        .from('subscription_plans_admin')
        .select('*')
        .order('price', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get plans:', error);
      return this.getMockPlans();
    }
  }

  async createPlan(planData) {
    try {
      const { data, error } = await supabase
        .from('subscription_plans_admin')
        .insert({
          name: planData.name,
          description: planData.description,
          price: planData.price,
          billing_interval: planData.billingInterval,
          features: planData.features,
          max_events: planData.maxEvents,
          max_integrations: planData.maxIntegrations,
          support_level: planData.supportLevel,
          is_active: true,
          stripe_price_id: planData.stripePriceId
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, plan: data };
    } catch (error) {
      console.error('Failed to create plan:', error);
      return { success: false, error: error.message };
    }
  }

  async updatePlan(planId, updates) {
    try {
      const { data, error } = await supabase
        .from('subscription_plans_admin')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, plan: data };
    } catch (error) {
      console.error('Failed to update plan:', error);
      return { success: false, error: error.message };
    }
  }

  async deletePlan(planId) {
    try {
      // Check if plan has active users
      const { data: users, error: userError } = await supabase
        .from('user_profiles_admin')
        .select('id')
        .eq('plan_id', planId)
        .limit(1);

      if (userError) throw userError;

      if (users && users.length > 0) {
        return { success: false, error: 'Cannot delete plan with active users' };
      }

      const { error } = await supabase
        .from('subscription_plans_admin')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Failed to delete plan:', error);
      return { success: false, error: error.message };
    }
  }

  // ============ ANALYTICS & REPORTING ============
  async getDashboardStats() {
    try {
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) throw error;
      return data || this.getMockStats();
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      return this.getMockStats();
    }
  }

  async getRevenueData(period = '30d') {
    try {
      const { data, error } = await supabase.rpc('get_revenue_data', { period });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get revenue data:', error);
      return this.getMockRevenueData();
    }
  }

  async getUserGrowthData(period = '30d') {
    try {
      const { data, error } = await supabase.rpc('get_user_growth_data', { period });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get user growth data:', error);
      return this.getMockUserGrowthData();
    }
  }

  // ============ SYSTEM MANAGEMENT ============
  async getSystemHealth() {
    try {
      const { data, error } = await supabase.rpc('get_system_health');
      
      if (error) throw error;
      return data || this.getMockSystemHealth();
    } catch (error) {
      console.error('Failed to get system health:', error);
      return this.getMockSystemHealth();
    }
  }

  async getAuditLogs(filters = {}) {
    try {
      let query = supabase
        .from('audit_logs_admin')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      return this.getMockAuditLogs();
    }
  }

  async updateSystemSettings(settings) {
    try {
      const { data, error } = await supabase
        .from('system_settings_admin')
        .upsert(settings)
        .select();

      if (error) throw error;
      return { success: true, settings: data };
    } catch (error) {
      console.error('Failed to update system settings:', error);
      return { success: false, error: error.message };
    }
  }

  // ============ BILLING MANAGEMENT ============
  async getBillingData(filters = {}) {
    try {
      let query = supabase
        .from('billing_data_admin')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get billing data:', error);
      return this.getMockBillingData();
    }
  }

  async processRefund(subscriptionId, amount, reason) {
    try {
      const { data, error } = await supabase.rpc('process_refund', {
        subscription_id: subscriptionId,
        amount,
        reason
      });

      if (error) throw error;
      return { success: true, refund: data };
    } catch (error) {
      console.error('Failed to process refund:', error);
      return { success: false, error: error.message };
    }
  }

  // ============ HELPER METHODS ============
  async createUserProfile(userId, userData) {
    return await supabase
      .from('user_profiles_admin')
      .insert({
        user_id: userId,
        plan_id: userData.planId || 'basic',
        status: 'active',
        created_at: new Date().toISOString()
      });
  }

  // ============ MOCK DATA FOR DEMO ============
  getMockUsers(filters = {}) {
    const mockUsers = [
      {
        id: 'user-1',
        email: 'john.doe@example.com',
        user_metadata: { first_name: 'John', last_name: 'Doe', role: 'user' },
        created_at: '2024-01-15T10:00:00Z',
        last_sign_in_at: '2024-01-20T14:30:00Z',
        plan_name: 'Pro',
        subscription_status: 'active',
        total_meetings: 45,
        last_activity: '2024-01-20T16:45:00Z'
      },
      // Add more mock users...
    ];

    return mockUsers.filter(user => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return user.email.toLowerCase().includes(search) ||
               user.user_metadata.first_name.toLowerCase().includes(search);
      }
      return true;
    });
  }

  getMockPlans() {
    return [
      {
        id: 'basic',
        name: 'Basic',
        description: 'Perfect for individuals',
        price: 0,
        billing_interval: 'monthly',
        features: ['Up to 5 event types', 'Basic integrations', 'Email support'],
        max_events: 50,
        max_integrations: 3,
        support_level: 'email',
        is_active: true
      },
      {
        id: 'pro',
        name: 'Professional',
        description: 'Best for professionals',
        price: 12,
        billing_interval: 'monthly',
        features: ['Unlimited events', 'Advanced integrations', 'Priority support'],
        max_events: -1,
        max_integrations: -1,
        support_level: 'priority',
        is_active: true
      }
    ];
  }

  getMockStats() {
    return {
      totalUsers: 1247,
      activeUsers: 892,
      revenue: 15420,
      securityAlerts: 3,
      userGrowth: 12,
      revenueGrowth: 23,
      churnRate: 2.1
    };
  }

  getMockRevenueData() {
    return [
      { date: '2024-01-01', amount: 12000, subscriptions: 100 },
      { date: '2024-01-02', amount: 12500, subscriptions: 105 },
      // Add more data...
    ];
  }

  getMockUserGrowthData() {
    return [
      { date: '2024-01-01', new_users: 15, total_users: 1200 },
      { date: '2024-01-02', new_users: 12, total_users: 1212 },
      // Add more data...
    ];
  }

  getMockSystemHealth() {
    return {
      status: 'healthy',
      uptime: 99.9,
      response_time: 120,
      error_rate: 0.01,
      active_connections: 450
    };
  }

  getMockAuditLogs() {
    return [
      {
        id: 'log-1',
        action: 'user_created',
        user_id: 'admin-1',
        target_id: 'user-123',
        details: { email: 'new.user@example.com' },
        created_at: '2024-01-20T10:00:00Z'
      }
    ];
  }

  getMockBillingData() {
    return [
      {
        id: 'bill-1',
        user_email: 'user@example.com',
        amount: 12,
        status: 'paid',
        plan_name: 'Pro',
        created_at: '2024-01-20T10:00:00Z'
      }
    ];
  }
}

export const adminService = new AdminService();