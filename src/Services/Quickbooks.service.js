// QuickBooks OAuth Service
// Contains the core logic for each step of the OAuth2 flow:
// 1. Build the authorization URL
// 2. Exchange the callback code for tokens
// 3. Refresh an expired access token

const axios = require("axios");
const crypto = require("crypto");
const config = require("../config/Quickbooks.config");
const tokenRepository = require("../Repository/Quickbooks.reposiotry");

const quickbooksService = {
  // Step 1: Build the Intuit authorization URL
  // The user is redirected here to grant your app access to their QuickBooks data
  buildAuthorizationUrl() {
    const state = crypto.randomBytes(16).toString("hex");

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: config.scopes.join(" "),
      state,
    });

    const authUrl = `${config.authBaseUrl}?${params.toString()}`;
    return { authUrl, state };
  },

  // Step 2: Exchange the authorization code for access and refresh tokens
  // Called after Intuit redirects back to your redirect URI with ?code=...&realmId=...
  async exchangeCodeForTokens(code, realmId) {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

    const response = await axios.post(
      config.tokenUrl,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: config.redirectUri,
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    const tokenData = { ...response.data, realmId };
    const saved = await tokenRepository.saveTokens(realmId, tokenData);
    return saved;
  },

  // Step 3: Use the refresh token to get a new access token
  async refreshAccessToken(realmId) {
    const tokens = await tokenRepository.getTokensByRealmId(realmId);

    if (!tokens) {
      throw new Error("No tokens found for user");
    }

    if (tokenRepository.isRefreshTokenExpired(tokens)) {
      throw new Error("Refresh token has expired. User must re-authenticate.");
    }

    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

    const response = await axios.post(
      config.tokenUrl,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: tokens.refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    // Save new tokens, keeping the same realmId
    const updated = await tokenRepository.saveTokens(realmId, {
      ...response.data,
      realmId: tokens.realmId,
    });

    return updated;
  },

  // Helper: Return valid tokens for a user, auto-refreshing if the access token is expired
  async getValidTokens(realmId) {
  const tokens = await tokenRepository.getTokensByRealmId(realmId);

  if (!tokens) throw new Error("No tokens found — user must reconnect");

  console.log("token expiresAt:", tokens.expiresAt);
  console.log("is expired:", tokenRepository.isAccessTokenExpired(tokens));

  if (tokenRepository.isAccessTokenExpired(tokens)) {
    console.log("refreshing access token...");
    return await quickbooksService.refreshAccessToken(realmId);
  }

  return tokens;
},
};

module.exports = quickbooksService;