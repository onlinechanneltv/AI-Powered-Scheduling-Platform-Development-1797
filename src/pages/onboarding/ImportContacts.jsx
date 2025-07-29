import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiCheckCircle, FiArrowRight, FiMail, FiUsers, FiAlertCircle } from 'react-icons/fi';

const ImportContacts = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadComplete(true);
      setUploadStats({
        total: 250,
        valid: 238,
        invalid: 12,
        duplicates: 5
      });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleComplete = () => {
    navigate('/dashboard');
  };
  
  const importSources = [
    { name: 'CSV File', description: 'Upload contacts from a CSV file' },
    { name: 'Gmail', description: 'Import contacts from your Gmail account' },
    { name: 'Outlook', description: 'Import contacts from Microsoft Outlook' },
    { name: 'Mailchimp', description: 'Import your Mailchimp audience' },
    { name: 'HubSpot', description: 'Import contacts from HubSpot' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Import your contacts
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Start building your audience by importing your existing contacts.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Import contacts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a source to import your contacts
            </p>
          </div>
        </div>
        
        {!uploadComplete ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {importSources.map((source, index) => (
                <motion.div
                  key={source.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${index === 0 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {source.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {source.description}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <p className="font-medium text-gray-900 dark:text-white mb-4">
                Upload a CSV file
              </p>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                      <FiFile className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <button
                      type="button"
                      onClick={handleUpload}
                      className="btn btn-primary"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        'Upload file'
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleFileChange}
                      accept=".csv"
                      className="hidden"
                    />
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FiUpload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        or <span className="text-blue-600 dark:text-blue-400">browse files</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supported format: CSV
                      </p>
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400">
                  Download CSV template
                </a>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="btn btn-outline"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Import successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your contacts have been imported successfully.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {uploadStats.total}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total contacts
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                  {uploadStats.valid}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Valid contacts
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                  {uploadStats.invalid}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Invalid emails
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg text-center">
                <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {uploadStats.duplicates}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Duplicates
                </p>
              </div>
            </div>
            
            {uploadStats.invalid > 0 && (
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-300 rounded-lg">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  {uploadStats.invalid} contacts couldn't be imported due to invalid email formats.
                  <a href="#" className="font-medium ml-1">View details</a>
                </p>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleComplete}
                className="btn btn-primary px-8 py-3 flex items-center"
              >
                Continue to dashboard <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ImportContacts;