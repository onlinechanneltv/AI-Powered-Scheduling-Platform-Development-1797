// Mock Supabase client for demo purposes
const createMockClient = () => {
  // Store for auth state callbacks
  let authCallbacks = [];
  
  return {
    auth: {
      getSession: () => {
        // Check if we have a stored session
        const storedSession = localStorage.getItem('mock-session');
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            return Promise.resolve({ data: { session }, error: null });
          } catch (e) {
            localStorage.removeItem('mock-session');
            return Promise.resolve({ data: { session: null }, error: null });
          }
        }
        return Promise.resolve({ data: { session: null }, error: null });
      },
      onAuthStateChange: (callback) => {
        authCallbacks.push(callback);
        
        // Immediately check for existing session
        setTimeout(() => {
          const storedSession = localStorage.getItem('mock-session');
          if (storedSession) {
            try {
              const session = JSON.parse(storedSession);
              callback('SIGNED_IN', session);
            } catch (e) {
              localStorage.removeItem('mock-session');
              callback('SIGNED_OUT', null);
            }
          } else {
            callback('SIGNED_OUT', null);
          }
        }, 50);
        
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                authCallbacks = authCallbacks.filter(cb => cb !== callback);
              }
            }
          }
        };
      },
      signUp: (credentials) => {
        console.log('Mock signUp:', credentials);
        const userData = {
          id: 'mock-user-id',
          email: credentials.email,
          user_metadata: credentials.options?.data || {}
        };
        
        return Promise.resolve({
          data: { user: userData },
          error: null
        });
      },
      signInWithPassword: async (credentials) => {
        console.log('Mock signIn with credentials:', credentials);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if logging in as admin
        const email = credentials.email.toLowerCase();
        const password = credentials.password.toLowerCase();
        const isAdmin = email.includes('admin') || password === 'admin';
        
        console.log('Admin check:', { email, password, isAdmin });
        
        const userData = {
          id: isAdmin ? 'admin-user-id' : 'mock-user-id',
          email: credentials.email,
          user_metadata: {
            first_name: isAdmin ? 'Admin' : 'Demo',
            last_name: isAdmin ? 'User' : 'User',
            role: isAdmin ? 'admin' : 'user'
          }
        };

        const session = {
          user: userData,
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token'
        };

        // Store session in localStorage
        localStorage.setItem('mock-session', JSON.stringify(session));
        
        console.log('Session created and stored:', session);

        // Trigger auth state change callbacks immediately
        authCallbacks.forEach(callback => {
          console.log('Triggering auth callback with SIGNED_IN');
          callback('SIGNED_IN', session);
        });

        return Promise.resolve({
          data: { user: userData, session },
          error: null
        });
      },
      signOut: async () => {
        console.log('Mock signOut');
        localStorage.removeItem('mock-session');
        
        // Trigger auth state change callbacks
        authCallbacks.forEach(callback => {
          callback('SIGNED_OUT', null);
        });
        
        return Promise.resolve({ error: null });
      },
      resetPasswordForEmail: (email) => {
        console.log('Mock resetPassword:', email);
        return Promise.resolve({ error: null });
      }
    },
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: () => Promise.resolve({ data: mockData[table]?.[0] || null, error: null }),
          order: (column, options) => ({
            limit: (count) => Promise.resolve({ data: mockData[table] || [], error: null })
          }),
          limit: (count) => Promise.resolve({ data: mockData[table] || [], error: null })
        }),
        order: (column, options) => ({
          limit: (count) => Promise.resolve({ data: mockData[table] || [], error: null })
        }),
        gte: (column, value) => ({
          lte: (column, value) => Promise.resolve({ data: mockData[table] || [], error: null })
        }),
        single: () => Promise.resolve({ data: mockData[table]?.[0] || null, error: null })
      }),
      insert: (data) => ({
        select: () => ({
          single: () => Promise.resolve({
            data: { id: 'mock-id', ...data, created_at: new Date().toISOString() },
            error: null
          })
        })
      }),
      update: (data) => ({
        eq: (column, value) => ({
          select: () => ({
            single: () => Promise.resolve({
              data: { id: value, ...data, updated_at: new Date().toISOString() },
              error: null
            })
          })
        })
      }),
      upsert: (data) => Promise.resolve({ error: null }),
      delete: () => ({
        eq: (column, value) => Promise.resolve({ error: null })
      })
    })
  };
};

// Mock data for demo
const mockData = {
  events: [
    {
      id: 'event-1',
      title: 'Team Meeting',
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      user_id: 'mock-user-id'
    },
    {
      id: 'event-2',
      title: 'Client Call',
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      user_id: 'mock-user-id'
    }
  ],
  security_events: [
    {
      id: 'sec-1',
      event_type: 'login',
      created_at: new Date().toISOString(),
      ip_address: '192.168.1.1'
    }
  ],
  user_sessions: [
    {
      id: 'session-1',
      device_info: {
        browser: { name: 'Chrome' },
        os: { name: 'Windows' }
      },
      ip_address: '192.168.1.1',
      last_activity: new Date().toISOString(),
      is_active: true
    }
  ]
};

export const supabase = createMockClient();