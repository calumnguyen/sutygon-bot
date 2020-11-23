const moment = require('moment')

const weekly = (date = moment()) => {
  // console.log(date.startOf('isoWeek').add(1, 'week'))
  return moment(date).startOf('isoWeek').add(1, 'week')
}

const biWeekly = (date = moment()) => {
  let nextMonday = weekly(date)

  // create new instance
  let secondMonday = nextMonday.clone()
  secondMonday.startOf('isoWeek').add(1, 'week')

  // create new instance
  let thirdMonday = secondMonday.clone()
  thirdMonday.startOf('isoWeek').add(1, 'week')

  // console.log([nextMonday, thirdMonday])

  return [nextMonday, thirdMonday]
}

const monthly = (date = moment()) => {
  return moment(date).endOf('month').startOf('isoweek')
  // console.log(date.endOf('month').startOf('isoweek'))
}

module.exports = { weekly, biWeekly, monthly }
