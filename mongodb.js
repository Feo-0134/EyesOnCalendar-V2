const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

var connString = ''

if (process.env.NODE_ENV === 'production') {
  connString = process.env.DB_CONNECTSTRING_PRODUCTION
} else {
  connString = process.env.DB_CONNECTSTRING_LOCAL
}

mongoose.connect(connString, { useNewUrlParser: true })
const db = mongoose.connection
module.exports = db
