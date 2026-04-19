require('dotenv').config();
const express = require('express');
const OAuthClient = require('intuit-oauth');
const cors = require('cors');

const quickbooksRoutes = require("./routes/Quickbooks.routes");

const app = express();
app.use(cors({ origin: "*" }));

// app.use("/quickbooks", quickbooksRoutes);


const PORT = process.env.PORT || 3000;
console.log("ENV CHECK:", process.env.DATABASE_URL);
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT} `);

}); 