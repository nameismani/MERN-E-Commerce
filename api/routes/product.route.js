const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const {
  fetchProducts,
  addProduct,
  fetchAllProducts,
  addProductReview,
} = require("../controllers/Product.controller");
// controllers
const {
  verifyToken,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const checkId = require("../middlewares/checkId");

router
  .route("/")
  .get(fetchProducts)
  .post(verifyToken, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(verifyToken, checkId, addProductReview);

router.get("/top", fetchTopProducts);
// router.get("/new", fetchNewProducts);

// router
//   .route("/:id")
//   .get(fetchProductById)
//   .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
//   .delete(authenticate, authorizeAdmin, removeProduct);

// router.route("/filtered-products").post(filterProducts);

module.exports = router;
