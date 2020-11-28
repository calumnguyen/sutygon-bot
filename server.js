const express = require('express')
const path = require('path')
const app = express()
const dotenv = require('dotenv')
const moment = require('moment')
const cron = require('node-cron')
const User = require('./models/User')
const { weekly, biWeekly, monthly } = require('./helpers/timePeriod')

const connectDB = require('./config/db')

// Load env vars
dotenv.config({ path: './config/config.env' })

connectDB()

// Middlewares
app.use(express.json({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))

// cron-job
//Run twice a dat at the start of 12am and 12pm.
cron.schedule('0 */12 * * *', async () => {
  console.log('salary effective date updated!')

  // Find only those users whose salary exist in db.
  const users = await User.find({ salary: { $ne: '' } }).select('salary')

  async function salaryCronJob() {
    for (user of users) {
      if (
        // Matching only(date-month-year) excluding Time(h.m.s.ms) because the cron job will run only once in a day at night 12.00 , not every minute...
        moment(
          user.salary.effective_date[user.salary.effective_date.length - 1]
        ).format(moment.HTML5_FMT.DATE) ===
        moment().format(moment.HTML5_FMT.DATE)
      ) {
        if (user.salary.period === 'weekly') {
          // check if weekly and update accordingly.
          user.salary.effective_date = weekly(user.salary.effective_date[0])
          await user.save()
        } else if (user.salary.period === 'bi-weekly') {
          // check if bi-weekly and update accordingly.
          user.salary.effective_date = biWeekly(user.salary.effective_date[1])
          await user.save()
        } else if (user.salary.period === 'monthly') {
          // check if monthly and update accordingly.
          user.salary.effective_date = monthly(user.salary.effective_date[0])
          await user.save()
        }
      }
    }
  }

  // Execute cronJob :)
  salaryCronJob()
})

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
