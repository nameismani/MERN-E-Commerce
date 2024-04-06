const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const uploadRoute = require("./upload.route");
const orderdRoute = require("./order.route");

const path = "/api/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}category`, categoryRoute);
router.use(`${path}products`, productRoute);
router.use(`${path}upload`, uploadRoute);
router.use(`${path}orders`, orderdRoute);

module.exports = router;
