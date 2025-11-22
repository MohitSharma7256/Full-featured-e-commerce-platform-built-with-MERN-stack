const Razorpay = require("razorpay");
const crypto = require("crypto");
const Checkout = require("../models/Checkout");
const Product = require("../models/Product");
const mailer = require("../mailers/index"); // Import your mailer

// Initialize Razorpay instance with env credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Function to send order confirmation email
async function sendOrderConfirmationEmail(orderData, paymentMethod) {
  try {
    const customerEmail = orderData.customerEmail ||
      orderData.deliveryAddress?.email ||
      orderData.user?.email;

    const customerName = orderData.customerName ||
      orderData.deliveryAddress?.name ||
      orderData.user?.name ||
      'Customer';

    if (!customerEmail) {
      console.log("No customer email found for order confirmation");
      return false;
    }

    const emailSubject = `Order Confirmation - ${orderData._id} | ${process.env.SITE_NAME}`;

    // Format products list for email
    const productsList = orderData.products.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.product?.name || 'Product'}</strong><br>
          <small>Qty: ${item.quantity} | ₹${item.total}</small>
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 40px 0; background-color: #f5f5f5;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #0f12c0ff; padding: 25px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🛍️ ${process.env.SITE_NAME}</h1>
                  <p style="color: #ffffff; margin: 5px 0 0; font-size: 16px;">Order Confirmation</p>
                </td>
              </tr>

              <!-- Order Confirmation -->
              <tr>
                <td style="padding: 30px;">
                  <h2 style="color: #333333; margin-top: 0;">Thank You for Your Order!</h2>
                  <p style="color: #555555; font-size: 16px;">
                    Hi <strong>${customerName}</strong>,<br>
                    Your order has been confirmed and is being processed.
                  </p>

                  <!-- Order Details -->
                  <table width="100%" style="background-color: #f9f9f9; border-radius: 6px; padding: 15px; margin: 20px 0;">
                    <tr>
                      <td width="40%" style="font-weight: bold; color: #333333;">Order ID:</td>
                      <td style="color: #555555;">${orderData._id}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Order Date:</td>
                      <td style="color: #555555;">${new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Payment Method:</td>
                      <td style="color: #555555;">${paymentMethod}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Payment Status:</td>
                      <td style="color: #28a745; font-weight: bold;">${orderData.paymentStatus}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: bold; color: #333333;">Order Status:</td>
                      <td style="color: #555555;">${orderData.orderStatus}</td>
                    </tr>
                  </table>

                  <!-- Delivery Address -->
                  <h3 style="color: #333333; margin-bottom: 10px;">Delivery Address</h3>
                  <table width="100%" style="background-color: #f9f9f9; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                    <tr>
                      <td style="color: #555555;">
                        <strong>${orderData.deliveryAddress?.name || customerName}</strong><br>
                        ${orderData.deliveryAddress?.address || ''}<br>
                        ${orderData.deliveryAddress?.city || ''}, ${orderData.deliveryAddress?.state || ''} - ${orderData.deliveryAddress?.pin || ''}<br>
                        📞 ${orderData.deliveryAddress?.phone || 'N/A'}
                      </td>
                    </tr>
                  </table>

                  <!-- Order Items -->
                  <h3 style="color: #333333; margin-bottom: 10px;">Order Items</h3>
                  <table width="100%" style="background-color: #f9f9f9; border-radius: 6px; padding: 15px;">
                    ${productsList}
                  </table>

                  <!-- Order Summary -->
                  <table width="100%" style="margin-top: 20px; border-top: 2px solid #eee; padding-top: 15px;">
                    <tr>
                      <td width="70%" style="text-align: right; padding-right: 20px; color: #333333;">Subtotal:</td>
                      <td style="color: #333333; font-weight: bold;">₹${orderData.subtotal}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right; padding-right: 20px; color: #333333;">Delivery Charge:</td>
                      <td style="color: #333333; font-weight: bold;">${orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping}`}</td>
                    </tr>
                    <tr>
                      <td style="text-align: right; padding-right: 20px; color: #333333; font-size: 18px;"><strong>Total Amount:</strong></td>
                      <td style="color: #333333; font-size: 18px; font-weight: bold;">₹${orderData.total}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td align="center" style="padding: 20px 30px 30px;">
                  <a href="${process.env.SITE_FRONT_END_DOMAIN}/order-confirmation/${orderData._id}" 
                    style="background-color: #0f12c0ff; color: #ffffff; text-decoration: none; 
                            padding: 12px 28px; border-radius: 25px; display: inline-block; 
                            font-weight: bold; font-size: 16px;">
                    View Order Details
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #f9f9f9; padding: 20px;">
                  <p style="color: #888888; font-size: 14px; margin: 0;">
                    Need help? Contact our support team at <a href="mailto:${process.env.SITE_EMAIL}" style="color: #0f12c0ff; text-decoration: none;">${process.env.SITE_EMAIL}</a><br>
                    © 2025 ${process.env.SITE_NAME}. All Rights Reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    `;

    // Send email to customer
    await new Promise((resolve, reject) => {
      mailer.sendMail({
        from: process.env.MAIL_SENDER,
        to: customerEmail,
        subject: emailSubject,
        html: emailHtml
      }, (error) => {
        if (error) {
          console.error("Error sending order confirmation email:", error);
          reject(error);
        } else {
          console.log(`Order confirmation email sent to: ${customerEmail}`);
          resolve(true);
        }
      });
    });

    return true;
  } catch (error) {
    console.error("Error in sendOrderConfirmationEmail:", error);
    return false;
  }
}

