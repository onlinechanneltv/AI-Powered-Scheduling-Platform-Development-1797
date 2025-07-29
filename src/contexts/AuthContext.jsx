import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const token = Cookies.get('token');
    
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.get('/auth/me');
      
      if (response.status === 200) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setOrganizations(response.data.organizations || []);
        
        // Set current organization if exists in cookie or use first one
        const savedOrgId = Cookies.get('currentOrgId');
        if (savedOrgId && response.data.organizations.find(org => org.id === savedOrgId)) {
          setCurrentOrganization(response.data.organizations.find(org => org.id === savedOrgId));
        } else if (response.data.organizations && response.data.organizations.length > 0) {
          setCurrentOrganization(response.data.organizations[0]);
          Cookies.set('currentOrgId', response.data.organizations[0].id);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
      setUser(null);
      setIsAuthenticated(false);
      setOrganizations([]);
      setCurrentOrganization(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.status === 200) {
        const { token, user, organizations } = response.data;
        Cookies.set('token', token, { expires: 7 });
        setUser(user);
        setIsAuthenticated(true);
        setOrganizations(organizations || []);
        
        if (organizations && organizations.length > 0) {
          setCurrentOrganization(organizations[0]);
          Cookies.set('currentOrgId', organizations[0].id);
        }
        
        // Check if user needs onboarding
        if (user.needsOnboarding) {
          navigate('/onboarding/welcome');
        } else {
          navigate('/dashboard');
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (response.status === 201) {
        const { token, user } = response.data;
        Cookies.set('token', token, { expires: 7 });
        setUser(user);
        setIsAuthenticated(true);
        setOrganizations([]);
        setCurrentOrganization(null);
        
        navigate('/onboarding/welcome');
        return { success: true };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('currentOrgId');
    setUser(null);
    setIsAuthenticated(false);
    setOrganizations([]);
    setCurrentOrganization(null);
    navigate('/login');
  };

  const switchOrganization = (organizationId) => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      Cookies.set('currentOrgId', org.id);
    }
  };

  // Mock the API for demo purposes
  // In a real app, this would be handled by the actual API
  const createOrganization = async (organizationData) => {
    try {
      setLoading(true);
      // Mock API response
      const newOrg = {
        id: `org-${Date.now()}`,
        name: organizationData.name,
        logo: organizationData.logo || null,
        createdAt: new Date().toISOString(),
        role: 'owner'
      };
      
      const updatedOrgs = [...organizations, newOrg];
      setOrganizations(updatedOrgs);
      setCurrentOrganization(newOrg);
      Cookies.set('currentOrgId', newOrg.id);
      
      return { success: true, organization: newOrg };
    } catch (error) {
      console.error('Create organization failed:', error);
      const errorMsg = 'Failed to create organization. Please try again.';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes
  const demoLogin = () => {
    const demoUser = {
      id: 'demo-user',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@mailgenius.app',
      avatar: null,
      role: 'admin'
    };
    
    const demoOrg = {
      id: 'demo-org',
      name: 'Demo Organization',
      logo: null,
      createdAt: new Date().toISOString(),
      role: 'owner'
    };
    
    Cookies.set('token', 'demo-token', { expires: 1 });
    setUser(demoUser);
    setIsAuthenticated(true);
    setOrganizations([demoOrg]);
    setCurrentOrganization(demoOrg);
    Cookies.set('currentOrgId', demoOrg.id);
    
    navigate('/dashboard');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    organizations,
    currentOrganization,
    login,
    register,
    logout,
    checkAuth,
    switchOrganization,
    createOrganization,
    demoLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};