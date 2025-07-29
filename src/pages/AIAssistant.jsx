import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Button from '../components/ui/Button';
import { aiService } from '../services/aiService';
import { useCalendar } from '../contexts/CalendarContext';

const { FiBot, FiSend, FiTrendingUp, FiCalendar, FiClock } = FiIcons;

const AIAssistant = () => {
  const { events } = useCalendar();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI scheduling assistant. I can help you optimize your calendar, suggest meeting times, and provide insights about your scheduling patterns. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    generateInsights();
  }, [events]);

  const generateInsights = async () => {
    if (events.length > 0) {
      try {
        const eventData = events.map(event => ({
          title: event.title,
          duration: new Date(event.end_time) - new Date(event.start_time),
          date: event.start_time,
          attendees: event.attendees?.length || 1
        }));

        const aiInsights = await aiService.generateMeetingInsights(eventData);
        setInsights(aiInsights);
      } catch (error) {
        console.error('Failed to generate insights:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Mock AI response - in real app, this would call your AI service
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (userInput) => {
    // Mock AI responses based on user input
    const responses = {
      'optimize': 'Based on your calendar data, I recommend clustering similar meetings together and blocking time for deep work between 10-12 PM on Tuesdays and Thursdays when you seem most productive.',
      'schedule': 'I can help you find the best time for your next meeting. What type of meeting is it and how long do you need?',
      'insights': 'Here are your key scheduling insights: You have 23% more meetings this week than last week, your average meeting duration is 45 minutes, and your most productive time appears to be Tuesday mornings.',
      'default': 'I can help you with scheduling optimization, finding meeting times, analyzing your calendar patterns, and suggesting improvements. What would you like to focus on?'
    };

    const key = Object.keys(responses).find(k => 
      userInput.toLowerCase().includes(k)
    ) || 'default';

    return responses[key];
  };

  const quickActions = [
    {
      title: 'Optimize My Schedule',
      description: 'Get AI recommendations for better time management',
      icon: FiTrendingUp,
      action: () => setInputMessage('Please optimize my schedule for better productivity')
    },
    {
      title: 'Find Meeting Times',
      description: 'Suggest optimal times for new meetings',
      icon: FiCalendar,
      action: () => setInputMessage('Help me find the best time for a 1-hour team meeting this week')
    },
    {
      title: 'Schedule Analysis',
      description: 'Analyze my meeting patterns and habits',
      icon: FiClock,
      action: () => setInputMessage('Show me insights about my scheduling patterns')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-1">Get intelligent insights and suggestions for your calendar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-96"
          >
            {/* Chat Header */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiBot} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Calendar Assistant</h3>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your calendar..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || loading}
                  size="sm"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={action.icon} className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h2>
            <div className="space-y-3">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Meeting Frequency:</span> You have 15% more meetings than last week
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Optimal Time:</span> Tuesday 10-12 PM shows highest productivity
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Suggestion:</span> Consider 30-min buffer between meetings
                </p>
              </div>
            </div>
          </motion.div>

          {/* Usage Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Usage</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Queries this month</span>
                <span className="font-medium text-gray-900">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Optimizations suggested</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time saved</span>
                <span className="font-medium text-green-600">2.5 hours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;