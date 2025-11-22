// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./db-connect");
const Router = require("./routes/index");
const PaymentRouter = require("./routes/PaymentRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api", Router);
// app.use("/api/payment", PaymentRouter); // Removed redundant route

const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));