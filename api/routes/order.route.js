const express = require("express");
const router = express.Router();

const {
  verifyToken,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  processPayment,
  sendStripeApi,
} = require("../controllers/order.controller");

router
  .route("/")
  .post(verifyToken, createOrder)
  .get(verifyToken, authorizeAdmin, getAllOrders);
router.route("/stripeapi").get(verifyToken, sendStripeApi);
router.route("/mine").get(verifyToken, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(verifyToken, findOrderById);
router.route("/:id/pay").put(verifyToken, markOrderAsPaid);
router.route("/payment/process").post(processPayment);

router
  .route("/:id/deliver")
  .put(verifyToken, authorizeAdmin, markOrderAsDelivered);

module.exports = router;
