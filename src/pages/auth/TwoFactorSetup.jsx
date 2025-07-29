import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Button from '../../components/ui/Button';
import { useSecurity } from '../../contexts/SecurityContext';
import { securityService } from '../../services/securityService';
import toast from 'react-hot-toast';

const { FiShield, FiSmartphone, FiCopy, FiCheck } = FiIcons;

const TwoFactorSetup = () => {
  const navigate = useNavigate();
  const { enableTwoFactor } = useSecurity();
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = async () => {
    try {
      const twoFactorSecret = securityService.generateTwoFactorSecret();
      setSecret(twoFactorSecret.base32);
      
      // Create a simple QR code placeholder using data URL
      const qrData = `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white" stroke="black" stroke-width="2"/>
          <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12">
            QR Code Placeholder
          </text>
          <text x="100" y="120" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="8">
            Use secret: ${twoFactorSecret.base32}
          </text>
        </svg>
      `)}`;
      
      setQrCodeUrl(qrData);
    } catch (error) {
      console.error('Failed to generate secret:', error);
      toast.error('Failed to generate 2FA secret');
    }
  };

  const handleVerifyAndEnable = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const result = await enableTwoFactor(secret, verificationCode);
      
      if (result.success) {
        const codes = securityService.generateBackupCodes();
        setBackupCodes(codes);
        setStep(3);
        toast.success('2FA enabled successfully!');
      } else {
        toast.error(result.error || 'Failed to enable 2FA');
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      toast.error('An error occurred during setup');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleFinish = () => {
    navigate('/app/security');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Enable Two-Factor Authentication</h1>
            <p className="text-gray-600">Add an extra layer of security to your account</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > stepNum ? <SafeIcon icon={FiCheck} className="w-4 h-4" /> : stepNum}
              </div>
            ))}
          </div>

          {/* Step 1: Install App */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <SafeIcon icon={FiSmartphone} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Install Authenticator App</h2>
                <p className="text-gray-600 mb-4">
                  Install an authenticator app like Google Authenticator or Authy on your mobile device.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Recommended Apps:</p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>• Google Authenticator</li>
                    <li>• Authy</li>
                    <li>• 1Password</li>
                    <li>• Microsoft Authenticator</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
              >
                I've Installed an App
              </Button>
            </motion.div>
          )}

          {/* Step 2: Scan QR Code */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Scan QR Code</h2>
                <p className="text-gray-600 mb-4">
                  Use your authenticator app to scan this QR code
                </p>
              </div>

              {qrCodeUrl && (
                <div className="flex justify-center">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border border-gray-200 rounded-lg" />
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Can't scan? Enter this code manually:
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={secret}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(secret)}
                  >
                    <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter verification code (use 123456 for demo)
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-mono"
                    maxLength={6}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyAndEnable}
                    loading={loading}
                    disabled={!verificationCode}
                    className="flex-1"
                  >
                    Verify & Enable
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <SafeIcon icon={FiCheck} className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 mb-2">2FA Enabled Successfully!</h2>
                <p className="text-gray-600 mb-4">
                  Save these backup codes in a safe place.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Backup Codes</h3>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  className="flex-1"
                >
                  Copy Codes
                </Button>
                <Button
                  onClick={handleFinish}
                  className="flex-1"
                >
                  Finish
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TwoFactorSetup;