// QuickBooks Token Repository
// All DB operations for QuickBooks OAuth tokens using Prisma.

const prisma = require("../db/db")

const quickbooksTokenRepository = {
  // Create a new record or update the existing one for this user (upsert)
  async saveTokens(realmId, tokenData) {
  const accessTokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

  return prisma.qboToken.upsert({
    where: { realmId },
    update: {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: accessTokenExpiresAt,
    },
    create: {
      realmId,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: accessTokenExpiresAt,
    },
  });
},

  // Fetch the token record for a user
  async getTokensByRealmId(realmId) {
    return prisma.qboToken.findUnique({
      where: { realmId },
    });
  },

  // Remove tokens when the user disconnects QuickBooks
  async deleteTokensByUserId(realmId) {
    await prisma.quickbooksToken.delete({
      where: { realmId },
    });
  },

  isAccessTokenExpired(tokens) {
  const now = new Date();
  const expiry = new Date(tokens.expiresAt);
  console.log("now:", now, "expiresAt:", expiry, "expired:", now >= expiry);
  return now >= expiry;
},

  isRefreshTokenExpired(tokens) {
    return new Date() >= new Date(tokens.refreshTokenExpiresAt);
  },
};

module.exports = quickbooksTokenRepository;