const mongoose = require('mongoose')
<<<<<<< HEAD
=======
const config = require('config')
const dbUrl = config.get('mongoURI')
>>>>>>> 9af3125294361bf3e3e4e1cc5efdf2480a6b7dac

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV !== 'production'
        ? process.env.ourMongoURI
        : process.env.mongoURI,
      {
        // added to avoid bugs
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    )

    console.log('MongoDB is connected!')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
