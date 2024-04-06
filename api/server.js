// packages
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const morgan = require("morgan");
const router = require("./routes/index");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cookieParser = require("cookie-parser");

// Utiles

const connectDB = require("./config/db");

const port = process.env.PORT || 5000;
const publicDirectoryPath = path.join(__dirname, "public");

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
app.use(express.static(publicDirectoryPath));
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
