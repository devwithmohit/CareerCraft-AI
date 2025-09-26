import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  // Validate required environment variables
  const requiredVars = {
    kindeSecret: process.env.KINDE_CLIENT_SECRET,
    kindeClientId: process.env.KINDE_CLIENT_ID,
    kindeDomain: process.env.KINDE_DOMAIN,
    jwtSecret: process.env.JWT_SECRET,
  };

  // Check for missing required variables
  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required auth environment variables: ${missing.join(', ')}`);
  }

  return {
    // Kinde Configuration
    kindeSecret: requiredVars.kindeSecret,
    kindeClientId: requiredVars.kindeClientId,
    kindeDomain: requiredVars.kindeDomain,
    kindeRedirectUri: process.env.KINDE_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback`,
    kindeLogoutRedirectUri: process.env.KINDE_LOGOUT_REDIRECT_URI || process.env.FRONTEND_URL,
    
    // JWT Configuration
    jwtSecret: requiredVars.jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    
    // Session Configuration
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session-secret',
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
    
    // Security Settings
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutDuration: parseInt(process.env.LOCKOUT_DURATION) || 15 * 60 * 1000, // 15 minutes
    
    // OAuth Settings
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    
    // API Keys (for additional auth services if needed)
    passwordlessApiKey: process.env.PASSWORDLESS_API_KEY,
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  };
});