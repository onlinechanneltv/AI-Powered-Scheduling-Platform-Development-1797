import axios from 'axios';
import Cookies from 'js-cookie';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.mailgenius.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Mock API methods for demo purposes
const mockData = {
  campaigns: [],
  contacts: [],
  templates: [],
  analytics: {}
};

// API methods
export const createMockCampaign = (campaignData) => {
  const newCampaign = {
    id: `campaign-${Date.now()}`,
    ...campaignData,
    createdAt: new Date().toISOString(),
    status: 'draft',
    stats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      complained: 0,
      unsubscribed: 0
    }
  };
  
  mockData.campaigns.push(newCampaign);
  return Promise.resolve({ data: newCampaign });
};

export const getMockCampaigns = () => {
  return Promise.resolve({ data: mockData.campaigns });
};

export const getMockCampaign = (id) => {
  const campaign = mockData.campaigns.find(c => c.id === id);
  if (campaign) {
    return Promise.resolve({ data: campaign });
  }
  return Promise.reject({ response: { status: 404, data: { message: 'Campaign not found' } } });
};

export default api;