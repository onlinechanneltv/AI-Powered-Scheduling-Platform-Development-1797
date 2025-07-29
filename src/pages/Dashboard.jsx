import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiClock, FiUsers, FiTrendingUp, FiPlus } = FiIcons;

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayMeetings: 2,
    thisWeekMeetings: 8,
    totalHours: 12.5,
    upcomingMeetings: 3
  });

  const upcomingEvents = [
    {
      id: 'event-1',
      title: 'Team Meeting',
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString()
    },
    {
      id: 'event-2',
      title: 'Client Call',
      start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
    },
    {
      id: 'event-3',
      title: 'Product Demo',
      start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString()
    }
  ];

  const statCards = [
    {
      title: 'Today\'s Meetings',
      value: stats.todayMeetings,
      icon: FiCalendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Week',
      value: stats.thisWeekMeetings,
      icon: FiClock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Hours Scheduled',
      value: `${stats.totalHours}h`,
      icon: FiTrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Upcoming',
      value: stats.upcomingMeetings,
      icon: FiUsers,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Format date function
  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {formatDate(new Date())}
          </p>
        </div>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Quick Schedule</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            style={{ opacity: 1, transform: 'translateY(0)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ opacity: 1, transform: 'translateX(0)' }}
                >
                  <div className="w-2 h-12 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(event.start_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {index === 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Today
                      </span>
                    )}
                    {index === 1 && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Tomorrow
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiPlus} className="w-5 h-5" />
                  <span className="font-medium">Create Event Type</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiUsers} className="w-5 h-5" />
                  <span className="font-medium">Share Booking Link</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
                  <span className="font-medium">View Analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Insights</h2>
            <div className="space-y-3">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Peak productivity:</span> Tuesday 10-12 PM
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Suggestion:</span> Block 30min for deep work
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Trend:</span> 15% more meetings this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;