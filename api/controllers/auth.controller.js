const User = require("../models/user.model");
const asyncHandler = require("../middlewares/asyncMiddleware");
const { hashPasswrod } = require("../utils/logics");

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) return next("User already exists");
  const hashedPassword = await hashPasswrod(password);

  try {
    console.log(hashedPassword);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next("Please fill all the inputs.");
  }

  const existingUser = await User.findOne({ email });
  // console.log(existingUser);

  if (existingUser && (await existingUser.matchPassword(password))) {
    let token = existingUser.createJWT();
    res.status(201).cookie("access_token", token, {
      // httpOnly: true,
      //   sameSite: "strict",
      secure: true,
      // httpOnly: true,
      sameSite: "None",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      },
    });
    return;
  } else {
    res.status(400);
    return next("Invalid email or password");
  }
});

const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json({
      success: true,
      message: "User has been signed out",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  signIn,
  signout,
};
