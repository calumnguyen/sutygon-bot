const express = require('express')
const path = require('path')
const app = express()
const dotenv = require('dotenv')
const moment = require('moment')

const connectDB = require('./config/db')

const { weekly, biWeekly, monthly } = require('./helpers/timePeriod')

// console.log('-------------')
// weekly()
// biWeekly()
// monthly()
// console.log('-------------')

// Load env vars
dotenv.config({ path: './config/config.env' })

connectDB()

// Middlewares
app.use(express.json({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))
// Routes
app.use('/api/dashboard', require('./routes/api/dashboard'))
app.use('/api/users', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/inventory', require('./routes/api/inventory'))
app.use('/api/products', require('./routes/api/product'))
app.use('/api/customers', require('./routes/api/customer'))
app.use('/api/appointments', require('./routes/api/fittingappointments'))
app.use('/api/rentedproducts', require('./routes/api/rentaproduct'))
app.use('/api/reports', require('./routes/api/report'))
app.use('/api/returnproducts', require('./routes/api/returnproduct'))
app.use('/api/invoices', require('./routes/api/Invoices'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')) // relative path
  })
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server Running on port: ${port}`))
