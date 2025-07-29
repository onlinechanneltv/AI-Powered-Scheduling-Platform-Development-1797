import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCpu, FiLoader, FiEdit, FiCopy, FiThumbsUp, FiThumbsDown, FiZap, FiMail } from 'react-icons/fi';

const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your AI email marketing assistant. I can help you generate campaign ideas, write email copy, create subject lines, and more. What would you like help with today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const messagesEndRef = useRef(null);

  const aiFeatures = [
    {
      id: 'campaign-generator',
      title: 'Smart Campaign Generator',
      description: 'Generate a full campaign based on a short description',
      icon: FiZap,
      prompt: 'Generate a campaign for me about '
    },
    {
      id: 'subject-optimizer',
      title: 'Subject Line Optimizer',
      description: 'Create attention-grabbing subject lines with A/B testing suggestions',
      icon: FiMail,
      prompt: 'Write 5 subject lines for an email about '
    },
    {
      id: 'personalization',
      title: 'Auto-Personalization',
      description: 'Generate personalized content based on subscriber data',
      icon: FiEdit,
      prompt: 'Create personalized email content for '
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: prompt
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    // Simulate API call to AI service
    setTimeout(() => {
      let response;
      
      // Check for specific prompts and provide canned responses
      if (prompt.toLowerCase().includes('subject line') || prompt.toLowerCase().includes('subject lines')) {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: `Here are 5 engaging subject lines based on your request:\n\n1. "Don't Miss Out: Limited Time Offer Inside! 🔥"\n2. "Exclusive for You: The Solution You've Been Waiting For"\n3. "[Name], Here's Something Special Just for You"\n4. "Quick Question About Your Goals"\n5. "Proven Results: How Our Customers Achieved Success"\n\nFor A/B testing, I recommend trying #1 against #4 to compare direct offer vs. curiosity approach. The personalized subject line (#3) typically sees 26% higher open rates.`
        };
      } else if (prompt.toLowerCase().includes('campaign') && (prompt.toLowerCase().includes('generate') || prompt.toLowerCase().includes('create'))) {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: `I've created a campaign outline for you:\n\n**Campaign Name:** Seasonal Promotion\n\n**Target Audience:** Existing customers who haven't purchased in 30+ days\n\n**Email Sequence:**\n1. **Announcement Email (Day 1)**\n   - Subject: "The Season's Best Deals Are Here, [Name]!"\n   - Content: Introduction to promotion, key benefits, clear CTA\n\n2. **Value-Add Email (Day 3)**\n   - Subject: "Tips to Make the Most of Your Purchase"\n   - Content: Educational content related to products\n\n3. **Last Chance Email (Day 5)**\n   - Subject: "Last 24 Hours: Don't Miss Out!"\n   - Content: Urgency elements, testimonials, final CTA\n\nWould you like me to generate detailed content for any of these emails?`
        };
      } else {
        response = {
          id: messages.length + 2,
          role: 'assistant',
          content: `I've analyzed your request and here are my recommendations:\n\n${prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt} is a great starting point. Based on industry best practices, I suggest focusing on these key elements:\n\n1. Clear value proposition in the first paragraph\n2. Personalized elements using subscriber data\n3. A strong, action-oriented CTA\n4. Mobile-responsive design\n\nWould you like me to generate specific content based on these recommendations?`
        };
      }

      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 2000);
  };

  const handleFeatureSelect = (feature) => {
    setSelectedFeature(feature);
    setPrompt(feature.prompt);
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assistant</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Get intelligent suggestions and content for your email campaigns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI Features Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Features</h3>
            <div className="space-y-3">
              {aiFeatures.map(feature => (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureSelect(feature)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-start ${
                    selectedFeature?.id === feature.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <feature.icon className={`h-5 w-5 mt-0.5 ${
                    selectedFeature?.id === feature.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{feature.title}</h4>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
          >
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <FiCpu className="h-5 w-5" />
              <h3 className="text-lg font-medium">Pro Tips</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 mr-2 mt-1 flex-shrink-0"></span>
                <span>Be specific about your target audience</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 mr-2 mt-1 flex-shrink-0"></span>
                <span>Include your brand voice preferences</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 mr-2 mt-1 flex-shrink-0"></span>
                <span>Mention any specific CTA you want to include</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Chat Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3 card flex flex-col h-[calc(100vh-12rem)]"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'assistant'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1">
                        <FiCpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">AI Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  {message.role === 'assistant' && (
                    <div className="mt-3 flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyText(message.content)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs flex items-center"
                      >
                        <FiCopy className="h-3 w-3 mr-1" />
                        Copy
                      </button>
                      <button
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs flex items-center"
                      >
                        <FiThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </button>
                      <button
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs flex items-center"
                      >
                        <FiThumbsDown className="h-3 w-3 mr-1" />
                        Not helpful
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-white dark:bg-gray-700 shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1">
                      <FiCpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">AI Assistant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiLoader className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Generating response...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me to generate email content, subject lines, or campaign ideas..."
                className="input flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className={`btn ${!prompt.trim() || isLoading ? 'btn-secondary opacity-50' : 'btn-primary'}`}
              >
                {isLoading ? (
                  <FiLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <FiSend className="h-5 w-5" />
                )}
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              AI responses are generated based on your inputs. Review all content before sending to your audience.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIAssistant;