const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      `Successfully connnected to mongoDB 👍`,
      dbConnection.connection.host
    );
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