// POST /payment/create-order
async function createOrder(req, res) {
  try {
    const { amount, currency = "INR", receipt, userEmail, userName } = req.body || {};

    if (!amount || amount <= 0) {
      return res.status(400).send({ result: "Fail", reason: "Invalid amount" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).send({ result: "Fail", reason: "Razorpay keys not configured" });
    }

    const options = {
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: {
        user: req.user?._id?.toString?.(),
        userEmail: userEmail,
        userName: userName
      },
    };

    const order = await razorpay.orders.create(options);

    return res.send({
      result: "Done",
      data: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Razorpay createOrder error:", error);
    return res.status(500).send({ result: "Fail", reason: error?.message || "Internal Server Error" });
  }
}

// POST /payment/verify
async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData, sendEmail = true } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).send({ result: "Fail", reason: "Missing payment verification fields" });
    }

    // Verify signature
    const signString = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signString)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).send({ result: "Fail", reason: "Invalid payment signature" });
    }

    // Create Checkout order document
    if (!orderData || !orderData.user || !orderData.deliveryAddress) {
      return res.status(400).send({ result: "Fail", reason: "Invalid order data" });
    }

    const checkoutDoc = new Checkout({
      ...orderData,
      paymentMode: "Razorpay",
      paymentStatus: "Paid",
      rppid: razorpay_payment_id,
      razorpayPaymentId: razorpay_payment_id,
      rpoid: razorpay_order_id,
      razorpayOrderId: razorpay_order_id,
      orderStatus: orderData.orderStatus || "Order is Placed",
    });

    await checkoutDoc.save();

    // Update Product Stock
    for (const item of orderData.products) {
      let p = await Product.findOne({ _id: item.product })
      if (p) {
        p.stockQuantity = p.stockQuantity - item.quantity
        p.stock = p.stockQuantity > 0
        await p.save()
      }
    }

    const finalData = await Checkout.findOne({ _id: checkoutDoc._id })
      .populate("user", ["name", "username", "email"])
      .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQuantity stock pic",
        populate: { path: "brand", select: "-_id name" },
        options: { slice: { pic: 1 } },
      });

    // Send order confirmation email
    if (sendEmail) {
      try {
        await sendOrderConfirmationEmail(finalData, "Razorpay (Online Payment)");
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Don't fail the order if email fails
      }
    }

    return res.send({
      result: "Done",
      data: finalData,
      message: "Payment verified and order placed successfully. Confirmation email sent."
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).send({ result: "Fail", reason: error?.message || "Internal Server Error" });
  }
}

// POST /payment/verify-order
async function verifyOrderPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).send({ result: "Fail", reason: "Missing payment verification fields" });
    }

    // Verify signature
    const signString = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(signString)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).send({ result: "Fail", reason: "Invalid payment signature" });
    }

    // Find existing order
    const order = await Checkout.findById(orderId);
    if (!order) {
      return res.status(404).send({ result: "Fail", reason: "Order not found" });
    }

    // Update Order
    order.paymentMode = "Razorpay";
    order.paymentStatus = "Paid";
    order.rppid = razorpay_payment_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.rpoid = razorpay_order_id;
    order.razorpayOrderId = razorpay_order_id;
    // Note: Stock is NOT updated here because it was already decremented when the COD order was placed.

    await order.save();

    const finalData = await Checkout.findOne({ _id: order._id })
      .populate("user", ["name", "username", "email"])
      .populate("deliveryAddress", ["name", "email", "phone", "address", "pin", "city", "state"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQuantity stock pic",
        populate: { path: "brand", select: "-_id name" },
        options: { slice: { pic: 1 } },
      });

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(finalData, "Razorpay (Online Payment for COD Order)");
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    return res.send({
      result: "Done",
      data: finalData,
      message: "Payment verified successfully."
    });
  } catch (error) {
    console.error("Order payment verification error:", error);
    return res.status(500).send({ result: "Fail", reason: error?.message || "Internal Server Error" });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  verifyOrderPayment,
  sendOrderConfirmationEmail, // Export for use in other controllers
};