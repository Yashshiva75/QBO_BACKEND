// QuickBooks Controller
const quickbooksService = require("../Services/Quickbooks.service");
const pendingStates = new Set();

const quickbooksController = {
  connect(req, res) {
    try {
      const { authUrl, state } = quickbooksService.buildAuthorizationUrl();

      pendingStates.add(state);

      res.redirect(authUrl);
    } catch (error) {
      console.error("QuickBooks connect error:", error.message);
      res.status(500).json({ success: false, message: "Failed to build authorization URL" });
    }
  },


async callback(req, res) {
  try {
    const { code, state, realmId } = req.query;

    if (!code || !realmId) {
      return res.status(400).json({ success: false, message: "Missing code or realmId" });
    }

    if (!state || !pendingStates.has(state)) {
      return res.status(400).json({ success: false, message: "Invalid state parameter" });
    }
    pendingStates.delete(state);

    const tokens = await quickbooksService.exchangeCodeForTokens(code, realmId);

    res.send(`
      <html>
        <body>
          <p>Authentication successful! Closing window...</p>
          <script>
            if (window.opener) {
              // 1. Pass the realmId to the main window
              window.opener.location.href = "https://qbo-frontend-react.onrender.com/?realmId=${tokens.realmId}";
              // 2. Close this popup
              window.close();
            } else {
              // Fallback if popup was blocked or lost
              window.location.href = "https://qbo-frontend-react.onrender.com/?realmId=${tokens.realmId}";
            }
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("QuickBooks callback error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Token exchange failed" });
  }
},

  async refreshToken(req, res) {
    try {
      const userId = req.user?.id || "demo-user";

      const tokens = await quickbooksService.refreshAccessToken(userId);

      res.status(200).json({
        success: true,
        message: "Access token refreshed",
        expiresAt: tokens.accessTokenExpiresAt,
      });
    } catch (error) {
      console.error("QuickBooks refresh error:", error.message);

      // If the refresh token is also expired, the user needs to reconnect
      const isExpired = error.message.includes("Refresh token has expired");
      res.status(isExpired ? 401 : 500).json({
        success: false,
        message: error.message,
      });
    }
  },

};

module.exports = quickbooksController;