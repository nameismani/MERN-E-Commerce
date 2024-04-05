const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestaps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });
userSchema.methods.createJWT = function () {
  return JWT.sign(
    { userId: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
