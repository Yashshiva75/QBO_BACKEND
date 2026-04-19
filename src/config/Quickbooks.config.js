// QuickBooks OAuth2 configuration
// All values should be stored in environment variables, never hardcoded
require('dotenv').config();

const quickbooksConfig = {
  clientId: process.env.QB_CLIENT_ID,
  clientSecret: process.env.QB_CLIENT_SECRET,
  redirectUri: process.env.QB_REDIRECT_URI, 
  environment: process.env.QB_ENVIRONMENT || "sandbox",

  // OAuth2 endpoints differ between sandbox and production
  authBaseUrl: "https://appcenter.intuit.com/connect/oauth2",
  tokenUrl: "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
  revokeUrl: "https://developer.api.intuit.com/v2/oauth2/tokens/revoke",

  // Scopes define what your app can access
  scopes: ["com.intuit.quickbooks.accounting"],
};

module.exports = quickbooksConfig;