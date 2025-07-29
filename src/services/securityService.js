class SecurityService {
  constructor() {
    this.rateLimitStore = new Map();
  }

  async logSecurityEvent(eventType, userId, metadata = {}) {
    console.log('Security event logged:', { eventType, userId, metadata });
    return Promise.resolve();
  }

  async getClientIP() {
    return '192.168.1.1'; // Mock IP
  }

  async getSecuritySettings(userId) {
    return {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30,
      allowedIPs: [],
      deviceTrust: true
    };
  }

  async updateSecuritySettings(userId, settings) {
    console.log('Security settings updated:', settings);
    await this.logSecurityEvent('settings_updated', userId);
    return Promise.resolve();
  }

  async getSecurityEvents(userId, limit = 50) {
    return [
      {
        id: 'sec-1',
        event_type: 'login',
        created_at: new Date().toISOString(),
        ip_address: '192.168.1.1'
      }
    ];
  }

  async getActiveSessions(userId) {
    return [
      {
        id: 'session-1',
        device_info: { browser: { name: 'Chrome' }, os: { name: 'Windows' } },
        ip_address: '192.168.1.1',
        last_activity: new Date().toISOString(),
        is_active: true
      }
    ];
  }

  async terminateSession(sessionId) {
    console.log('Session terminated:', sessionId);
    return Promise.resolve();
  }

  generateTwoFactorSecret() {
    return {
      base32: 'JBSWY3DPEHPK3PXP',
      otpauth_url: 'otpauth://totp/AI%20Calendar:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=AI%20Calendar'
    };
  }

  verifyTwoFactorToken(secret, token) {
    // Mock verification - in real app, use speakeasy
    return token === '123456';
  }

  async enableTwoFactor(userId, secret, token) {
    const isValid = this.verifyTwoFactorToken(secret, token);
    if (!isValid) {
      return { success: false, error: 'Invalid token' };
    }

    await this.logSecurityEvent('2fa_enabled', userId);
    return { success: true };
  }

  async disableTwoFactor(userId, token) {
    const isValid = this.verifyTwoFactorToken('mock-secret', token);
    if (!isValid) {
      return { success: false, error: 'Invalid token' };
    }

    await this.logSecurityEvent('2fa_disabled', userId);
    return { success: true };
  }

  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  async checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now();
    const key = identifier;
    
    if (!this.rateLimitStore.has(key)) {
      this.rateLimitStore.set(key, { attempts: 1, windowStart: now });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    const data = this.rateLimitStore.get(key);
    
    if (now - data.windowStart > windowMs) {
      this.rateLimitStore.set(key, { attempts: 1, windowStart: now });
      return { allowed: true, remaining: maxAttempts - 1 };
    }

    if (data.attempts >= maxAttempts) {
      return { allowed: false, remaining: 0, resetTime: data.windowStart + windowMs };
    }

    data.attempts++;
    this.rateLimitStore.set(key, data);
    return { allowed: true, remaining: maxAttempts - data.attempts };
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    };
  }
}

export const securityService = new SecurityService();