const mongoose = require("mongoose");
const config = require("config");
const dbUrl = config.get("mongoURI");

const connectDB = async () => {
  try {
    console.log('connecting database....');
    await mongoose.connect(dbUrl, {
      // added to avoid bugs
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log("MongoDB is connected!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
