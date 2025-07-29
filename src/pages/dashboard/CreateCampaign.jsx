import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiCopy, FiEdit, FiSend, FiUsers, FiCalendar, FiClock, FiZap } from 'react-icons/fi';

const CreateCampaign = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    preheader: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    template: 'blank',
    content: '',
    recipients: [],
    scheduledDate: '',
    scheduledTime: '',
    sendNow: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalSteps = 4;
  
  const updateCampaignData = (field, value) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Campaign data submitted:', campaignData);
      
      // Redirect to campaigns list would happen here
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const templates = [
    { id: 'blank', name: 'Blank Template', description: 'Start from scratch' },
    { id: 'newsletter', name: 'Newsletter', description: 'Simple newsletter layout' },
    { id: 'announcement', name: 'Announcement', description: 'For product or feature announcements' },
    { id: 'promotion', name: 'Promotion', description: 'Highlight sales or special offers' },
    { id: 'event', name: 'Event Invitation', description: 'Invite users to your event' },
    { id: 'welcome', name: 'Welcome Email', description: 'Greet new subscribers' }
  ];
  
  const segments = [
    { id: 'all', name: 'All Subscribers', count: 2458 },
    { id: 'active', name: 'Active Customers', count: 1845 },
    { id: 'inactive', name: 'Inactive Subscribers', count: 613 },
    { id: 'new', name: 'New Subscribers (30 days)', count: 247 }
  ];
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Campaign Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Campaign Name*
                </label>
                <input
                  id="campaignName"
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => updateCampaignData('name', e.target.value)}
                  className="input w-full"
                  placeholder="e.g. June Newsletter"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  For internal use only. Recipients won't see this.
                </p>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject Line*
                </label>
                <div className="flex space-x-2">
                  <input
                    id="subject"
                    type="text"
                    value={campaignData.subject}
                    onChange={(e) => updateCampaignData('subject', e.target.value)}
                    className="input flex-1"
                    placeholder="e.g. Don't miss our latest updates!"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    title="Generate with AI"
                  >
                    <FiZap className="h-5 w-5 text-blue-600" />
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="preheader" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preheader
                </label>
                <input
                  id="preheader"
                  type="text"
                  value={campaignData.preheader}
                  onChange={(e) => updateCampaignData('preheader', e.target.value)}
                  className="input w-full"
                  placeholder="Brief summary shown after the subject line"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This text appears in email previews after the subject line.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From Name*
                  </label>
                  <input
                    id="fromName"
                    type="text"
                    value={campaignData.fromName}
                    onChange={(e) => updateCampaignData('fromName', e.target.value)}
                    className="input w-full"
                    placeholder="e.g. Your Company"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From Email*
                  </label>
                  <input
                    id="fromEmail"
                    type="email"
                    value={campaignData.fromEmail}
                    onChange={(e) => updateCampaignData('fromEmail', e.target.value)}
                    className="input w-full"
                    placeholder="e.g. hello@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="replyTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reply-to Email
                </label>
                <input
                  id="replyTo"
                  type="email"
                  value={campaignData.replyTo}
                  onChange={(e) => updateCampaignData('replyTo', e.target.value)}
                  className="input w-full"
                  placeholder="e.g. support@example.com"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  If left blank, the from email will be used.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose a Template</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      campaignData.template === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/5'
                    }`}
                    onClick={() => updateCampaignData('template', template.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{template.name}</h3>
                      {campaignData.template === template.id && (
                        <FiCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Content Editor</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  After selecting a template, you'll be able to edit the content in our visual editor.
                </p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={!campaignData.template}
                  >
                    <FiEdit className="mr-2 h-4 w-4" />
                    Edit Design
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={!campaignData.template}
                  >
                    <FiCopy className="mr-2 h-4 w-4" />
                    Import HTML
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-start">
                  <FiZap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">AI Content Generator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Let our AI create personalized, engaging content for your campaign based on a simple prompt.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                    >
                      Generate Content with AI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Choose Recipients</h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">Audience Segments</h3>
                </div>
                <div className="p-4 space-y-3">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        id={`segment-${segment.id}`}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={campaignData.recipients.includes(segment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateCampaignData('recipients', [...campaignData.recipients, segment.id]);
                          } else {
                            updateCampaignData('recipients', campaignData.recipients.filter(id => id !== segment.id));
                          }
                        }}
                      />
                      <label htmlFor={`segment-${segment.id}`} className="flex flex-1 items-center justify-between">
                        <span className="text-gray-900 dark:text-white font-medium">{segment.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{segment.count.toLocaleString()} subscribers</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Selected: {campaignData.recipients.length} segment(s)
                  </span>
                  <button
                    type="button"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Create New Segment
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-start">
                  <FiZap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">AI Audience Optimization</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Our AI can analyze your subscriber behavior and recommend the best audience segments for this campaign.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                    >
                      Get AI Recommendations
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Selected Recipients</h3>
                <div className="space-y-2">
                  {campaignData.recipients.length > 0 ? (
                    campaignData.recipients.map((recipientId) => {
                      const segment = segments.find(s => s.id === recipientId);
                      return (
                        <div key={recipientId} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{segment?.name}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{segment?.count.toLocaleString()} subscribers</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recipients selected yet. Please select at least one segment.
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total Recipients:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaignData.recipients.reduce((total, recipientId) => {
                        const segment = segments.find(s => s.id === recipientId);
                        return total + (segment?.count || 0);
                      }, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review & Schedule</h2>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">Campaign Summary</h3>
                </div>
                <div className="p-4">
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Campaign Name</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{campaignData.name || 'Not set'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Subject Line</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{campaignData.subject || 'Not set'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">From</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaignData.fromName ? `${campaignData.fromName} <${campaignData.fromEmail}>` : 'Not set'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Template</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {templates.find(t => t.id === campaignData.template)?.name || 'Not selected'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500 dark:text-gray-400">Recipients</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaignData.recipients.length > 0
                          ? campaignData.recipients.reduce((total, recipientId) => {
                              const segment = segments.find(s => s.id === recipientId);
                              return total + (segment?.count || 0);
                            }, 0).toLocaleString()
                          : 'None selected'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">Delivery Options</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="sendNow"
                      name="schedulingOption"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={campaignData.sendNow}
                      onChange={() => updateCampaignData('sendNow', true)}
                    />
                    <label htmlFor="sendNow" className="text-gray-900 dark:text-white font-medium">
                      Send immediately
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="scheduleForLater"
                      name="schedulingOption"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={!campaignData.sendNow}
                      onChange={() => updateCampaignData('sendNow', false)}
                    />
                    <label htmlFor="scheduleForLater" className="text-gray-900 dark:text-white font-medium">
                      Schedule for later
                    </label>
                  </div>
                  
                  {!campaignData.sendNow && (
                    <div className="pl-7 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Date
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiCalendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="scheduledDate"
                            type="date"
                            value={campaignData.scheduledDate}
                            onChange={(e) => updateCampaignData('scheduledDate', e.target.value)}
                            className="input pl-10 w-full"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Time
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiClock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="scheduledTime"
                            type="time"
                            value={campaignData.scheduledTime}
                            onChange={(e) => updateCampaignData('scheduledTime', e.target.value)}
                            className="input pl-10 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to="/dashboard/campaigns" className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Campaign</h1>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <div className={`flex-1 h-1 ${index < currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < currentStep ? 'bg-blue-500 text-white' : 
                  index === currentStep ? 'bg-blue-500 text-white' : 
                  'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <FiCheck className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Campaign Details</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Content</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Recipients</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Schedule</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step Content */}
          <div className="mb-8">
            {renderStepContent()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handlePrevious}
              className="btn btn-outline"
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => {}}
                className="btn btn-outline"
              >
                Save as Draft
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                >
                  Next <FiArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : campaignData.sendNow ? (
                    <>
                      <FiSend className="mr-2 h-4 w-4" /> Send Campaign
                    </>
                  ) : (
                    <>
                      <FiCalendar className="mr-2 h-4 w-4" /> Schedule Campaign
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;