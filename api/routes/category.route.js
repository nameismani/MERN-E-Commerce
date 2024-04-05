const express = require("express");
const router = express.Router();
const {
  verifyToken,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  createCategory,
  updateCategory,
  removeCategory,
  readCategory,
  listCategory,
} = require("../controllers/category.controller");

router.route("/").post(verifyToken, authorizeAdmin, createCategory);
router.route("/categories").get(listCategory);
router
  .route("/:categoryId")
  .get(readCategory)
  .put(verifyToken, authorizeAdmin, updateCategory)
  .delete(verifyToken, authorizeAdmin, removeCategory);

// router
//   .route("/:categoryId")
//   .delete(authenticate, authorizeAdmin, removeCategory);

// router.route("/categories").get(listCategory);
// router.route("/:id").get(readCategory);

module.exports = router;
