const mongoose = require("mongoose");
const User = require("../models/user.model");
const { hashPasswrod } = require("../utils/logics");

const getAllUser = async (req, res, next) => {
  const users = await User.find({}).select("-password");
  if (users.length > 0) {
    res.json({
      success: true,
      data: users,
    });
  } else {
    return next("No user found!");
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: `No User with id: ${id}`,
    });
  }

  try {
    const user = await User.findById(id).select("-password");
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404);
      return next("User not found");
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateCurrentUser = async (req, res, next) => {
  // console.log(req.body);
  // req.user = { userId: "660d92beb16ea8aedaa2508b" };
  const { userId } = req.user;
  const { username, email, password } = req.body;

  // if (userId !== req.params.userId) {
  //   return next(errorHandler(403, "You are not allowed to update this user"));
  // }
  //  const updateObject = {};
  //  if (username) updateObject.username = username;
  //  if (email) updateObject.email = email;
  //  if (password) {
  //    // Hash the provided password and update
  //    const salt = await bcrypt.genSalt(10);
  //    updateObject.password = await bcrypt.hash(password, salt);
  //  }

  //  // Update the user object with the dynamically constructed update object
  //  const updatedUser = await User.findByIdAndUpdate(userId, updateObject, {
  //    new: true, // Return the updated document
  //    runValidators: true, // Run validators for updates
  //  });
  if (!username && !email && !password) {
    return next("Please provide at least one field to be updated");
  }
  try {
    const user = await User.findById(req.user.userId);
    console.log(user.password, password == "");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Construct the update object dynamically based on the fields present in the request body
    const updateObject = {};
    if (username) updateObject.username = username ?? user.username;
    if (email) updateObject.email = email ?? user.email;
    if (password)
      updateObject.password =
        password == "" ? user.password : await hashPasswrod(password);

    // Update the user object with the dynamically constructed update object
    Object.assign(user, updateObject);

    // Save the updated user object
    await user.save();

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUserById = async (req, res, next) => {
  const { username, email, isAdmin } = req.body;
  const { id } = req.params;
  const user = await User.findById(req.params.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: `No User with id: ${id}`,
    });
  }

  try {
    const updateObject = {};
    if (username) updateObject.username = username;
    if (email) updateObject.email = email;
    if (isAdmin) updateObject.isAdmin = isAdmin;

    // Update the user using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(id, updateObject, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      res.status(404);
      return next("User not found");
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUserById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: `No User with id: ${id}`,
    });
  }

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        return next("Cannot delete admin user");
      }
      await User.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUser,
  getUserById,
  updateCurrentUser,
  updateUserById,
  deleteUserById,
};
