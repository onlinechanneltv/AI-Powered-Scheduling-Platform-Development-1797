import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/ui/Button';
import { useCalendar } from '../contexts/CalendarContext';
import { analyticsService } from '../services/analyticsService';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const { 
  FiTrendingUp, 
  FiClock, 
  FiUsers, 
  FiCalendar, 
  FiBarChart3, 
  FiPieChart, 
  FiDownload,
  FiFilter,
  FiTarget,
  FiBrain,
  FiZap
} = FiIcons;

const AnalyticsPage = () => {
  const { events } = useCalendar();
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('meetings');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, events]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.generateAnalytics(events, timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ];

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const MetricCard = ({ title, value, change, icon, color, bgColor, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center space-x-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <SafeIcon 
                icon={change.startsWith('+') ? FiTrendingUp : FiTrendingUp} 
                className="w-4 h-4" 
              />
              <span>{change}</span>
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <SafeIcon icon={icon} className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${color.replace('text-', 'bg-')}`}
                style={{ width: `${trend}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{trend}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );

  const ChartContainer = ({ title, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  const SimpleBarChart = ({ data, color = 'bg-blue-500' }) => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600 w-20">{item.label}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-full ${color} rounded-full`}
            />
          </div>
          <span className="text-sm font-medium text-gray-900 w-12 text-right">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );

  const ProductivityScore = ({ score, factors }) => (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <motion.path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : '#f59e0b'}
            strokeWidth="2"
            strokeDasharray={`${score}, 100`}
            initial={{ strokeDasharray: '0, 100' }}
            animate={{ strokeDasharray: `${score}, 100` }}
            transition={{ duration: 1.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-2xl font-bold text-gray-900">{score}</span>
            <p className="text-xs text-gray-600">Score</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {factors.map((factor, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{factor.name}</span>
            <span className={`font-medium ${
              factor.impact === 'positive' ? 'text-green-600' : 
              factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {factor.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Insights into your scheduling patterns and productivity</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button variant="outline">
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Meetings"
          value={analytics.totalMeetings}
          change={analytics.meetingsChange}
          icon={FiCalendar}
          color="text-blue-600"
          bgColor="bg-blue-50"
          trend={75}
        />
        <MetricCard
          title="Meeting Hours"
          value={`${analytics.totalHours}h`}
          change={analytics.hoursChange}
          icon={FiClock}
          color="text-green-600"
          bgColor="bg-green-50"
          trend={60}
        />
        <MetricCard
          title="Avg Duration"
          value={`${analytics.avgDuration}min`}
          change={analytics.durationChange}
          icon={FiBarChart3}
          color="text-purple-600"
          bgColor="bg-purple-50"
          trend={45}
        />
        <MetricCard
          title="Productivity Score"
          value={analytics.productivityScore}
          change={analytics.productivityChange}
          icon={FiTarget}
          color="text-orange-600"
          bgColor="bg-orange-50"
          trend={analytics.productivityScore}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Trends */}
        <ChartContainer title="Meeting Trends" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              {['meetings', 'duration', 'productivity'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
            <SimpleBarChart 
              data={analytics.weeklyTrends[selectedMetric]} 
              color="bg-primary-500"
            />
          </div>
        </ChartContainer>

        {/* Productivity Score */}
        <ChartContainer title="Productivity Analysis">
          <ProductivityScore 
            score={analytics.productivityScore}
            factors={analytics.productivityFactors}
          />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Distribution */}
        <ChartContainer title="Meeting Distribution by Day">
          <SimpleBarChart 
            data={analytics.dayDistribution}
            color="bg-green-500"
          />
        </ChartContainer>

        {/* Time Distribution */}
        <ChartContainer title="Time Distribution">
          <SimpleBarChart 
            data={analytics.timeDistribution}
            color="bg-purple-500"
          />
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Types */}
        <ChartContainer title="Meeting Types">
          <div className="space-y-4">
            {analytics.meetingTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-gray-700">{type.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{type.count}</span>
                  <span className="text-sm text-gray-500 ml-2">({type.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* AI Insights */}
        <ChartContainer title="AI Insights & Recommendations">
          <div className="space-y-4">
            {analytics.aiInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
              >
                <SafeIcon 
                  icon={insight.type === 'recommendation' ? FiBrain : FiZap} 
                  className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'recommendation' ? 'text-purple-600' : 'text-blue-600'
                  }`} 
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  {insight.impact && (
                    <p className="text-xs text-green-600 mt-1">
                      Potential impact: {insight.impact}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Detailed Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.detailedStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <SafeIcon icon={stat.icon} className={`w-8 h-8 ${stat.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
              {stat.trend && (
                <p className={`text-xs mt-1 ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend} vs last period
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Export Analytics</h2>
            <p className="text-gray-600">
              Download detailed reports and share insights with your team
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              Export PDF Report
            </Button>
            <Button variant="outline">
              Export CSV Data
            </Button>
            <Button>
              Schedule Report
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;