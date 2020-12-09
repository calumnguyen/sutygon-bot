const mongoose = require('mongoose')
<<<<<<< HEAD
const config = require('config')
const dbUrl = config.get('ourMongoURI')
=======
>>>>>>> 7547b2a8276aff62577c8a22b75aab4b71a9d60f

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
