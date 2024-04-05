// packages
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const router = require("./routes/index");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");

// Utiles
const connectDB = require("./config/db");

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
app.use(errorMiddleware);
// app.get("/api/config/paypal", (req, res) => {
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
// });

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
