const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  // console.log(req.cookies, token);
  if (!token) {
    return next("Unauthorized");
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next("Unauthorized token");
    }
    req.user = user;
    next();
  });
};
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

module.exports = {
  verifyToken,
  authorizeAdmin,
};
