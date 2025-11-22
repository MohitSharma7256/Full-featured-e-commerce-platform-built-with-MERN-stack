// ============================================
// 1. Payment Routes (routes/PaymentRoutes.js)
// ============================================
const PaymentRouter = require("express").Router()
const { verifyUser } = require("../auth/authentication")
const { createOrder, verifyPayment, verifyOrderPayment } = require("../controllers/PaymentControllers")

// Route 1: Create Razorpay Order
PaymentRouter.post("/create-order", verifyUser, createOrder)

// Route 2: Verify Payment and Create Order
PaymentRouter.post("/verify", verifyUser, verifyPayment)

// Route 3: Verify Payment for Existing Order
PaymentRouter.post("/verify-order", verifyUser, verifyOrderPayment)

module.exports = PaymentRouter