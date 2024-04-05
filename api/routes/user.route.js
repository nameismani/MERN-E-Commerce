const express = require("express");
const router = express.Router();

const {
  verifyToken,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  getAllUser,
  updateCurrentUser,
  deleteUserById,
  getUserById,
  updateUserById,
} = require("../controllers/user.controller");

router.route("/").get(verifyToken, getAllUser);
//   .get(authenticate, authorizeAdmin, getAllUsers);

router
  .route("/profile")
  //   .get(authenticate, getCurrentUserProfile)
  .put(verifyToken, updateCurrentUser);

// ADMIN ROUTES 👇
router
  .route("/:id")
  .get(verifyToken, authorizeAdmin, getUserById)
  .put(verifyToken, authorizeAdmin, updateUserById)
  .delete(verifyToken, authorizeAdmin, deleteUserById);

module.exports = router;
