// packages
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
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
//nameismani-mern-ecommerce.netlify.app/
app.use(
  cors({
    // credentials: true,
    // optionsSuccessStatus: 200,
    methods: ["POST", "GET", "PUT", "PATCH"],
    origin: [
      "http://localhost:5173",
      "https://nameismani-mern-ecommerce.netlify.app",
    ],
  })
);
https: app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
app.use(errorMiddleware);
// app.get("/api/config/paypal", (req, res) => {
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
// });

// --------------------------deployment------------------------------
app.use(express.static(publicDirectoryPath));
const __dirname1 = path.resolve();
console.log(
  path.join(__dirname1, "client", "dist"),
  "asdf",
  process.env.NODE_ENV
);
if (process.env.NODE_ENV === "production") {
  console.log("production");
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname1, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    console.log("development");
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// const __dirname = path.resolve();

// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
