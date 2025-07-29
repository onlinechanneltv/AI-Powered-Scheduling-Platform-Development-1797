import React from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiShield, FiBot, FiZap, FiUsers, FiTrendingUp } = FiIcons;

const LandingPage = () => {
  const features = [
    {
      icon: FiBot,
      title: 'AI-Powered Scheduling',
      description: 'Smart suggestions and automatic optimization for your calendar'
    },
    {
      icon: FiShield,
      title: 'Enterprise Security',
      description: '2FA, encryption, and advanced security features'
    },
    {
      icon: FiZap,
      title: 'Seamless Integrations',
      description: 'Connect with Zoom, Teams, Google Meet, and more'
    },
    {
      icon: FiUsers,
      title: 'Team Management',
      description: 'Manage team schedules and availability'
    },
    {
      icon: FiTrendingUp,
      title: 'Advanced Analytics',
      description: 'Insights into your scheduling patterns and productivity'
    },
    {
      icon: FiCalendar,
      title: 'Full Calendar Control',
      description: 'Complete control over your availability and booking rules'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AI Calendar</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The Future of <span className="text-blue-600">Smart Scheduling</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AI-powered calendar management with enterprise-grade security, seamless integrations, and intelligent
              scheduling optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium"
              >
                Start Free Trial
              </Link>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 text-lg font-medium">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for perfect scheduling
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From AI assistance to enterprise security, we've built the most comprehensive scheduling platform for
              modern teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                style={{ opacity: 1, transform: 'translateY(0)' }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your scheduling?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who trust AI Calendar for their scheduling needs.
            </p>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 text-lg font-medium"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <SafeIcon icon={FiCalendar} className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">AI Calendar</span>
          </div>
          <p className="text-gray-400">© 2024 AI Calendar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;